import Link from "next/link";

import { Eyebrow } from "@/components/site/Eyebrow";
import { LiveOrders } from "@/components/kitchen/LiveOrders";
import { ConsoleTabs } from "@/components/kitchen/parts";
import { listOrders, requireKitchen } from "@/lib/kitchen/data";

/**
 * Where a live kitchen is run from: the door, the orders, the menu. Built
 * for the phone propped up next to the stove — one column, big targets.
 * `requireKitchen()` is the gate; each page calls it again, because a layout
 * is not re-run on every navigation.
 */
export default async function KitchenConsoleLayout({ children }: { children: React.ReactNode }) {
  const kitchen = await requireKitchen();
  // The bell is a convenience. If the orders can't be read, the orders page
  // says so itself; the rest of the console should still open.
  const orders = await listOrders().catch(() => []);
  const waitingIds = orders.filter((o) => o.status === "PLACED").map((o) => o.id);

  return (
    <div className="mx-auto max-w-[960px]">
      <div className="gap-md flex flex-wrap items-center justify-between">
        <Eyebrow>{kitchen.isOpen ? "Open now" : "Closed"}</Eyebrow>
        <LiveOrders waitingIds={waitingIds} />
      </div>
      <div className="gap-md mt-md flex flex-wrap items-end justify-between">
        <h1 className="text-section-small md:text-section text-balance">{kitchen.name}</h1>
        <Link href={`/k/${kitchen.slug}`} className="text-accent-text text-site-label pb-sm font-bold">
          See your page as a customer
        </Link>
      </div>
      <div className="mt-lg mb-xl">
        <ConsoleTabs owner={kitchen.role === "OWNER"} waiting={waitingIds.length} />
      </div>
      {children}
    </div>
  );
}
