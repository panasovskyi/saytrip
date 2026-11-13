"use client";

import { useState } from "react";
import styles from "./SubscribeButton.module.scss";
import { ErrorMessage } from "@/components/ui/ErrorMessage/ErrorMessage";
import { subscriptionApi } from "@/features/subscription/subscription.api";
import { Plan } from "@/features/subscription/subscription.types";
import { ApiError } from "@/lib/api-error";

type Props = {
  plan: Exclude<Plan, "FREE">;
};

export const SubscribeButton = ({ plan }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const onClick = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const url = await subscriptionApi.createCheckout(plan);

      window.location.href = url;
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={`${styles.button} ${styles.dark} ${styles.small}`}
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? "Redirecting…" : "Subscribe"}
      </button>
      <ErrorMessage message={error} />
    </div>
  );
};
