import styles from "./HowItWorksSteps.module.scss";

type Step = {
  title: string;
  description: string;
  iconPath: string;
};

const STEPS: Step[] = [
  {
    title: "Describe it",
    description:
      "Write like you're texting a friend: when, who's coming, what you can spend and what you love.",
    iconPath: "M4 20h4L19 9l-4-4L4 16z",
  },
  {
    title: "AI reads your request",
    description:
      "It picks out dates, budget, group and vibe, then matches destinations that fit.",
    iconPath: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  },
  {
    title: "Compare and book",
    description:
      "Cards with weather, flight time, estimated cost and links to hotels and flights.",
    iconPath: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14",
  },
];

export const HowItWorksSteps = () => {
  return (
    <ol className={styles.steps}>
      {STEPS.map((step) => (
        <li key={step.title} className={styles.step}>
          <div className={styles.stepIcon} aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={step.iconPath} />
            </svg>
          </div>
          <span className={styles.stepNumber} aria-hidden="true" />
          <h3 className={styles.stepTitle}>{step.title}</h3>
          <p className={styles.stepText}>{step.description}</p>
        </li>
      ))}
    </ol>
  );
};
