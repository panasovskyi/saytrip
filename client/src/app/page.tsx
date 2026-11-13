import { IdeasList } from '@/app/_components/IdeasList/IdeasList';
import styles from "./page.module.scss";
import { HomepageForm } from "@/app/_components/HomepageForm/HomepageForm";
import { HowItWorksSteps } from '@/app/_components/HowItWorksSteps/HowItWorksSteps';
import { SparkleIcon } from '@/components/icons/SparkleIcon';

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <p className={styles.badge}>
          <SparkleIcon />
          Trip ideas from a simple description
        </p>
        <h1 className={styles.title}>
          Where to next?{" "}
          <span className={styles.titleAccent}>Just say it.</span>
        </h1>
        <p className={styles.lead}>
          Tell us how you want to travel: when, who with, your budget and the
          vibe. AI reads your request and suggests destinations with weather,
          flight time and estimated cost.
        </p>

        <HomepageForm />

        <p className={styles.note}>
          No sign-up · Write in any language · Prices are estimates
        </p>
      </section>

      <section id="ideas" className={styles.ideas}>
        <h2 className={styles.sectionTitle}>
          Not sure where to start? Try one
        </h2>
        <IdeasList />
      </section>

      <section id="how" className={styles.how}>
        <div className={styles.howInner}>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <HowItWorksSteps />
        </div>
      </section>
    </main>
  );
}
