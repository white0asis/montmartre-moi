/**
 * Small date-formatting helpers for the Events page. Mirrors the plain
 * `toLocaleDateString("en-US", ...)` convention already used in the article
 * page byline — no extra date library needed for this.
 */

export function eventDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "2-digit" });
}

export function eventWeekday(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short" });
}

export function eventMonth(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long" });
}

/** e.g. "Fri 4 July" — used for the hero "Next up" card. */
export function eventDateLabel(iso: string): string {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  const day = d.toLocaleDateString("en-US", { day: "numeric" });
  const month = d.toLocaleDateString("en-US", { month: "long" });
  return `${weekday} ${day} ${month}`;
}

/** e.g. "Sat 12 Jul" — used for the hero "Then on the hill" rows. */
export function eventDateShort(iso: string): string {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  const day = d.toLocaleDateString("en-US", { day: "numeric" });
  const month = d.toLocaleDateString("en-US", { month: "short" });
  return `${weekday} ${day} ${month}`;
}

/** e.g. "Oct 7–11" or "Oct 7" if there's no end date / same day. */
export function eventDateRange(startIso: string, endIso?: string): string {
  const start = new Date(startIso);
  const month = start.toLocaleDateString("en-US", { month: "short" });
  const startDay = start.toLocaleDateString("en-US", { day: "numeric" });
  if (!endIso) return `${month} ${startDay}`;
  const end = new Date(endIso);
  const endDay = end.toLocaleDateString("en-US", { day: "numeric" });
  if (endDay === startDay) return `${month} ${startDay}`;
  return `${month} ${startDay}–${endDay}`;
}

const CATEGORY_LABELS: Record<string, string> = {
  cinema: "Cinema",
  music: "Music",
  art: "Art",
  walk: "Walk",
  "eat-drink": "Eat & Drink",
  heritage: "Heritage",
  festival: "Festival",
  market: "Market",
};

export function eventCategoryLabel(category?: string | null): string {
  if (!category) return "";
  return CATEGORY_LABELS[category] ?? category;
}

/** Google Calendar "render" link — no backend needed, just URL params. */
export function googleCalendarUrl(event: {
  title: string;
  startDate?: string;
  endDate?: string;
  locationName?: string;
  description?: string;
}): string {
  if (!event.startDate) return "#";
  const toUtcStamp = (iso: string) =>
    new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const start = toUtcStamp(event.startDate);
  // Default to a 2-hour slot when there's no explicit end time.
  const end = event.endDate
    ? toUtcStamp(event.endDate)
    : toUtcStamp(new Date(new Date(event.startDate).getTime() + 2 * 60 * 60 * 1000).toISOString());

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
  });
  if (event.locationName) params.set("location", event.locationName);
  if (event.description) params.set("details", event.description);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
