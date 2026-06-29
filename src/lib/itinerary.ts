/**
 * Small helpers for the Itinerary pages. Mirrors the URL-construction
 * approach already used for `googleCalendarUrl` in `eventDates.ts` — no
 * backend, just a link built from data we already have.
 */

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  challenging: "Challenging",
};

export function difficultyLabel(difficulty?: string | null): string {
  if (!difficulty) return "";
  return DIFFICULTY_LABELS[difficulty] ?? difficulty;
}

/**
 * A plain Google Maps search link for the itinerary's start point — not a
 * full turn-by-turn route (that would need an interactive map component we
 * don't have the assets for yet, see the homepage "explore map" note).
 */
export function googleMapsSearchUrl(query: string): string {
  const params = new URLSearchParams({ api: "1", query: `${query}, Montmartre, Paris` });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}
