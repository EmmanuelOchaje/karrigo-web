import { durationLabel } from "@/lib/admin/format";
import { cn } from "@/lib/cn";
import type { OverviewView } from "@/lib/admin/overview";

/**
 * Where the open orders are sitting. Each block is sized by how many orders
 * are in that stage, so a bulge is visible before the numbers are read. A
 * stage with an order waiting past its window gets an amber top edge and a
 * "Slow" tag — for the first stage that is the kitchen's 3-minute window.
 */
export function OrderPipeline({
  stages,
  open,
}: {
  stages: OverviewView["pipeline"];
  open: number;
}) {
  return (
    <section className="bg-ops-surface mb-3.5 rounded-[15px] px-[22px] py-xl">
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-md">
        <h2 className="text-text text-[16px] font-semibold">
          Order pipeline <span className="text-text/62 font-light">· {open} open orders right now</span>
        </h2>
        <span className="text-text/62 text-[12.5px] font-light">Longest wait in each stage</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {stages.map((stage) => (
          <div
            key={stage.stage}
            /* +4 keeps an almost-empty stage from collapsing to a sliver. */
            style={{ flex: `${stage.count + 4} 1 0` }}
            className={cn(
              "flex min-w-[130px] flex-col gap-[7px] rounded-xl border-t-[3px] px-3.5 pt-3.5 pb-[13px]",
              stage.slow ? "border-t-warning bg-warning/6" : "border-t-text/14 bg-ops-surface-raised",
            )}
          >
            <span className="text-text/70 text-[12.5px] font-medium whitespace-nowrap">{stage.label}</span>
            <span className="flex items-baseline gap-2">
              <span className="text-text text-[24px]/none font-bold">{stage.count}</span>
              <span className="text-text/62 text-[12.5px] font-light">orders</span>
            </span>
            <span className="flex flex-wrap items-center gap-[7px]">
              <span className={cn("text-[12.5px] font-semibold", stage.slow ? "text-warning" : "text-text")}>
                {stage.count ? durationLabel(stage.oldestMinutes) : "—"}
              </span>
              {stage.slow && (
                <span className="bg-warning-bg text-warning inline-flex items-center gap-[5px] rounded-pill px-2 py-0.5 text-[11px] font-bold">
                  <span aria-hidden className="size-0 border-x-4 border-b-[7px] border-x-transparent border-b-current" />
                  Slow
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
