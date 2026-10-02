import { cn } from "@/lib/cn";
import { formatKobo } from "@/lib/money";
import type { OverviewView } from "@/lib/admin/overview";
import { StatusChip } from "@/components/admin/ui";

/* The narrowest this table reads at. Below it the panel scrolls
   sideways rather than squeezing the numbers into two lines. */
const COLUMNS = "grid min-w-[460px] grid-cols-[minmax(120px,2fr)_minmax(80px,1fr)_90px_70px]";

/**
 * Every live kitchen and whether it is taking orders right now. A kitchen
 * that has been closed through a lunch rush is the quiet failure ops wants to
 * spot — it shows here before a customer complains.
 */
export function KitchensNow({ kitchens }: { kitchens: OverviewView["kitchens"] }) {
  const open = kitchens.filter((k) => k.open).length;

  return (
    <section className="bg-ops-surface ops-scroll-x min-w-0 rounded-[15px] px-[22px] pt-xl pb-2">
      <div className="mb-1.5 flex items-center justify-between">
        <h2 className="text-text text-[16px] font-semibold">Kitchens right now</h2>
        <span className="text-text/62 text-[12.5px] font-light">
          {open} open · {kitchens.length - open} closed
        </span>
      </div>

      {kitchens.length === 0 ? (
        <p className="text-text/62 px-2.5 py-10 text-center text-[13px] font-light">
          No kitchen is live yet. Approve one from Kitchens.
        </p>
      ) : (
        <>
          <div
            className={cn(
              COLUMNS,
              "border-text/8 text-text/50 gap-2.5 border-b py-2.5",
              "text-[11px] font-semibold tracking-[0.08em] uppercase",
            )}
          >
            <span>Kitchen</span>
            <span>Area</span>
            <span>Status</span>
            <span className="text-right">Rating</span>
          </div>
          {kitchens.map((k) => (
            <div
              key={k.id}
              className={cn(COLUMNS, "border-text/6 items-center gap-2.5 border-b py-3 text-[13px] last:border-b-0")}
            >
              <span className="text-text truncate font-semibold">{k.name}</span>
              <span className="text-text/62 truncate font-light">{k.area}</span>
              <span>
                <StatusChip tone={k.open ? "success" : "muted"}>{k.open ? "Open" : "Closed"}</StatusChip>
              </span>
              <span className="text-text/62 text-right font-light" title={`Delivery ${formatKobo(k.feeKobo)}`}>
                {k.rating}
              </span>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
