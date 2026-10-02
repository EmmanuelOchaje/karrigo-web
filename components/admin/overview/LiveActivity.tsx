import type { OverviewView } from "@/lib/admin/overview";

/**
 * What the ops team has done lately, from the audit log — approvals, refunds,
 * payouts, suspensions, with who did them. Not filterable and not clickable on
 * purpose: it is the peripheral vision of the shift, there to be glanced at.
 */
export function LiveActivity({ events }: { events: OverviewView["activity"] }) {
  return (
    <section className="bg-ops-surface min-w-0 rounded-[15px] px-xl pt-xl pb-2.5">
      <h2 className="text-text mb-2 text-[16px] font-semibold">Recent admin activity</h2>

      {events.length === 0 ? (
        <div className="flex flex-col gap-1.5 px-2.5 py-12 text-center">
          <span className="text-text text-[14px] font-semibold">Quiet so far</span>
          <span className="text-text/62 text-[13px] font-light">
            Approvals, refunds and payouts are listed here as they happen.
          </span>
        </div>
      ) : (
        <ul>
          {events.map((event, i) => (
            <li
              key={`${event.time}-${i}`}
              className="border-text/6 grid grid-cols-[72px_minmax(0,1fr)] items-baseline gap-2.5 border-b py-2.5"
            >
              <span className="text-text/50 text-[12px] font-medium">{event.time}</span>
              <span className="text-text/85 text-[13px]/[1.45] font-light">{event.text}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
