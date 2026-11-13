'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './LoadingScreen.module.scss';

export const LoadingScreen = () => {
  const input = useSearchParams().get('input');

  return (
    <main className={styles.page} aria-busy="true">
      <Link href="/" className={styles.back}>
        <span className={styles.backIcon} aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </span>
        New search
      </Link>

      {input && <p className={styles.request}>{input}</p>}

      <div className={styles.status} role="status">
        <svg
          width="76"
          height="76"
          viewBox="0 0 76 76"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className={styles.spinnerTrack}
            cx="38"
            cy="38"
            r="32"
            strokeWidth="8"
          />
          <path
            className={styles.spinnerArc}
            d="M38 6a32 32 0 0 1 32 32"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            className={styles.spinnerSparkle}
            d="M38 28l2.4 7 7 2.4-7 2.4-2.4 7-2.4-7-7-2.4 7-2.4z"
          />
        </svg>
        <h1 className={styles.title}>Finding where you should go</h1>
        <p className={styles.subtitle}>Usually takes about 15 seconds</p>
      </div>

      <aside className={styles.tip}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        <p>
          <strong>Tip:</strong> the more you tell us (dates, budget, who is
          travelling, where from), the better the matches.
        </p>
      </aside>
    </main>
  );
};
