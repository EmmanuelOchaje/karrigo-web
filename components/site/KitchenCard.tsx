import Link from "next/link";
import Image from "next/image";
import type { Kitchen } from "@/lib/fixtures";
import { formatKobo } from "@/lib/money";
import { cn } from "@/lib/cn";

export function KitchenCard({
  kitchen,
  priority = false,
}: {
  kitchen: Kitchen;
  priority?: boolean;
}) {
  const shut = Boolean(kitchen.closedUntil);

  return (
    <Link
      href={`/k/${kitchen.slug}`}
      className={cn(
        "border-border rounded-card group block overflow-hidden border transition-colors duration-(--duration-fast)",
        shut ? "opacity-45" : "hover:border-border-strong",
      )}
    >
      <div className="bg-surface relative aspect-[3/2] overflow-hidden">
        <Image
          src={kitchen.image}
          alt={`${kitchen.cuisine} from ${kitchen.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 350px"
          priority={priority}
          className={cn(
            "object-cover transition-transform duration-(--duration-slow)",
            !shut && "group-hover:scale-[1.03]",
          )}
        />
      </div>

      <div className="p-md">
        <div className="text-h2">{kitchen.name}</div>
        <div className="text-site-label text-text-secondary mt-xs">
          {kitchen.cuisine} · {kitchen.area}
        </div>

        <div className="text-site-label text-text-secondary mt-sm gap-sm flex flex-wrap items-center">
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
      </div>
    </Link>
  );
}
