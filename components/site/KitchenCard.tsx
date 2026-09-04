import Link from "next/link";
import type { Kitchen } from "@/lib/fixtures";
import { formatKobo } from "@/lib/money";
import { cn } from "@/lib/cn";

export function KitchenCard({ kitchen }: { kitchen: Kitchen }) {
  const shut = Boolean(kitchen.closedUntil);

  return (
    <Link
      href={`/k/${kitchen.slug}`}
      className={cn(
        "border-border rounded-card p-md block border transition-colors duration-(--duration-fast)",
        shut ? "opacity-45" : "hover:border-border-strong",
      )}
    >
      <div className="bg-surface rounded-[9px] grid h-[72px] place-items-center text-3xl">
        {kitchen.emoji}
      </div>

      <div className="text-h3 mt-sm">{kitchen.name}</div>
      <div className="text-caption text-text-secondary mt-xs">
        {kitchen.cuisine} · {kitchen.area}
      </div>

      <div className="text-caption text-text-secondary mt-sm gap-sm flex flex-wrap items-center">
        {shut ? (
          <span>{kitchen.closedUntil}</span>
        ) : (
          <>
            <span className="text-accent-text font-semibold">
              {kitchen.distanceKm} km
            </span>
            <span>
              {kitchen.etaMinutes[0]}–{kitchen.etaMinutes[1]} min
            </span>
            {kitchen.deliveryFeeKobo === 0 ? (
              <span className="bg-accent text-on-accent text-micro rounded-[5px] px-xs font-bold">
                Free delivery
              </span>
            ) : (
              <span>{formatKobo(kitchen.deliveryFeeKobo)} delivery</span>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
