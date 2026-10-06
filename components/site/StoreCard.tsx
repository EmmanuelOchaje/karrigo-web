import Link from "next/link";
import type { Store } from "@/lib/fixtures";
import { formatKobo } from "@/lib/money";

export function StoreCard({ store }: { store: Store }) {
  return (
    <Link
      href="/stores"
      className="bg-bg rounded-panel-sm p-sm group block transition-[transform,box-shadow] duration-(--duration-normal) hover:-translate-y-1.5 hover:shadow-card"
    >
      {/* No store photos yet — real photos needed before launch, per the
          design handoff. A placeholder keeps the grid's rhythm intact. */}
      <div className="bg-surface-raised text-text-tertiary text-site-label relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-panel-xs text-center">
        {store.category}
      </div>

      <div className="px-sm pt-lg pb-sm">
        <div className="text-site-title">{store.name}</div>
        <div className="text-site-label text-text-secondary mt-xs">
          {store.category} · {store.area}
        </div>

        <div className="mt-md gap-xs text-site-chip flex flex-wrap">
          <span className="bg-surface rounded-pill px-md py-xs">
            {store.etaMinutes[0]}–{store.etaMinutes[1]} min
          </span>
          {store.deliveryFeeKobo !== undefined && (
            <span className="bg-surface rounded-pill px-md py-xs">
              {formatKobo(store.deliveryFeeKobo)} delivery
            </span>
          )}
          {store.minOrderKobo !== undefined && (
            <span className="bg-surface rounded-pill px-md py-xs">
              Min {formatKobo(store.minOrderKobo)}
            </span>
          )}
          {store.closesAt && (
            <span className="bg-surface rounded-pill px-md py-xs">
              {store.closesAt}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
