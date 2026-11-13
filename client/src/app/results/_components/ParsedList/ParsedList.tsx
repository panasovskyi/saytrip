import { formatCount, formatEur } from "@/lib/format";
import styles from "./ParsedList.module.scss";
import { ParsedRequest } from "@/features/suggestion/suggestion.types";

type Props = {
  parsed: ParsedRequest;
};

type Chip = {
  label: string;
  getValue: (values: ParsedRequest) => string | null;
};

function formatPeople(
  adults: number | null,
  childrenAges: number[],
): string | null {
  if (adults === null && childrenAges.length === 0) return null;

  const adultsText = formatCount({ count: adults ?? 1, singular: "adult" });
  if (childrenAges.length === 0) return `${adultsText}, no kids`;

  const kidsText = formatCount({
    count: childrenAges.length,
    singular: "child",
    plural: "children",
  });
  return `${adultsText} + ${kidsText}`;
}

const NOT_SPECIFIED = "not specified";

const CHIPS: Chip[] = [
  { label: "When", getValue: (p) => p.when },
  {
    label: "Budget",
    getValue: (p) =>
      p.budgetEur === null ? null : `up to ${formatEur(p.budgetEur)}`,
  },
  { label: "Who", getValue: (p) => formatPeople(p.adults, p.childrenAges) },
  { label: "From", getValue: (p) => p.from },
  {
    label: "Vibe",
    getValue: (p) => (p.vibe.length > 0 ? p.vibe.join(", ") : null),
  },
];

export const ParsedList: React.FC<Props> = ({ parsed }) => {
  return (
    <ul className={styles.parsedList}>
      {CHIPS.map((chip) => (
        <li key={chip.label}>
          <button type="button" className={styles.parsedChip}>
            <span className={styles.parsedLabel}>{chip.label}</span>
            <span className={styles.parsedValue}>
              {chip.getValue(parsed) || NOT_SPECIFIED}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};
