import { authApi } from '@/features/auth/auth.api';
import { User } from '@/features/auth/auth.types';
import { ApiError } from '@/lib/api-error';
import { cookies } from 'next/headers';

export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies();

  try {
    return await authApi.getMyProfile(cookieStore.toString());
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}