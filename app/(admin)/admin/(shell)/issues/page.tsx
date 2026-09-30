import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { IssuesBoard } from "@/components/admin/issues/IssuesBoard";
import { TICKETS } from "@/lib/admin/fixtures";

export default function IssuesPage() {
  const open = TICKETS.filter((t) => t.status === "OPEN").length;
  const working = TICKETS.filter((t) => t.status === "IN_PROGRESS").length;

  return (
    <OpsPage>
      <OpsPageHeader
        title="Issues"
        meta={`${open} open · ${working} in progress · newest first`}
      />
      <IssuesBoard />
    </OpsPage>
  );
}
