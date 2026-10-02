import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { TeamBoard } from "@/components/admin/people/TeamBoard";
import { api, type Schemas } from "@/lib/api/client";
import { requireAdmin } from "@/lib/admin/session";

export default async function TeamPage() {
  const admin = await requireAdmin();
  const admins = await api<Schemas["AdminAccountListItemDto"][]>("/admin/admins", { scope: "admin" });
  const active = admins.filter((a) => a.status === "ACTIVE").length;

  return (
    <OpsPage>
      <OpsPageHeader
        title="Team"
        meta={`${active} active · ${admin.role === "SUPER_ADMIN" ? "you can add and remove people" : "only a super admin can make changes"}`}
      />
      <TeamBoard admins={admins} me={admin.email} canManage={admin.role === "SUPER_ADMIN"} />
    </OpsPage>
  );
}
