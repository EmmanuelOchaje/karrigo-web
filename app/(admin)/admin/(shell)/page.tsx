import { KpiRow } from "@/components/admin/overview/KpiRow";
import { OrdersByHour } from "@/components/admin/overview/OrdersByHour";
import { NeedsAttention } from "@/components/admin/overview/NeedsAttention";
import { OrderPipeline } from "@/components/admin/overview/OrderPipeline";
import { KitchensNow } from "@/components/admin/overview/KitchensNow";
import { LiveActivity } from "@/components/admin/overview/LiveActivity";
import { RefreshButton } from "@/components/admin/overview/RefreshButton";
import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { loadOverview } from "@/lib/admin/overview";
import { requireAdmin } from "@/lib/admin/session";

const when = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Lagos",
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export default async function OverviewPage() {
  await requireAdmin();
  const view = await loadOverview();

  return (
    <OpsPage>
      <OpsPageHeader
        title="Overview"
        meta={`${when.format(new Date(view.generatedAt))} WAT`}
        actions={
          <>
            <span className="bg-success-bg text-success inline-flex h-[38px] items-center gap-2 rounded-pill px-lg text-[13px] font-semibold">
              <span className="bg-success size-2 rounded-full" />
              Live
            </span>
            <RefreshButton />
          </>
        }
      />

      <KpiRow kpis={view.kpis} />

      <div className="mb-3.5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-3.5">
        <OrdersByHour trend={view.trend} />
        <NeedsAttention items={view.attention} />
      </div>

      <OrderPipeline stages={view.pipeline} open={view.openOrders} />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-3.5">
        <KitchensNow kitchens={view.kitchens} />
        <LiveActivity events={view.activity} />
      </div>
    </OpsPage>
  );
}
