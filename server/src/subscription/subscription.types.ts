import { Subscription } from '../generated/prisma/client';

export type PublicSubscription = Pick<
  Subscription,
  'id' | 'plan' | 'currentPeriodEnd' | 'cancelledAt' | 'createdAt' | 'updatedAt'
  >;

  export type StripeSubscriptionState = Pick<
    Subscription,
    | 'userId'
    | 'plan'
    | 'stripeSubscriptionId'
    | 'currentPeriodEnd'
    | 'cancelledAt'
  >;
