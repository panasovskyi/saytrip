import styles from "./IdeasList.module.scss";
import Link from "next/link";

type Idea = {
  tag: string;
  text: string;
};

const IDEAS: Idea[] = [
  {
    tag: "Family",
    text: "A week by the sea with two kids. Needs a pool and a shallow beach. September.",
  },
  {
    tag: "Weekend",
    text: "A romantic weekend in Europe: short flight, great food and walks around an old town.",
  },
  {
    tag: "Active",
    text: "Five days of mountain hiking in May, away from the crowds, under €800.",
  },
];

export const IdeasList = () => {
  return (
    <div className={styles.ideasList}>
      {IDEAS.map(({text, tag}) => {
        const query = new URLSearchParams({ input: text }).toString();

        return (
          <article key={tag} className={styles.ideaCard}>
            <p className={styles.tag}>{tag}</p>
            <p className={styles.ideaText}>{`“${text}”`}</p>
            <Link
              className={styles.ideaAction}
              href={`/results?${query}`}
              prefetch={false}
              aria-label={`Try: ${text}`}
            >
              Try it
            </Link>
          </article>
        );
      })}
    </div>
  );
};