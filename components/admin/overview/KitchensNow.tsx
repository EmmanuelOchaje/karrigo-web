import { cn } from "@/lib/cn";
import { formatKobo } from "@/lib/money";
import { KITCHEN_SERVICE, SERVICE_THRESHOLDS } from "@/lib/admin/fixtures";
import { StatusChip, type Tone } from "@/components/admin/ui";

/* The narrowest this table reads at. Below it the panel scrolls
   sideways rather than squeezing the numbers into two lines. */
const COLUMNS =
  "grid min-w-[560px] grid-cols-[minmax(120px,2fr)_128px_48px_60px_64px_90px]";

/**
 * Service quality per kitchen, right now. Accept rate and prep time turn
 * amber past their thresholds, which is how a kitchen quietly having a bad
 * day gets noticed before the complaints arrive.
 */
export function KitchensNow() {
  const counts = KITCHEN_SERVICE.reduce(
    (acc, k) => ({ ...acc, [k.state]: (acc[k.state] ?? 0) + 1 }),
    {} as Record<string, number>,
  );

  return (
    <section className="bg-ops-surface ops-scroll-x min-w-0 rounded-[15px] px-[22px] pt-xl pb-2">
      <div className="mb-1.5 flex items-center justify-between">
        <h2 className="text-text text-[16px] font-semibold">Kitchens right now</h2>
        <span className="text-text/62 text-[12.5px] font-light">
          {counts.open ?? 0} open · {counts.paused ?? 0} paused ·{" "}
          {counts.closed ?? 0} closed
        </span>
      </div>

      <div
        className={cn(
          COLUMNS,
          "border-text/8 text-text/50 gap-2.5 border-b py-2.5",
          "text-[11px] font-semibold tracking-[0.08em] uppercase",
        )}
      >
        <span>Kitchen</span>
        <span>Status</span>
        <span className="text-right">Active</span>
        <span className="text-right">Accept</span>
        <span className="text-right">Prep</span>
        <span className="text-right">Sales</span>
      </div>

      {KITCHEN_SERVICE.map((kitchen) => {
        const slowAccept =
          kitchen.acceptRate !== null &&
          kitchen.acceptRate < SERVICE_THRESHOLDS.acceptRate;
        const slowPrep =
          kitchen.prepMinutes !== null &&
          kitchen.prepMinutes > SERVICE_THRESHOLDS.prepMinutes;

        const tone: Tone =
          kitchen.state === "open"
            ? "success"
            : kitchen.state === "paused"
              ? "warning"
              : "muted";
        const label =
          kitchen.state === "open"
            ? "Open"
            : kitchen.state === "paused"
              ? `Paused · ${kitchen.pausedMinutes} min`
              : "Closed today";

        return (
          <div
            key={kitchen.name}
            className={cn(
              COLUMNS,
              "border-text/6 text-text items-center gap-2.5 border-b py-[11px] text-[13.5px] font-normal",
            )}
          >
            <span className="truncate font-semibold">{kitchen.name}</span>
            <span>
              <StatusChip tone={tone}>{label}</StatusChip>
            </span>
            <span className="text-right">{kitchen.activeOrders}</span>
            <span className={cn("text-right", slowAccept && "text-warning")}>
              {kitchen.acceptRate === null ? "—" : `${kitchen.acceptRate}%`}
            </span>
            <span className={cn("text-right", slowPrep && "text-warning")}>
              {kitchen.prepMinutes === null ? "—" : `${kitchen.prepMinutes} min`}
            </span>
            <span className="text-right font-semibold">
              {formatKobo(kitchen.salesKobo)}
            </span>
          </div>
        );
      })}
    </section>
  );
}
