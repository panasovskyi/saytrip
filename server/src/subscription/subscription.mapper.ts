import { Subscription } from '../generated/prisma/client';
import { PublicSubscription } from './subscription.types';

export function toPublicSubscription(subscription: Subscription): PublicSubscription {
  return {
    id: subscription.id,
    plan: subscription.plan,
    currentPeriodEnd: subscription.currentPeriodEnd,
    cancelledAt: subscription.cancelledAt,
    createdAt: subscription.createdAt,
    updatedAt: subscription.updatedAt
  }
}