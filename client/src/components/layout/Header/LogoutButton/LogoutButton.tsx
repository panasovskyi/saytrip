'use client';

import { authApi } from '@/features/auth/auth.api';
import styles from './LogoutButton.module.scss';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const LogoutButton = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsPending(true);
      await authApi.logout();
    } catch (error) {
      console.error(error);
      return;
    } finally {
      setIsPending(false);
    }
    
    router.push("/");
    router.refresh();
  };

  return (
    <button type="button" className={styles.navLogout}
      onClick={handleLogout}
      disabled={isPending}
    >
      Logout
    </button>
  )
}