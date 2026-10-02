import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { OrdersBoard } from "@/components/admin/orders/OrdersBoard";
import { api, type Schemas } from "@/lib/api/client";
import { isActive, isUnassigned, liveOrder } from "@/lib/admin/orders";
import { requireAdmin } from "@/lib/admin/session";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const admin = await requireAdmin();
  const { order } = await searchParams;

  // The 100 newest — the board is for the live shift, and search/filter work
  // on what is loaded. Older history is the ledger's job.
  const page = await api<Schemas["AdminOrderPageDto"]>("/admin/orders", {
    scope: "admin",
    query: { pageSize: 100 },
  });
  const orders = page.items.map((item) => liveOrder(item));

  const active = orders.filter(isActive).length;
  const late = orders.filter((o) => o.late).length;
  const unassigned = orders.filter(isUnassigned).length;

  return (
    <OpsPage>
      <OpsPageHeader
        title="Live orders"
        meta={`${active} in flight · ${late} late · ${unassigned} with no rider · ${page.total} in all`}
      />
      <OrdersBoard orders={orders} role={admin.role} openOrder={order} />
    </OpsPage>
  );
}
