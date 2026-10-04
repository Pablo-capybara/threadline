/**
 * Calendar-date helpers. All dates are ISO "YYYY-MM-DD" strings treated as
 * UTC midnight so comparisons never drift with the viewer's timezone.
 */

const DAY_MS = 86_400_000;

/**
 * The mock data is a snapshot from the Figma frame, taken on 8 Sep 2026
 * (Aiden Cross: last contact 15 Aug, "No contact in 24 days"). Pinning
 * "today" keeps the renewal highlights and AI copy consistent with it.
 * Set NEXT_PUBLIC_TODAY=live to use the real date, or any ISO date to pin another.
 */
const DEMO_TODAY = "2026-09-08";

export function getToday(): string {
  const configured = process.env.NEXT_PUBLIC_TODAY;
  if (configured === "live") return new Date().toISOString().slice(0, 10);
  return configured || DEMO_TODAY;
}

const toTime = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

/** Whole days from `from` to `to` (positive when `to` is later). */
export function daysBetween(from: string, to: string): number {
  return Math.round((toTime(to) - toTime(from)) / DAY_MS);
}

export function isSameMonth(a: string, b: string): boolean {
  return a.slice(0, 7) === b.slice(0, 7);
}

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** "Sep 6, 2026" */
export function formatDate(iso: string): string {
  return formatter.format(toTime(iso));
}
