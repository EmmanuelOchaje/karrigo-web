import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { ReviewQueue } from "@/components/admin/queue/ReviewQueue";
import { loadQueue } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/admin/session";

export default async function RidersPage() {
  const admin = await requireAdmin();
  const items = await loadQueue("riders");
  const waiting = items.filter((item) => item.status === "PENDING").length;

  return (
    <OpsPage>
      <OpsPageHeader
        title="Riders"
        meta={
          waiting
            ? `${waiting} waiting for review · oldest first`
            : "Nothing waiting for review"
        }
      />
      <ReviewQueue kind="riders" role={admin.role} items={items} />
    </OpsPage>
  );
}
