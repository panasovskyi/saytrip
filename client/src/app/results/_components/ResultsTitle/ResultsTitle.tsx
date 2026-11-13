import { formatCount } from '@/lib/format';
import styles from './ResultsTitle.module.scss';

type Props = {
  count: number;
}

export const ResultsTitle: React.FC<Props> = ({count}) => {
  return (
    <div>
      <h2 className={styles.resultsTitle}>
        {formatCount({
          count,
          singular: 'destination',
        })} for you</h2>
    </div>
  )
}