import { MAX_REQUEST_LENGTH } from "@/lib/request-limits";

export function appendPhrase(
  text: string,
  phrase: string,
  maxLength = MAX_REQUEST_LENGTH,
): string {
  const base = text.trim();

  if (base.toLowerCase().includes(phrase.toLowerCase())) return text;

  const separator = /[.,;!?]$/.test(base) ? " " : ", ";
  const next = base ? `${base}${separator}${phrase}` : phrase;

  return next.length > maxLength ? text : next;
}
