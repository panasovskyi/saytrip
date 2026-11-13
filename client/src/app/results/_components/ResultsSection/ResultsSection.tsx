"use client";

import { Destination } from "@/features/suggestion/suggestion.types";
import styles from "./ResultsSection.module.scss";
import { ResultsTitle } from "@/app/results/_components/ResultsTitle/ResultsTitle";
import { Sortbar, SortKey } from "@/app/results/_components/Sortbar/Sortbar";
import { SuggestionCard } from "@/features/suggestion/SuggestionCard/SuggestionCard";
import { useState } from "react";

function sortDestinations({
  destinations,
  sortKey,
}: {
  destinations: Destination[];
  sortKey: SortKey;
}) {
  const sorted = [...destinations];

  switch (sortKey) {
    case "best":
      return sorted;
    case "cheaper":
      return sorted.sort((a, b) => a.estCostEur - b.estCostEur);
    case "closer":
      return sorted.sort((a, b) => a.flightTimeMin - b.flightTimeMin);
    default:
      return sorted;
  }
}

type Props = {
  destinations: Destination[];
};

export const ResultsSection: React.FC<Props> = ({ destinations }) => {
  const [sortKey, setSortKey] = useState<SortKey>("best");
  const sortedDestinations = sortDestinations({ destinations, sortKey });

  return (
    <section className={styles.results}>
      <div className={styles.resultsHead}>
        <ResultsTitle count={destinations.length} />

        <Sortbar activeKey={sortKey} setSortKey={setSortKey} />
      </div>

      <div className={styles.cards}> 
        {sortedDestinations.map((destination) => (
          <SuggestionCard
            key={`${destination.countryCode}-${destination.nameEn}`}
            isBestMatch={destination === destinations[0]}
            destination={destination}
          />
        ))}
      </div>

      <p className={styles.disclaimer}>
        Weather shows monthly averages. Prices are estimates and may change;
        check partner sites for exact costs. Bookings are made on partner sites
        and we may earn a commission.
      </p>
    </section>
  );
};
