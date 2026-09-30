import { FEED } from "@/lib/admin/fixtures";
import type { FeedKind } from "@/lib/admin/types";

/**
 * Everything happening across Makurdi, newest first. Not filterable and not
 * clickable on purpose: it is the peripheral vision of the shift, there to be
 * glanced at. Anything that needs acting on is in Needs attention.
 */
const KIND: Record<FeedKind, { label: string; className: string }> = {
  order: { label: "New order", className: "text-accent-text" },
  reject: { label: "Rejected", className: "text-danger" },
  sold: { label: "Sold out", className: "text-warning" },
  pause: { label: "Paused", className: "text-warning" },
  online: { label: "Rider online", className: "text-info" },
  pickup: { label: "Picked up", className: "text-info" },
  accept: { label: "Accepted", className: "text-success" },
  deliv: { label: "Delivered", className: "text-success" },
  cash: { label: "Cash", className: "text-text/72" },
  settle: { label: "Settled", className: "text-success" },
};

export function LiveActivity() {
  return (
    <section className="bg-ops-surface min-w-0 rounded-[15px] px-xl pt-xl pb-2.5">
      <h2 className="text-text mb-2 text-[16px] font-semibold">Live activity</h2>

      {FEED.length === 0 ? (
        <div className="flex flex-col gap-1.5 px-2.5 py-12 text-center">
          <span className="text-text text-[14px] font-semibold">Quiet so far</span>
          <span className="text-text/62 text-[13px] font-light">
            Orders, kitchen and rider events will stream in here.
          </span>
        </div>
      ) : (
        <ul>
          {FEED.map((event, i) => {
            const kind = KIND[event.kind];
            return (
              <li
                key={`${event.time}-${i}`}
                className="border-text/6 grid grid-cols-[44px_10px_minmax(0,1fr)] items-baseline gap-2.5 border-b py-2.5"
              >
                <span className="text-text/50 text-[12px] font-medium">
                  {event.time}
                </span>
                <span
                  aria-hidden
                  className={`size-2 -translate-y-px rounded-full bg-current ${kind.className}`}
                />
                <span className="text-text/85 text-[13px]/[1.45] font-light">
                  <span className={`font-semibold ${kind.className}`}>
                    {kind.label}
                  </span>{" "}
                  · {event.text}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
