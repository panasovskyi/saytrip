import styles from './Sortbar.module.scss';

export type SortKey = "best" | "cheaper" | "closer";

type Props = {
  activeKey: SortKey;
  setSortKey: (val: SortKey) => void;
}

type SortButton = {
  label: string;
  sortKey: SortKey;
}

const SORT_BTNS: SortButton[] = [
  { label: "Best match", sortKey: "best"},
  { label: "Cheaper", sortKey: "cheaper"},
  { label: "Closer", sortKey: "closer"},
]

export const Sortbar: React.FC<Props> = ({ activeKey, setSortKey}) => {
  return (
    <div
      role="group"
      aria-label="Sort results"
      className={styles.sort}
    >
      {SORT_BTNS.map(sortButton => (
        <button
          key={sortButton.label}
          type="button"
          aria-pressed={sortButton.sortKey === activeKey}
          className={styles.sortButton}
          onClick={() => setSortKey(sortButton.sortKey)}
        >
          {sortButton.label}
        </button>
      ))}
    </div>
  )
}