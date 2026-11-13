import Image from 'next/image';
import styles from './SuggestionCard.module.scss';
import { Destination } from '@/features/suggestion/suggestion.types';
import { formatCount, formatEur, formatFlightTime } from '@/lib/format';

const UNSPLASH_URL = 'https://unsplash.com/?utm_source=saytrip&utm_medium=referral';

type Props = {
  isBestMatch: boolean;
  destination: Destination;
}

export const SuggestionCard: React.FC<Props> = ({ isBestMatch, destination}) => {
  const { image } = destination;

  return (
    <article className={styles.card}>
      <div className={styles.cardImage}>
        {image && (
          <>
            <Image
              src={image.url}
              alt={`Photo of ${destination.name}`}
              fill
              unoptimized
            />
            <p className={styles.credit}>
              Photo by{' '}
              <a href={image.authorUrl} target="_blank" rel="noopener noreferrer">
                {image.authorName}
              </a>{' '}
              on{' '}
              <a href={UNSPLASH_URL} target="_blank" rel="noopener noreferrer">
                Unsplash
              </a>
            </p>
          </>
        )}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardHead}>
          {isBestMatch && <p className={styles.tag}>Best match</p>}
          <button type="button" className={styles.saveButton}>
            Save
          </button>
        </div>
        <div>
          <h3 className={styles.cardName}>{destination.name}</h3>
          <p className={styles.cardCountry}>{destination.country}</p>
        </div>
        <p className={styles.cardWhy}>
          {destination.why}
        </p>
        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Weather</dt>
            <dd className={styles.statValue}>{`${destination.weather.tempC}°C, ${destination.weather.summary}`}</dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Flight</dt>
            <dd className={styles.statValue}>
              {formatFlightTime(destination.flightTimeMin)}
            </dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Budget</dt>
            <dd className={styles.statValue}>{`≈ ${formatEur(destination.estCostEur)} / ${formatCount({
              count: destination.nights,
              singular: 'night',
            })}`}
            </dd>
          </div>
        </dl>
        <ul className={styles.highlights}>
          {destination.highlights.map(sight => (
            <li key={sight} className={styles.highlight}>{sight}</li>

          ))}
        </ul>
        <div className={styles.actions}>
          <a href={destination.links.hotels} target="_blank"
            rel="noopener noreferrer sponsored" className={styles.buttonPrimary}>
            Find hotels
          </a>
          <a href={destination.links.tickets} target="_blank"
            rel="noopener noreferrer sponsored" className={styles.buttonOutline}>
            Flights
          </a>
        </div>
      </div>
    </article>
  )
}