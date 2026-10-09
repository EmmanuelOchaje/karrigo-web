import { OpsPage } from "@/components/admin/OpsPage";

/** Shown inside the ops shell while a page's data loads, so the sidebar stays
 *  put and a click on it answers at once. One shape for every screen: a title,
 *  a row of figures and a list — close enough that nothing jumps much. */
export default function Loading() {
  return (
    <OpsPage>
      <div aria-busy="true" aria-label="Loading" className="flex flex-col">
        <div className="mb-[22px] flex flex-col gap-[9px]">
          <div className="bg-text/10 h-[30px] w-[min(100%,220px)] animate-pulse rounded-[8px]" />
          <div className="bg-text/8 h-[14px] w-[min(100%,360px)] animate-pulse rounded-[6px]" />
        </div>
        <div className="mb-3.5 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-ops-surface h-[92px] animate-pulse rounded-[15px]" />
          ))}
        </div>
        <div className="bg-ops-surface rounded-[15px] p-lg">
          <div className="bg-text/8 mb-lg h-[14px] w-[160px] animate-pulse rounded-[6px]" />
          <div className="flex flex-col gap-3.5">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="bg-text/6 h-[44px] animate-pulse rounded-[10px]" />
            ))}
          </div>
        </div>
      </div>
    </OpsPage>
  );
}
