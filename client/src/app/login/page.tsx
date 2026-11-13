import Link from "next/link";
import styles from "./page.module.scss";
import { LoginForm } from "@/app/login/_components/LoginForm/LoginForm";
import { redirect } from "next/navigation";
import { getCurrentUser } from '@/features/auth/get-current-user';

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) redirect("/account");

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.head}>
          <h1 className={styles.title}>Log in</h1>
          <p className={styles.description}>
            Welcome back. Log in to choose a model and manage your plan.
          </p>
        </div>

        <div className={styles.socials}>
          <button type="button" className={styles.social}>
            <span aria-hidden="true" className={styles.mark}>
              G
            </span>
            Continue with Google
          </button>
          <button type="button" className={styles.social}>
            <span aria-hidden="true" className={styles.mark}>
              f
            </span>
            Continue with Facebook
          </button>
          <button type="button" className={styles.social}>
            <span aria-hidden="true" className={styles.mark}>
              A
            </span>
            Continue with Apple
          </button>
        </div>

        <p className={styles.divider}>or with email</p>

        <LoginForm />

        <p className={styles.switch}>
          New to Saytrip?{" "}
          <Link href="/signup" className={styles.link}>
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
