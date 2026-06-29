import type { WeeklyHours } from "./types";

type DayKey = keyof WeeklyHours;

const DAYS: { key: DayKey; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const CLOSED_RE = /closed|fermé/i;

// JS Date#getDay(): 0 = Sunday .. 6 = Saturday. Our DAYS array is Monday-first,
// so remap to 0 = Monday .. 6 = Sunday.
function todayIndex(): number {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function hasStructuredHours(hours?: WeeklyHours | null): boolean {
  return !!hours && DAYS.some((d) => !!hours[d.key]);
}

/**
 * Groups consecutive days that share the same hours string into display rows,
 * e.g. { mon: "10-18", tue: "10-18", ... sat: "10-19", sun: "10-18" }
 * -> [{ left: "Mon–Fri", right: "10-18" }, { left: "Saturday", right: "10-19" }, { left: "Sunday", right: "10-18" }]
 * and flags the row covering today's weekday.
 */
export function groupWeeklyHours(
  hours: WeeklyHours
): { left: string; right: string; highlight: boolean }[] {
  const todayIdx = todayIndex();
  const rows: { left: string; right: string; highlight: boolean }[] = [];

  let i = 0;
  while (i < DAYS.length) {
    const value = hours[DAYS[i].key];
    if (!value) {
      i += 1;
      continue;
    }
    let j = i;
    while (j + 1 < DAYS.length && hours[DAYS[j + 1].key] === value) {
      j += 1;
    }
    const left =
      i === j ? DAYS[i].label : `${DAYS[i].label.slice(0, 3)}–${DAYS[j].label.slice(0, 3)}`;
    rows.push({ left, right: value, highlight: todayIdx >= i && todayIdx <= j });
    i = j + 1;
  }

  return rows;
}

/**
 * Whether the spot is open today. Returns undefined when there's no hours data
 * at all (structured or legacy), so the caller can skip showing a badge.
 */
export function isOpenToday(
  hours?: WeeklyHours | null,
  legacyHours?: string | null
): boolean | undefined {
  if (hasStructuredHours(hours)) {
    const value = hours![DAYS[todayIndex()].key];
    if (value) return !CLOSED_RE.test(value);
    return false; // structured data exists but today has no entry -> treat as closed
  }
  if (legacyHours) return !CLOSED_RE.test(legacyHours);
  return undefined;
}
