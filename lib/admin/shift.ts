/** The working day ops plans around, in Lagos time. Display only. */
export const SHIFT = { startMinutes: 8 * 60, endMinutes: 22 * 60 } as const;

const parts = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Lagos",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Minutes past midnight in Lagos right now. */
export function lagosMinutesNow(now = new Date()): number {
  const [h, m] = parts.format(now).split(":").map(Number);
  return h * 60 + m;
}

/** 872 -> "14:32". */
export function formatClock(minutesPastMidnight: number): string {
  const m = ((minutesPastMidnight % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
