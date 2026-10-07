import { AreasBoard } from "@/components/admin/AreasBoard";
import { OpsPage, OpsPageHeader } from "@/components/admin/OpsPage";
import { Pager } from "@/components/admin/ui";
import { api } from "@/lib/api/client";
import type { AdminArea } from "@/lib/api/extra";
import { requireAdmin } from "@/lib/admin/session";

const SIZES = [10, 25, 50, 100];
const DEFAULT_SIZE = 10;

/** The neighbourhoods customers and kitchens pick their address from. The
 *  backend returns them all at once, so they are paged here, with a choice of rows per page. */
export default async function AreasPage({ searchParams }: { searchParams: Promise<{ page?: string; size?: string }> }) {
  await requireAdmin();
  const areas = await api<AdminArea[]>("/admin/areas", { scope: "admin" });
  const live = areas.filter((a) => a.isActive).length;

  const query = await searchParams;
  const requested = Number(query.size);
  const pageSize = SIZES.includes(requested) ? requested : DEFAULT_SIZE;
  const last = Math.max(1, Math.ceil(areas.length / pageSize));
  const page = Math.min(last, Math.max(1, Number(query.page) || 1));
  const shown = areas.slice((page - 1) * pageSize, page * pageSize);

  // Keeps a chosen size when moving between pages.
  const href = (p: number, size = pageSize) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (size !== DEFAULT_SIZE) params.set("size", String(size));
    const q = params.toString();
    return `/areas${q ? `?${q}` : ""}`;
  };

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
            pageSize={pageSize}
            total={areas.length}
            previous="← Previous"
            next="Next →"
            href={(p) => href(p)}
            sizes={SIZES}
            // A different size starts again from the first page.
            sizeHref={(size) => href(1, size)}
          />
        }
      />
    </OpsPage>
  );
}
