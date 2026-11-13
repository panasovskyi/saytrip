import styles from './EmptyResults.module.scss';

export const EmptyResults = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.empty}>
        <div className={styles.icon}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </div>

        <h3 className={styles.title}>No destinations found</h3>
        <p className={styles.description}>
          We couldn&apos;t find places for this request. Describe a trip: when
          you want to go, your budget, who is travelling and where from. Then
          press Update.
        </p>
      </div>
    </div>
  );
};
