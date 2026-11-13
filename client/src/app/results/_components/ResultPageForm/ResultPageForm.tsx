'use client';

import { useRouter } from 'next/navigation';
import styles from './ResultPageForm.module.scss';
import { useRequestText } from '@/app/results/_components/RequestProvider/RequestProvider';
import {
  getRequestStatus,
  MAX_REQUEST_LENGTH,
  MIN_REQUEST_LENGTH,
} from '@/lib/request-limits';

export const ResultPageForm: React.FC = () => {
  const { text, setText } = useRequestText();
  const { isDisabled, isTooShort } = getRequestStatus(text);
  const router = useRouter();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams({ input: text.trim() });

    router.push(`/results?${params.toString()}`);
  };

  return (
    <form className={styles.requestForm} onSubmit={handleSubmit}>
      <div className={styles.requestField}>
        <label htmlFor="request" className={styles.requestLabel}>
          Your request
        </label>
        <textarea
          id="request"
          name="input"
          aria-describedby="request-hint"
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={styles.requestInput}
          maxLength={MAX_REQUEST_LENGTH}
        ></textarea>
        <p
          id="request-hint"
          className={`${styles.requestHint} ${isTooShort ? styles.requestHintWarn : ""}`}
        >
          At least {MIN_REQUEST_LENGTH} characters
        </p>
      </div>
      <button type="submit" className={styles.updateButton} disabled={isDisabled}>
        Update
      </button>
    </form>
  )
}