"use client";

import { MissingInfoQuestion } from "@/features/suggestion/suggestion.types";
import styles from "./MissingInfo.module.scss";
import React, { useState } from "react";
import { useRequestText } from "@/app/results/_components/RequestProvider/RequestProvider";
import { appendPhrase } from "@/lib/append-phrase";

type Props = {
  missingInfo: MissingInfoQuestion[];
};

export const MissingInfo: React.FC<Props> = ({ missingInfo }) => {
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const { text, setText } = useRequestText();

  const handleClick = ({
    question,
    answer,
  }: {
    question: string;
    answer: string;
  }) => {
    const isAnswered = answeredQuestions.includes(question);

    if (isAnswered) {
      return;
    }

    const next = appendPhrase(text, `${question} ${answer}.`);

    if (next === text) {
      return;
    }

    setText(next);
    setAnsweredQuestions((prev) => [...prev, question]);
  };

  if (answeredQuestions.length === missingInfo.length) return null;

  return (
    <div className={styles.clarify}>
      {missingInfo.map(
        (item) =>
          !answeredQuestions.includes(item.question) && (
            <React.Fragment key={item.question}>
              <p className={styles.clarifyQuestion}>{item.question}</p>
              <div className={styles.clarifyOptions}>
                {item.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={styles.clarifyOption}
                    onClick={() =>
                      handleClick({ question: item.question, answer: option })
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            </React.Fragment>
          ),
      )}
    </div>
  );
};
