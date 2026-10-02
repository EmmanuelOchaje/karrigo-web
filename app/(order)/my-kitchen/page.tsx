import type { Metadata } from "next";
import Link from "next/link";

import { Door, Notice } from "@/components/kitchen/Door";
import { panel } from "@/components/kitchen/parts";
import { APPLICATION, listOrders, requireKitchen } from "@/lib/kitchen/data";

export const metadata: Metadata = { title: "Your kitchen · Karrigo" };

export default async function KitchenTodayPage() {
  const kitchen = await requireKitchen();
  const owner = kitchen.role === "OWNER";
  const orders = await listOrders().catch(() => null);

  const count = (...statuses: string[]) => orders?.filter((o) => statuses.includes(o.status)).length ?? 0;
  const dishes = kitchen.sections.flatMap((s) => s.dishes);
  const soldOut = dishes.filter((d) => d.soldOut);

  const tiles = [
    { label: "New orders", value: count("PLACED"), href: "/my-kitchen/orders" },
    { label: "Cooking", value: count("ACCEPTED", "PREPARING"), href: "/my-kitchen/orders" },
    { label: "Waiting for a rider", value: count("READY"), href: "/my-kitchen/orders" },
    { label: "Dishes sold out", value: soldOut.length, href: "/my-kitchen/menu" },
  ];

  return (
    <div className="gap-lg flex flex-col">
      <Door name={kitchen.name} isOpen={kitchen.isOpen} canSwitch={owner} />

      {dishes.length === 0 && (
        <div className="bg-warning-bg rounded-panel-sm p-xl">
          <p className="text-warning text-site-title">{kitchen.name} has nothing on the menu</p>
          <p className="text-site-body text-text-secondary mt-xs">
            Customers can open your page but there is nothing to order.{" "}
            <Link href="/my-kitchen/menu" className="text-accent-text font-bold">
              Add your dishes
            </Link>
          </p>
        </div>
      )}

      {orders === null ? (
        <div className={panel}>
          <p className="text-site-title">We couldn&rsquo;t load your orders just now</p>
          <p className="text-site-body text-text-secondary mt-xs">
            Check your connection, then open the{" "}
            <Link href="/my-kitchen/orders" className="text-accent-text font-bold">
              Orders tab
            </Link>{" "}
            to try again.
          </p>
        </div>
      ) : (
        <ul className="gap-md grid grid-cols-2 md:grid-cols-4">
          {tiles.map((t) => (
            <li key={t.label}>
              <Link href={t.href} className="bg-bg rounded-panel-sm hover:bg-surface-raised block h-full p-xl transition-colors duration-(--duration-fast)">
                <span className="text-panel-small block">{t.value}</span>
                <span className="text-site-label text-text-secondary mt-xs block">{t.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {owner && <Notice notice={kitchen.notice} />}

      {owner && (
        <p className="text-site-label text-text-secondary">
          Moved, changed bank, or want a new cover photo?{" "}
          <Link href={APPLICATION} className="text-accent-text font-bold">
            Change your location, payout account or photo
          </Link>
        </p>
      )}
    </div>
  );
}
