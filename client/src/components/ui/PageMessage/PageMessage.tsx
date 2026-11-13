import Link from 'next/link';
import styles from './PageMessage.module.scss';

type LinkAction = { label: string; href: string };
type ButtonAction = { label: string; onClick: () => void };
type Action = LinkAction | ButtonAction;

type Props = {
  variant?: 'error' | 'wait';
  title: string;
  description: string;
  primaryAction: Action;
  secondaryAction?: Action;
};

const renderAction = (action: Action, className: string) =>
  'href' in action ? (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  ) : (
    <button type="button" className={className} onClick={action.onClick}>
      {action.label}
    </button>
  );

export const PageMessage = ({
  variant = 'error',
  title,
  description,
  primaryAction,
  secondaryAction,
}: Props) => {
  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div
          className={`${styles.icon} ${variant === 'wait' ? styles.iconWait : styles.iconError}`}
        >
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
            {variant === 'wait' ? (
              <>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </>
            ) : (
              <>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </>
            )}
          </svg>
        </div>

        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>

        <div className={styles.actions}>
          {renderAction(primaryAction, styles.primary)}
          {secondaryAction && renderAction(secondaryAction, styles.secondary)}
        </div>
      </section>
    </main>
  );
};
