export function formatCount({
  count,
  singular,
  plural = `${singular}s`,
}: {
  count: number | null;
  singular: string;
  plural?: string;
}) {
  return `${count || 1} ${(count === 1 || !count) ? singular : plural}`;
}

const eurFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatEur(amount: number) {
  return eurFormatter.format(amount);
}

export function formatFlightTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;

  return `${hours}h ${minutes}m`;
}