import { SubscribeButton } from '@/app/account/_components/SubscribeButton/SubscribeButton';
import styles from "./page.module.scss";
import { getCurrentUser } from "@/features/auth/get-current-user";
import { PLANS } from '@/features/subscription/subscription.plans';
import { Plan } from '@/features/subscription/subscription.types';
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <main className={styles.page}>
      <div className={styles.headText}>
        <h1 className={styles.title}>Account</h1>
        <p className={styles.email}>{user.email}</p>
      </div>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Profile</h2>

        <div className={styles.profile}>
          <span aria-hidden="true" className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </span>

          <form className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Your name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                defaultValue={user.name}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={user.email}
                className={styles.input}
              />
            </div>

            <button
              type="submit"
              className={`${styles.button} ${styles.dark} ${styles.saveButton}`}
            >
              Save changes
            </button>
          </form>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHead}>
          <h2 className={styles.cardTitle}>Your plan</h2>
          <p className={styles.cardText}>
            You are on Sonnet 5.5 · Medium, which is free. Subscribe to unlock
            stronger models.
          </p>
        </div>

        <ul className={styles.plans}>
          {Object.entries(PLANS).map(([key, plan]) => {
            const isActive = user.subscription.plan === key;

            return (
              <li
                key={key}
                className={
                  isActive
                    ? `${styles.plan} ${styles.planCurrent}`
                    : `${styles.plan}`
                }
              >
                <div className={styles.planInfo}>
                  <span className={styles.planName}>
                    {plan.label} · {plan.effort}
                  </span>
                  <span className={styles.planNote}>{plan.feature}</span>
                </div>
                <div className={styles.planAside}>
                  <span className={styles.planPrice}>{plan.priceLabel}</span>
                  {isActive ? (
                    <span className={styles.badge}>Your plan</span>
                  ) : (
                    user.subscription.plan === "FREE" &&
                    key !== "FREE" && (
                      <SubscribeButton plan={key as Exclude<Plan, "FREE">} />
                    )
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <p className={styles.footnote}>
          Each plan is named after the highest level it unlocks and includes
          every level below it. Prices are per month.
        </p>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Sign-in methods</h2>

        <ul className={styles.methods}>
          <li className={styles.method}>
            <div className={styles.methodInfo}>
              <span aria-hidden="true" className={styles.mark}>
                @
              </span>
              <div className={styles.methodText}>
                <span className={styles.methodName}>Email and password</span>
                <span className={styles.methodStatus}>{user.email}</span>
              </div>
            </div>
            <button
              type="button"
              className={`${styles.button} ${styles.secondary} ${styles.small}`}
            >
              Change password
            </button>
          </li>

          <li className={styles.method}>
            <div className={styles.methodInfo}>
              <span aria-hidden="true" className={styles.mark}>
                G
              </span>
              <div className={styles.methodText}>
                <span className={styles.methodName}>Google</span>
                <span className={styles.methodStatus}>
                  Connected as alex@example.com
                </span>
              </div>
            </div>
            <button
              type="button"
              className={`${styles.button} ${styles.secondary} ${styles.small}`}
            >
              Disconnect
            </button>
          </li>

          <li className={styles.method}>
            <div className={styles.methodInfo}>
              <span aria-hidden="true" className={styles.mark}>
                f
              </span>
              <div className={styles.methodText}>
                <span className={styles.methodName}>Facebook</span>
                <span className={styles.methodStatus}>Not connected</span>
              </div>
            </div>
            <button
              type="button"
              className={`${styles.button} ${styles.dark} ${styles.small}`}
            >
              Connect
            </button>
          </li>

          <li className={styles.method}>
            <div className={styles.methodInfo}>
              <span aria-hidden="true" className={styles.mark}>
                A
              </span>
              <div className={styles.methodText}>
                <span className={styles.methodName}>Apple</span>
                <span className={styles.methodStatus}>Not connected</span>
              </div>
            </div>
            <button
              type="button"
              className={`${styles.button} ${styles.dark} ${styles.small}`}
            >
              Connect
            </button>
          </li>
        </ul>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHead}>
          <h2 className={styles.cardTitle}>Delete account</h2>
          <p className={styles.cardText}>
            This removes your profile and cancels your plan. It cannot be
            undone.
          </p>
        </div>
        <button type="button" className={`${styles.button} ${styles.danger}`}>
          Delete account
        </button>
      </section>
    </main>
  );
}
