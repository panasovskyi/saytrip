import { Subscription } from '@/features/subscription/subscription.types';

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;

  subscription: Subscription;
}