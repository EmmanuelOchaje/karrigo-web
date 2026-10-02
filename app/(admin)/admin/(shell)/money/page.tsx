import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { MoneyBoard } from "@/components/admin/money/MoneyBoard";
import { loadMoney } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/admin/session";

export default async function MoneyPage() {
  const admin = await requireAdmin();
  const money = await loadMoney();

  return (
    <OpsPage>
      <OpsPageHeader
        title="Money"
        meta="Payouts go out when you send them · Karrigo keeps 15% of kitchen sales"
      />
      <MoneyBoard role={admin.role} money={money} />
    </OpsPage>
  );
}
