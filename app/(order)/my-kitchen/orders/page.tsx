import type { Metadata } from "next";

import { OrdersBoard } from "@/components/kitchen/OrdersBoard";
import { listOrders, requireKitchen } from "@/lib/kitchen/data";

export const metadata: Metadata = { title: "Orders · Your kitchen · Karrigo" };

export default async function KitchenOrdersPage() {
  const kitchen = await requireKitchen();
  // A failure here goes to error.tsx, which offers a retry: an orders page
  // that quietly shows nothing would be worse than one that says it is stuck.
  const orders = await listOrders();
  return <OrdersBoard orders={orders} isOpen={kitchen.isOpen} />;
}
