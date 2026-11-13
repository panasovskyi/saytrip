"use client";

import Link from "next/link";
import styles from "./SignUpForm.module.scss";
import { useForm } from "react-hook-form";
import {
  RegistrationPayload,
  registrationSchema,
} from "@/features/auth/schemas/registration.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/features/auth/auth.api";
import { ErrorMessage } from "@/components/ui/ErrorMessage/ErrorMessage";
import { useRouter } from 'next/navigation';
import { applyApiError } from '@/lib/apply-api-error';

export const SignUpForm = () => {
  const router = useRouter();
  const methods = useForm<RegistrationPayload>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      isAgreed: false,
    },
    resolver: zodResolver(registrationSchema),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: RegistrationPayload) => {
    try {
      await authApi.register(data);

      router.push('/login');
    } catch (err) {
      applyApiError(err, setError, registrationSchema);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Your name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Alex"
          className={styles.input}
          disabled={isSubmitting}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />

        <ErrorMessage id="name-error" message={errors.name?.message} />
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={styles.input}
          disabled={isSubmitting}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />

        <ErrorMessage id="email-error" message={errors.email?.message} />
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          className={styles.input}
          disabled={isSubmitting}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : "password-hint"}
          {...register("password")}
        />

        {errors.password ? (
          <ErrorMessage id="password-error" message={errors.password.message} />
        ) : (
          <p id="password-hint" className={styles.hint}>
              At least 8 characters, with upper and lower case letters, a digit and a symbol
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="passwordConfirmation" className={styles.label}>
          Confirm password
        </label>
        <input
          id="passwordConfirmation"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat the password"
          className={styles.input}
          disabled={isSubmitting}
          aria-invalid={!!errors.passwordConfirmation}
          aria-describedby={
            errors.passwordConfirmation ? "passwordConfirmation-error" : undefined
          }
          {...register("passwordConfirmation")}
        />

        <ErrorMessage
          id="passwordConfirmation-error"
          message={errors.passwordConfirmation?.message}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="isAgreed" className={styles.agree}>
          <input
            id="isAgreed"
            type="checkbox"
            className={styles.checkbox}
            disabled={isSubmitting}
            aria-invalid={!!errors.isAgreed}
            aria-describedby={errors.isAgreed ? "isAgreed-error" : undefined}
            {...register("isAgreed")}
          />
          <span>
            I agree to the{" "}
            <Link href="#" className={styles.link}>
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className={styles.link}>
              Privacy Policy
            </Link>
          </span>
        </label>

        <ErrorMessage id="isAgreed-error" message={errors.isAgreed?.message} />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={isSubmitting}>
          Create account
        </button>

        <ErrorMessage message={errors.root?.message} />
      </div>
    </form>
  );
};
