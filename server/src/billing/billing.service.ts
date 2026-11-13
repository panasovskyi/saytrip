import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Env } from '../config/env.schema';
import { STRIPE_CLIENT } from '../stripe/stripe.constants';
import {
  PaidPlan,
  STRIPE_PRICE_IDS,
  planFromPriceId,
} from '../subscription/subscription.prices';
import { SubscriptionService } from '../subscription/subscription.service';
import { UserService } from '../user/user.service';
import { CheckoutSessionResponse } from './billing.types';
import { ApiError } from '../exceptions/api-error.exception';
import { UserWithSubscription } from '../user/user.types';

const PAID_STATUSES: Stripe.Subscription.Status[] = [
  'active',
  'trialing',
  'past_due',
];

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    private readonly config: ConfigService<Env, true>,
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async createCheckoutSession(
    userId: string,
    plan: PaidPlan,
  ): Promise<CheckoutSessionResponse> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw ApiError.notFound('User does not exist');
    }

    const subscription = user.subscription;

    if (!subscription) {
      throw new ApiError({
        message: 'Subscription not found',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    if (subscription.plan !== 'FREE') {
      throw ApiError.conflict(
        subscription.plan === plan
          ? 'You already have this plan'
          : 'You must have free subscription to buy plan',
      );
    }

    const customerId = await this.ensureCustomer(
      user,
      subscription.stripeCustomerId,
    );
    const paidSubscription = await this.findPaidSubscription(customerId);

    if (paidSubscription) {
      await this.syncSubscription(paidSubscription.id);
      throw ApiError.conflict('You already have a subscription');
    }

    const clientUrl = this.config.get('CLIENT_URL', { infer: true });
    await this.expireOpenSessions(customerId);

    const session = await this.callStripe(() =>
      this.stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customerId,
        line_items: [{ price: STRIPE_PRICE_IDS[plan], quantity: 1 }],
        success_url: `${clientUrl}/account?checkout=success`,
        cancel_url: `${clientUrl}/account`,
        client_reference_id: userId,
        subscription_data: { metadata: { userId } },
      }),
    );

    if (!session.url) {
      this.logger.error(`Checkout session ${session.id} has no url`);
      throw ApiError.badGateway('Could not start checkout. Please try again.');
    }

    return { url: session.url };
  }

  async handleWebhook(
    rawBody: Buffer | undefined,
    signature: string | undefined,
  ): Promise<void> {
    const event = this.constructEvent(rawBody, signature);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await this.syncSubscription(event.data.object.id);
        break;
      default:
        break;
    }
  }

  private constructEvent(
    rawBody: Buffer | undefined,
    signature: string | undefined,
  ): Stripe.Event {
    if (!rawBody || !signature) {
      throw ApiError.badRequest('Missing webhook signature');
    }

    try {
      return this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.config.get('STRIPE_WEBHOOK_SECRET', { infer: true }),
      );
    } catch (error) {
      this.logger.warn(
        `Webhook signature check failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw ApiError.badRequest('Invalid webhook signature');
    }
  }

  private async syncSubscription(stripeSubscriptionId: string): Promise<void> {
    const subscription = await this.callStripe(() =>
      this.stripe.subscriptions.retrieve(stripeSubscriptionId),
    );

    const customerId =
      typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id;

    const row =
      await this.subscriptionService.findByStripeCustomerId(customerId);

    if (!row) {
      this.logger.error(
        `No subscription row for Stripe customer ${customerId}`,
      );
      throw new ApiError({
        message: 'Subscription not found',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    if (!PAID_STATUSES.includes(subscription.status)) {
      if (
        row.stripeSubscriptionId &&
        row.stripeSubscriptionId !== subscription.id
      ) {
        return;
      }

      await this.subscriptionService.applyStripeState({
        userId: row.userId,
        plan: 'FREE',
        stripeSubscriptionId: null,
        currentPeriodEnd: null,
        cancelledAt: null,
      });
      return;
    }

    const item = subscription.items.data[0];
    const plan = planFromPriceId(item.price.id);

    if (!plan) {
      this.logger.error(
        `Unknown Stripe price ${item.price.id} in subscription ${subscription.id}`,
      );
      throw new ApiError({
        message: 'Unknown price',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    await this.subscriptionService.applyStripeState({
      userId: row.userId,
      plan,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: new Date(item.current_period_end * 1000),
      cancelledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
    });

    await this.expireOpenSessions(customerId);
  }

  private async callStripe<T>(call: () => Promise<T>): Promise<T> {
    try {
      return await call();
    } catch (error) {
      this.logger.error(
        'Stripe request failed',
        error instanceof Error ? error.stack : String(error),
      );
      throw ApiError.badGateway(
        'Payment service is unavailable. Please try again later.',
      );
    }
  }

  private async ensureCustomer(
    user: UserWithSubscription,
    savedCustomerId: string | null,
  ): Promise<string> {
    if (savedCustomerId && (await this.customerExists(savedCustomerId))) {
      return savedCustomerId;
    }

    const customer = await this.callStripe(() =>
      this.stripe.customers.create(
        {
          email: user.email,
          name: user.name,
          metadata: { userId: user.id },
        },
        {
          idempotencyKey: savedCustomerId
            ? `customer-recreate-${user.id}-${savedCustomerId}`
            : `customer-create-${user.id}`,
        },
      ),
    );

    await this.subscriptionService.setStripeCustomerId({
      userId: user.id,
      stripeCustomerId: customer.id,
    });

    return customer.id;
  }

  private customerExists(customerId: string): Promise<boolean> {
    return this.callStripe(async () => {
      try {
        const customer = await this.stripe.customers.retrieve(customerId);

        return !customer.deleted;
      } catch (error) {
        if (
          error instanceof Stripe.errors.StripeInvalidRequestError &&
          error.code === 'resource_missing'
        ) {
          return false;
        }

        throw error;
      }
    });
  }

  private async expireOpenSessions(customerId: string): Promise<void> {
    const sessions = await this.callStripe(() =>
      this.stripe.checkout.sessions.list({
        customer: customerId,
        status: 'open',
      }),
    );

    for (const session of sessions.data) {
      try {
        await this.stripe.checkout.sessions.expire(session.id);
      } catch (error) {
        this.logger.warn(
          `Could not expire checkout session ${session.id}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }

  private async findPaidSubscription(
    customerId: string,
  ): Promise<Stripe.Subscription | undefined> {
    const subscriptions = await this.callStripe(() =>
      this.stripe.subscriptions.list({ customer: customerId }),
    );

    return subscriptions.data.find((item) =>
      PAID_STATUSES.includes(item.status),
    );
  }
}
