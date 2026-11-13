'use client';

import { useState } from 'react';
import styles from './HomepageForm.module.scss';
import { useRouter } from 'next/navigation';
import { appendPhrase } from '@/lib/append-phrase';
import {
  getRequestStatus,
  MAX_REQUEST_LENGTH,
  MIN_REQUEST_LENGTH,
} from '@/lib/request-limits';

type Chip = {
  label: string;
  phrase: string;
};

const CHIPS: Chip[] = [
  {
    label: "With kids",
    phrase: "with kids",
  },
  {
    label: "Warm sea",
    phrase: "warm sea",
  },
  {
    label: "Under €1,000",
    phrase: "under €1,000",
  },
  {
    label: "Weekend",
    phrase: "weekend",
  },
  {
    label: "Mountains",
    phrase: "mountains",
  },
];

export const HomepageForm = () => {
  const [text, setText] = useState('');
  const { isDisabled, isTooShort } = getRequestStatus(text);
  const router = useRouter();

  const handleChipClick = (phrase: string) => {
    setText((prev) => appendPhrase(prev, phrase));
  };

  
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("input", text.trim());

    router.push(`/results?${params.toString()}`)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="trip" className={styles.formLabel}>
        What kind of trip do you want?
      </label>
      <textarea
        id="trip"
        name="trip"
        aria-describedby="trip-hint"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={styles.formInput}
        maxLength={MAX_REQUEST_LENGTH}
        placeholder="For example: somewhere warm by the sea in November, with a 5-year-old, flying from Dublin, under €1,500 in total"
      ></textarea>
      <p
        id="trip-hint"
        className={`${styles.formHint} ${isTooShort ? styles.formHintWarn : ""}`}
      >
        At least {MIN_REQUEST_LENGTH} characters
      </p>
      <div className={styles.formFooter}>
        <div className={styles.chips}>
          {CHIPS.map(({ label, phrase }) => (
            <button key={label} type="button" className={styles.chip}
              onClick={() => handleChipClick(phrase)}
            >
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              {label}
            </button>
          ))}
        </div>
        <button type="submit" className={styles.submit} disabled={isDisabled}
        >
          Find my trip
        </button>
      </div>
    </form>
  )
}