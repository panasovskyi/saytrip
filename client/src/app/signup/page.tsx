import Link from "next/link";
import styles from "./page.module.scss";
import { SignUpForm } from "@/app/signup/_components/SignUpForm/SignUpForm";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/get-current-user";

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) redirect("/account");

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.head}>
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.description}>
            Choose the AI model that reads your request and manage your plan.
            The account is free.
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

        <SignUpForm />

        <p className={styles.switch}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
