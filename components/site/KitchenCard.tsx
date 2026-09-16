import Link from "next/link";
import Image from "next/image";
import type { Kitchen } from "@/lib/fixtures";
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
        "bg-bg rounded-panel-sm p-sm group block transition-[transform,box-shadow] duration-(--duration-normal)",
        shut ? "opacity-45" : "hover:-translate-y-1.5 hover:shadow-card",
      )}
    >
      <div className="bg-surface-raised relative aspect-[4/3] overflow-hidden rounded-panel-xs">
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
        {shut ? (
          <span className="bg-danger text-bg absolute top-sm left-sm rounded-pill px-md py-xs text-eyebrow normal-case">
            {kitchen.closedUntil}
          </span>
        ) : kitchen.deliveryFeeKobo === 0 ? (
          <span className="bg-accent text-on-accent absolute top-sm left-sm rounded-pill px-md py-xs text-eyebrow normal-case">
            Free delivery
          </span>
        ) : kitchen.opensAt ? (
          <span className="bg-accent-warm text-bg absolute top-sm left-sm rounded-pill px-md py-xs text-eyebrow normal-case">
            {kitchen.opensAt}
          </span>
        ) : null}
      </div>

      <div className="px-sm pt-lg pb-sm">
        <div className="text-site-title">{kitchen.name}</div>
        <div className="text-site-label text-text-secondary mt-xs">
          {kitchen.cuisine} · {kitchen.area}
        </div>

        {!shut && (
          <div className="mt-md gap-xs text-site-chip flex">
            <span className="bg-surface rounded-pill px-md py-xs">
              {kitchen.distanceKm} km
            </span>
            <span className="bg-surface rounded-pill px-md py-xs">
              {kitchen.etaMinutes[0]}–{kitchen.etaMinutes[1]} min
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
