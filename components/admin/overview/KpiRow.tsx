import { cn } from "@/lib/cn";
import type { OverviewView } from "@/lib/admin/overview";

/**
 * The six numbers the shift is judged on. `good` is set per KPI rather than
 * read off the arrow, because up is not always good here: cancellations rising
 * is bad news wearing an up arrow.
 */
export function KpiRow({ kpis }: { kpis: OverviewView["kpis"] }) {
  // Two across on a phone. One per row turns six numbers into a page of
  // scrolling, and the whole point of the row is reading them together.
  return (
    <div className="mb-3.5 grid grid-cols-2 gap-3 md:grid-cols-[repeat(auto-fill,minmax(170px,1fr))]">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-ops-surface flex min-w-0 flex-col gap-2.5 rounded-[15px] px-lg pt-lg pb-[15px]"
        >
          <span className="text-text/62 text-[12.5px] font-medium">{kpi.label}</span>
          <span className="text-text text-[19px]/none font-bold tracking-[-0.03em] whitespace-nowrap md:text-[25px]">
            {kpi.value}
          </span>
          <span className="flex flex-wrap items-center gap-[7px]">
            {kpi.delta && (
              <span
                className={cn(
                  "rounded-pill px-2 py-[3px] text-[11.5px] font-bold whitespace-nowrap",
                  kpi.good ? "bg-success-bg text-success" : "bg-danger-bg text-danger",
                )}
              >
                {kpi.delta}
              </span>
            )}
            <span className="text-text/55 text-[12px] font-light">{kpi.versus}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
