import { KpiRow } from "@/components/admin/overview/KpiRow";
import { OrdersByHour } from "@/components/admin/overview/OrdersByHour";
import { NeedsAttention } from "@/components/admin/overview/NeedsAttention";
import { OrderPipeline } from "@/components/admin/overview/OrderPipeline";
import { KitchensNow } from "@/components/admin/overview/KitchensNow";
import { LiveActivity } from "@/components/admin/overview/LiveActivity";
import { RefreshButton } from "@/components/admin/overview/RefreshButton";
import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { formatClock } from "@/lib/admin/derive";
import { COMPARED_WITH, SHIFT_DATE, SHIFT_NOW } from "@/lib/admin/fixtures";

export default function OverviewPage() {
  return (
    <OpsPage>
      <OpsPageHeader
        title="Overview"
        meta={`${SHIFT_DATE} · ${formatClock(SHIFT_NOW)} WAT · compared with ${COMPARED_WITH}`}
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

      <KpiRow />

      <div className="mb-3.5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-3.5">
        <OrdersByHour />
        <NeedsAttention />
      </div>

      <OrderPipeline />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-3.5">
        <KitchensNow />
        <LiveActivity />
      </div>
    </OpsPage>
  );
}
