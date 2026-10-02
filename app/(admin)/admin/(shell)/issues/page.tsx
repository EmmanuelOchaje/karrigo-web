import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { IssuesBoard } from "@/components/admin/issues/IssuesBoard";
import { loadTickets } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/admin/session";

export default async function IssuesPage() {
  await requireAdmin();
  const tickets = await loadTickets();
  const open = tickets.filter((t) => t.status === "OPEN").length;
  const working = tickets.filter((t) => t.status === "IN_PROGRESS").length;

  return (
    <OpsPage>
      <OpsPageHeader
        title="Issues"
        meta={`${open} open · ${working} in progress · newest first`}
      />
      <IssuesBoard tickets={tickets} />
    </OpsPage>
  );
}
