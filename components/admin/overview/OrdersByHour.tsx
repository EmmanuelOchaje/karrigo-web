import { cn } from "@/lib/cn";
import type { OverviewView } from "@/lib/admin/overview";

const dayName = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" });

/**
 * Orders per day over the last fortnight. The backend aggregates by day, not
 * by hour, so this reads as a trend rather than a shift curve. Today is
 * accented and, being part-way through, is the shortest bar on a slow day —
 * that is not a collapse in demand, so it is dimmed to say so.
 */
export function OrdersByHour({ trend }: { trend: OverviewView["trend"] }) {
  const max = Math.max(1, ...trend.map((t) => t.orders));

  return (
    <section className="bg-ops-surface min-w-0 rounded-[15px] px-[22px] py-xl">
      <div className="flex flex-wrap items-center justify-between gap-md">
        <h2 className="text-text text-[16px] font-semibold">Orders per day</h2>
        <span className="text-text/62 text-[12px] font-medium">Last {trend.length} days</span>
      </div>

      <div
        className="border-text/10 mt-[18px] grid h-[210px] items-end gap-1.5 border-b"
        style={{ gridTemplateColumns: `repeat(${trend.length}, minmax(0, 1fr))` }}
      >
        {trend.map((t) => (
          <div
            key={t.day}
            title={`${t.day} · ${t.orders} order${t.orders === 1 ? "" : "s"}${t.isToday ? " so far" : ""}`}
            className="flex h-full items-end justify-center"
          >
            <span
              className={cn("w-[70%] min-h-[2px] rounded-t", t.isToday ? "bg-accent opacity-70" : "bg-text/22")}
              style={{ height: `${(t.orders / max) * 100}%` }}
            />
          </div>
        ))}
      </div>

      <div
        className="mt-2 grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${trend.length}, minmax(0, 1fr))` }}
      >
        {trend.map((t) => (
          <span
            key={t.day}
            className={cn(
              "text-center text-[11px]",
              t.isToday ? "text-text font-bold" : "text-text/50 font-medium",
            )}
          >
            {dayName.format(new Date(`${t.day}T00:00:00Z`)).slice(0, 2)}
          </span>
        ))}
      </div>
    </section>
  );
}
