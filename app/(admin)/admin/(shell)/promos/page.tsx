import { ConfirmAction } from "@/components/admin/ConfirmAction";
import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { PromoForm } from "@/components/admin/people/PromoForm";
import { EmptyState, LinkTab, Pager, StatusChip, type Tone } from "@/components/admin/ui";
import { api, type Schemas } from "@/lib/api/client";
import { whenLabel } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/session";
import { formatKobo, nairaToKobo } from "@/lib/money";
import { setPromoActive } from "../../people-actions";

type Search = { active?: string; page?: string };
const PAGE_SIZE = 25;

const TONE: Record<Schemas["AdminPromoCodeDto"]["state"], Tone> = {
  ACTIVE: "success",
  DEACTIVATED: "muted",
  EXPIRED: "muted",
  EXHAUSTED: "warning",
};

/** Discount codes customers type at checkout. Creating and switching them
 *  off is for super admins: a code is money off every order that uses it. */
export default async function PromosPage({ searchParams }: { searchParams: Promise<Search> }) {
  const admin = await requireAdmin();
  const s = await searchParams;
  const page = Math.max(1, Number(s.page) || 1);
  const canEdit = admin.role === "SUPER_ADMIN";

  const list = await api<Schemas["AdminPromoCodePageDto"]>("/admin/promo-codes", {
    scope: "admin",
    query: { page, pageSize: PAGE_SIZE, ...(s.active ? { active: s.active === "true" } : {}) },
  });

  const tab = (active: string) => `/promos${active ? `?active=${active}` : ""}`;

  return (
    <OpsPage>
      <OpsPageHeader title="Promo codes" meta={`${list.total} code${list.total === 1 ? "" : "s"} · newest first`} />

      <div className="flex flex-wrap items-start gap-3.5">
        <section className="bg-ops-surface min-w-0 flex-[3_1_460px] rounded-[15px]">
          <div className="border-text/6 flex flex-wrap gap-2 border-b px-lg py-3.5">
            <LinkTab href={tab("")} label="All" selected={!s.active} />
            <LinkTab href={tab("true")} label="Usable now" selected={s.active === "true"} />
            <LinkTab href={tab("false")} label="Off or used up" selected={s.active === "false"} />
          </div>

          {list.items.length === 0 ? (
            <EmptyState title="No promo codes" text={canEdit ? "Create one on the right." : "A super admin can create one."} />
          ) : (
            list.items.map((p) => (
              <div key={p.id} className="border-text/6 flex flex-wrap items-center justify-between gap-3 border-b px-lg py-3.5">
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-text text-[14px] font-bold tracking-[0.02em]">
                    {p.code}{" "}
                    <span className="text-text/62 font-semibold">
                      · {p.discountType === "PERCENT" ? `${p.value}% off` : `${formatKobo(nairaToKobo(p.value))} off`}
                    </span>
                  </span>
                  <span className="text-text/55 text-[12px] font-light">
                    Used {p.usedCount}
                    {p.maxUses ? ` of ${p.maxUses}` : ""}
                    {p.minSubtotalNaira ? ` · min ${formatKobo(nairaToKobo(p.minSubtotalNaira))}` : ""}
                    {p.expiresAt ? ` · ends ${whenLabel(p.expiresAt)}` : ""}
                    {p.description ? ` · ${p.description}` : ""}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <StatusChip tone={TONE[p.state]}>{p.state.toLowerCase()}</StatusChip>
                  {canEdit && p.state === "ACTIVE" && (
                    <ConfirmAction
                      size="sm"
                      tone="bad"
                      label="Switch off"
                      title={`Switch off ${p.code}?`}
                      text="Checkout stops accepting it straight away."
                      confirm="Switch off"
                      run={setPromoActive.bind(null, p.id, false)}
                    />
                  )}
                  {canEdit && p.state === "DEACTIVATED" && (
                    <ConfirmAction
                      size="sm"
                      tone="go"
                      label="Turn back on"
                      title={`Turn ${p.code} back on?`}
                      confirm="Turn on"
                      run={setPromoActive.bind(null, p.id, true)}
                    />
                  )}
                </span>
              </div>
            ))
          )}
          <Pager page={page} pageSize={PAGE_SIZE} total={list.total} href={(n) => `${tab(s.active ?? "")}${s.active ? "&" : "?"}page=${n}`} />
        </section>

        {canEdit && (
          <aside data-theme="light" className="bg-ops-surface text-text min-w-0 max-w-full flex-[2_1_380px] rounded-[15px] p-[22px]">
            <h2 className="mb-3.5 text-[17px] font-bold tracking-[-0.02em]">New promo code</h2>
            <PromoForm />
          </aside>
        )}
      </div>
    </OpsPage>
  );
}
