import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Subscription } from '../generated/prisma/client';
import { StripeSubscriptionState } from './subscription.types';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async createFree(
    userId: string,
    db: Prisma.TransactionClient = this.prisma,
  ): Promise<Subscription> {
    const subscription = await db.subscription.create({
      data: {
        plan: 'FREE',
        userId,
      },
    });

    return subscription;
  }

  async getByUserId(userId: string): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    return subscription;
  }

  async setStripeCustomerId({
    userId,
    stripeCustomerId,
  }: {
    userId: string;
    stripeCustomerId: string;
  }): Promise<Subscription> {
    const subscription = await this.prisma.subscription.update({
      where: { userId },
      data: { stripeCustomerId },
    });

    return subscription;
  }

  async findByStripeCustomerId(
    stripeCustomerId: string,
  ): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { stripeCustomerId },
    });

    return subscription;
  }

  async applyStripeState({
    userId,
    ...state
  }: StripeSubscriptionState): Promise<Subscription> {
    const subscription = await this.prisma.subscription.update({
      where: { userId },
      data: { ...state },
    });

    return subscription;
  }
}