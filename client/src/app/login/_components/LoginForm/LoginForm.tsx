"use client";

import Link from "next/link";
import styles from "./LoginForm.module.scss";
import { useForm } from "react-hook-form";
import {
  LoginPayload,
  loginSchema,
} from "@/features/auth/schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/components/ui/ErrorMessage/ErrorMessage";
import { authApi } from "@/features/auth/auth.api";
import { useRouter } from "next/navigation";
import { applyApiError } from "@/lib/apply-api-error";

export const LoginForm = () => {
  const router = useRouter();

  const methods = useForm<LoginPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: LoginPayload) => {
    try {
      await authApi.login(data);
      router.push("/account");
      router.refresh();
    } catch (err) {
      applyApiError(err, setError, loginSchema);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
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
        <div className={styles.labelRow}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <Link href="#" className={styles.forgot}>
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          className={styles.input}
          disabled={isSubmitting}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />

        <ErrorMessage id="password-error" message={errors.password?.message} />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={isSubmitting}>
          Log in
        </button>

        <ErrorMessage message={errors.root?.message} />
      </div>
    </form>
  );
};
