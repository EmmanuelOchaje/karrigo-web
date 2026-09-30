import { cn } from "@/lib/cn";
import { HOURLY } from "@/lib/admin/fixtures";

/**
 * Today against the same weekday last week, hour by hour. Two bars per hour
 * rather than two lines: a dispatcher is comparing pairs, not reading a
 * trend, and the pair is the whole question — "are we busier than last
 * Monday at this hour, and do we have the riders for it?"
 *
 * The current hour is half-drawn, because it is. Dimming it stops a partial
 * hour reading as a collapse in demand.
 */
export function OrdersByHour() {
  const { lastWeek, today, scaleMax } = HOURLY;
  const currentHour = today.length - 1;
  const hours = lastWeek.map((_, i) => `${String(8 + i).padStart(2, "0")}`);

  return (
    <section className="bg-ops-surface min-w-0 rounded-[15px] px-[22px] py-xl">
      <div className="flex flex-wrap items-center justify-between gap-md">
        <h2 className="text-text text-[16px] font-semibold">Orders by hour</h2>
        <div className="text-text/62 flex gap-lg text-[12px] font-medium">
          <span className="flex items-center gap-[7px]">
            <span className="bg-accent size-2.5 rounded-[3px]" />
            Today
          </span>
          <span className="flex items-center gap-[7px]">
            <span className="bg-text/22 size-2.5 rounded-[3px]" />
            Mon 21 Sep
          </span>
        </div>
      </div>

      <div className="border-text/10 mt-[18px] grid h-[210px] grid-cols-15 items-end gap-1.5 border-b">
        {hours.map((hour, i) => {
          const todayCount = today[i];
          return (
            <div
              key={hour}
              title={`${hour}:00 · today ${todayCount ?? "—"}${
                i === currentHour ? " so far" : ""
              } · last week ${lastWeek[i]}`}
              className="flex h-full items-end justify-center gap-0.5"
            >
              <span
                className="bg-text/22 w-[42%] rounded-t"
                style={{ height: `${(lastWeek[i] / scaleMax) * 100}%` }}
              />
              <span
                className={cn(
                  "bg-accent w-[42%] rounded-t",
                  i === currentHour && "opacity-55",
                )}
                style={{ height: `${((todayCount ?? 0) / scaleMax) * 100}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 grid grid-cols-15 gap-1.5">
        {hours.map((hour, i) => (
          <span
            key={hour}
            className={cn(
              "text-center text-[11.5px]",
              i === currentHour
                ? "text-text font-bold"
                : "text-text/50 font-medium",
            )}
          >
            {hour}
          </span>
        ))}
      </div>
    </section>
  );
}
