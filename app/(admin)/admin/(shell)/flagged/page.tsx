import { ConfirmAction } from "@/components/admin/ConfirmAction";
import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { EmptyState, LinkTab, StatusChip } from "@/components/admin/ui";
import { api } from "@/lib/api/client";
import type { FlaggedItem } from "@/lib/api/extra";
import { whenLabel } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/session";
import { clearProductFlag } from "../../moderation-actions";

type Search = { view?: string };

/**
 * Products ops has hidden from customers. A kitchen owner can appeal a flag
 * once; those come first, because someone is waiting for an answer. Clearing
 * a flag puts the product back on sale and drops the appeal with it.
 */
export default async function FlaggedPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin();
  const { view = "" } = await searchParams;
  const items = await api<FlaggedItem[]>("/admin/flagged-items", {
    scope: "admin",
    query: view === "appealed" ? { hasAppeal: true } : {},
  });
  const sorted = [...items].sort(
    (a, b) => Number(!!b.flagAppealedAt) - Number(!!a.flagAppealedAt) || b.flaggedAt.localeCompare(a.flaggedAt),
  );

  return (
    <OpsPage>
      <OpsPageHeader
        title="Flagged items"
        meta={`${sorted.length} product${sorted.length === 1 ? "" : "s"} hidden from customers · appeals first`}
      />
      <section className="bg-ops-surface min-w-0 rounded-[15px]">
        <div className="border-text/6 flex flex-wrap items-center gap-2 border-b px-lg py-3.5">
          <LinkTab href="/flagged" label="All" selected={view === ""} />
          <LinkTab href="/flagged?view=appealed" label="Appealed" selected={view === "appealed"} />
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            title={view === "appealed" ? "No appeals waiting" : "Nothing is flagged"}
            text="To flag a product, open its kitchen under Kitchens and choose Show products."
          />
        ) : (
          sorted.map((item) => (
            <div key={item.itemId} className="border-text/6 flex flex-wrap items-start justify-between gap-3 border-b px-lg py-3.5">
              <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-1">
                <span className="text-text text-[14px] font-semibold">
                  {item.itemName} · {item.kitchenName}
                  {item.flagAppealedAt && (
                    <span className="ml-2 align-middle">
                      <StatusChip tone="warning">Appealed</StatusChip>
                    </span>
                  )}
                </span>
                {item.flagNote && <p className="text-text/85 text-[13px]/[1.5]">Flagged for: {item.flagNote}</p>}
                {item.flagAppealNote && (
                  <p className="text-text/85 text-[13px]/[1.5]">Owner&rsquo;s appeal: “{item.flagAppealNote}”</p>
                )}
                <span className="text-text/55 text-[12px] font-light">
                  Flagged {whenLabel(item.flaggedAt)}
                  {item.flagAppealedAt ? ` · appealed ${whenLabel(item.flagAppealedAt)}` : ""}
                </span>
              </div>
              <div className="flex max-w-full flex-[0_1_320px] justify-end">
                <ConfirmAction
                  size="sm"
                  tone="go"
                  label="Clear flag"
                  title={`Put ${item.itemName} back on sale?`}
                  text={`Customers can see and order it from ${item.kitchenName} again.`}
                  confirm="Clear flag"
                  run={clearProductFlag.bind(null, item.itemId)}
                />
              </div>
            </div>
          ))
        )}
      </section>
    </OpsPage>
  );
}
