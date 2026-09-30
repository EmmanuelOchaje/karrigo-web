import { cn } from "@/lib/cn";
import { KPIS } from "@/lib/admin/fixtures";

/**
 * The six numbers the shift is judged on. `good` is set per KPI rather than
 * read off the arrow, because up is not always good here: average delivery
 * time and cancellations rising are both bad news wearing an up arrow.
 */
export function KpiRow() {
  return (
    <div className="mb-3.5 grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
      {KPIS.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-ops-surface flex min-w-0 flex-col gap-2.5 rounded-[15px] px-lg pt-lg pb-[15px]"
        >
          <span className="text-text/62 text-[12.5px] font-medium">
            {kpi.label}
          </span>
          <span className="text-text text-[25px]/none font-bold tracking-[-0.03em] whitespace-nowrap">
            {kpi.value}
          </span>
          <span className="flex flex-wrap items-center gap-[7px]">
            <span
              className={cn(
                "rounded-pill px-2 py-[3px] text-[11.5px] font-bold whitespace-nowrap",
                kpi.good
                  ? "bg-success-bg text-success"
                  : "bg-danger-bg text-danger",
              )}
            >
              {kpi.delta}
            </span>
            <span className="text-text/55 text-[12px] font-light">
              {kpi.versus}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
