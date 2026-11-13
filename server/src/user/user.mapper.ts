import { toPublicSubscription } from '../subscription/subscription.mapper';
import { PublicUser, UserWithSubscription } from './user.types';

export function toPublicUser(user: UserWithSubscription): PublicUser {
  return {
    name: user.name,
    termsAcceptedAt: user.termsAcceptedAt,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    id: user.id,
    subscription: user.subscription
      ? toPublicSubscription(user.subscription)
      : null,
  };
}
