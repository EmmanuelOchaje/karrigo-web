/** How ops reads a moment: "Today 11:05", "Yesterday 16:40", "28 Sep".
 *  Always Lagos time — the shift is spoken in Makurdi's clock, not the
 *  server's. */

const TZ = "Africa/Lagos";

const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: TZ });
const clock = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const shortDate = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  day: "numeric",
  month: "short",
});

export function whenLabel(iso: string | null | undefined, now = new Date()): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const today = dayKey.format(now);
  const yesterday = dayKey.format(new Date(now.getTime() - 86_400_000));
  const day = dayKey.format(date);

  if (day === today) return `Today ${clock.format(date)}`;
  if (day === yesterday) return `Yesterday ${clock.format(date)}`;
  return shortDate.format(date);
}

/** "8 min ago", "3 h ago", "Yesterday", "28 Sep". */
export function ageLabel(iso: string | null | undefined, now = new Date()): string {
  if (!iso) return "—";
  const date = new Date(iso);
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60_000);
  if (Number.isNaN(minutes)) return "—";
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)} h ago`;
  return whenLabel(iso, now);
}

/** A span of minutes as ops would say it: "45 min", "5 h 29 min", "2 days 10 h". */
export function durationLabel(minutes: number): string {
  const m = Math.max(0, Math.floor(minutes));
  if (m < 60) return `${m} min`;
  const days = Math.floor(m / 1440);
  const hours = Math.floor((m % 1440) / 60);
  if (days === 0) return m % 60 ? `${hours} h ${m % 60} min` : `${hours} h`;
  const dayPart = `${days} day${days === 1 ? "" : "s"}`;
  return hours ? `${dayPart} ${hours} h` : dayPart;
}
