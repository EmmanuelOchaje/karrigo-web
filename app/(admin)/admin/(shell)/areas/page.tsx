import { AreasBoard } from "@/components/admin/AreasBoard";
import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { Pager } from "@/components/admin/ui";
import { api } from "@/lib/api/client";
import type { AdminArea } from "@/lib/api/extra";
import { requireAdmin } from "@/lib/admin/session";

const PAGE_SIZE = 20;

/** The neighbourhoods customers and kitchens pick their address from. The
 *  backend returns them all at once, so they are paged here. */
export default async function AreasPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdmin();
  const areas = await api<AdminArea[]>("/admin/areas", { scope: "admin" });
  const live = areas.filter((a) => a.isActive).length;

  const last = Math.max(1, Math.ceil(areas.length / PAGE_SIZE));
  const page = Math.min(last, Math.max(1, Number((await searchParams).page) || 1));
  const shown = areas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <OpsPage>
      <OpsPageHeader
        title="Areas"
        meta={`${live} on the list · customers choose from these at checkout and kitchens when they sign up`}
      />
      <AreasBoard
        areas={shown}
        footer={
          <Pager
            page={page}
            pageSize={PAGE_SIZE}
            total={areas.length}
            previous="← Previous"
            next="Next →"
            href={(p) => (p > 1 ? `/areas?page=${p}` : "/areas")}
          />
        }
      />
    </OpsPage>
  );
}
