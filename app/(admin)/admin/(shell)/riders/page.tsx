import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { ReviewQueue } from "@/components/admin/queue/ReviewQueue";
import { RIDERS } from "@/lib/admin/fixtures";
import { requireAdmin } from "@/lib/admin/session";

export default async function RidersPage() {
  const admin = await requireAdmin();
  const waiting = RIDERS.filter((r) => r.status === "PENDING").length;

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
      <ReviewQueue kind="riders" role={admin.role} />
    </OpsPage>
  );
}
