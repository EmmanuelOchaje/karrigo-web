import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { OrdersBoard } from "@/components/admin/orders/OrdersBoard";
import { formatClock, isActive, isUnassigned } from "@/lib/admin/derive";
import { ORDERS, SHIFT_NOW } from "@/lib/admin/fixtures";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const active = ORDERS.filter(isActive).length;
  const late = ORDERS.filter((order) => order.late && !order.cancelled).length;
  const unassigned = ORDERS.filter(isUnassigned).length;

  return (
    <OpsPage>
      <OpsPageHeader
        title="Live orders"
        meta={`${active} in flight · ${late} late · ${unassigned} with no rider · as of ${formatClock(
          SHIFT_NOW,
        )}`}
      />
      <OrdersBoard openOrder={order} />
    </OpsPage>
  );
}
