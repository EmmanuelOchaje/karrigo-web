import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { ReviewQueue } from "@/components/admin/queue/ReviewQueue";
import { KITCHENS } from "@/lib/admin/fixtures";
import { requireAdmin } from "@/lib/admin/session";

export default async function KitchensPage() {
  const admin = await requireAdmin();
  const waiting = KITCHENS.filter((k) => k.status === "PENDING").length;

  return (
    <OpsPage>
      <OpsPageHeader
        title="Kitchens"
        meta={
          waiting
            ? `${waiting} waiting for approval · oldest first`
            : "Nothing waiting for approval"
        }
      />
      <ReviewQueue kind="kitchens" role={admin.role} />
    </OpsPage>
  );
}
