import Link from "next/link";
import styles from "./Header.module.scss";
import { cookies } from "next/headers";
import { LogoutButton } from '@/components/layout/Header/LogoutButton/LogoutButton';


export const Header = async () => {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("access_token");

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <span aria-hidden="true" className={styles.logoMark}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 3L3 10.5l7.5 3L14 21z" />
            <path d="M10.5 13.5L21 3" />
          </svg>
        </span>
        <span>
          say<span className={styles.logoAccent}>trip</span>
        </span>
      </Link>
      <nav aria-label="Main menu" className={styles.nav}>
        <Link href="/#how">How it works</Link>
        <Link href="/#ideas">Ideas</Link>
        <a href="#">Saved</a>
        {isLoggedIn ? (
          <>
            <Link href="/account">My account</Link>
            <LogoutButton />
          </>
        ) : (
          <Link href="/login" className={styles.navLogin}>
            Log in
          </Link>
        )}
      </nav>
    </header>
  );
};
