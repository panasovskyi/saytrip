import { Prisma, User } from '../generated/prisma/client';
import { PublicSubscription } from '../subscription/subscription.types';

export type UserWithSubscription = Prisma.UserGetPayload<{
  include: { subscription: true };
}>;

export type PublicUser = Omit<
  UserWithSubscription,
  'passwordHash' | 'subscription'
> & { subscription: PublicSubscription | null };

export type CreateUserData = Pick<
  User,
  'email' | 'name' | 'passwordHash' | 'termsAcceptedAt'
>;
