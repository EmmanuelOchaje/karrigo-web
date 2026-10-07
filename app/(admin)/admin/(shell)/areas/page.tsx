import { AreasBoard } from "@/components/admin/AreasBoard";
import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { api } from "@/lib/api/client";
import type { AdminArea } from "@/lib/api/extra";
import { requireAdmin } from "@/lib/admin/session";

/** The neighbourhoods customers and kitchens pick their address from. */
export default async function AreasPage() {
  await requireAdmin();
  const areas = await api<AdminArea[]>("/admin/areas", { scope: "admin" });
  const live = areas.filter((a) => a.isActive).length;

  return (
    <OpsPage>
      <OpsPageHeader
        title="Areas"
        meta={`${live} on the list · customers choose from these at checkout and kitchens when they sign up`}
      />
      <AreasBoard areas={areas} />
    </OpsPage>
  );
}
