import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatKobo } from "@/lib/money";

export type RestaurantTag = {
  label: string;
  tone?: "default" | "free" | "new" | "busy";
};

const tagTones: Record<NonNullable<RestaurantTag["tone"]>, string> = {
  default: "bg-surface text-text-secondary",
  free: "bg-accent text-on-accent",
  new: "bg-surface text-accent-text",
  busy: "bg-danger-bg text-danger",
};

export function RestaurantRow({
  href,
  name,
  cuisine,
  thumbnail,
  distanceKm,
  etaMinutes,
  deliveryFeeKobo,
  tags = [],
  closedLabel,
  className,
}: {
  href: string;
  name: string;
  cuisine: string;
  thumbnail?: React.ReactNode;
  distanceKm: number;
  etaMinutes: number;
  /** Comes from the restaurant's delivery fee bands — never a flat number. */
  deliveryFeeKobo: number;
  tags?: RestaurantTag[];
  /** Set when the kitchen is shut. Closed kitchens stay visible, never hidden. */
  closedLabel?: string;
  className?: string;
}) {
  const shut = Boolean(closedLabel);

  return (
    <Link
      href={href}
      className={cn(
        "border-border flex items-center gap-md border-b py-sm last:border-b-0",
        className,
      )}
    >
      <div
        className={cn(
          "bg-surface grid size-[46px] shrink-0 place-items-center rounded-[11px] text-lg",
          shut && "opacity-45",
        )}
      >
        {thumbnail}
      </div>

      <div className={cn("min-w-0 flex-1", shut && "opacity-45")}>
        <div className="text-h3">{name}</div>
        <div className="text-caption text-text-secondary truncate">{cuisine}</div>

        <div className="text-caption text-text-secondary mt-xs flex items-center gap-sm">
          <span className="text-accent-text font-semibold">
            {distanceKm.toFixed(1)} km
          </span>
          <span className="bg-border-strong size-[2.5px] rounded-full" />
          <span>{etaMinutes} min</span>
          <span className="bg-border-strong size-[2.5px] rounded-full" />
          <span>
            {deliveryFeeKobo === 0 ? "Free delivery" : `${formatKobo(deliveryFeeKobo)} delivery`}
          </span>
        </div>

        {shut ? (
          <div className="text-caption text-text-secondary mt-xs font-semibold">
            {closedLabel}
          </div>
        ) : (
          tags.length > 0 && (
            <div className="mt-xs gap-xs flex">
              {tags.map((tag) => (
                <span
                  key={tag.label}
                  className={cn(
                    "text-micro rounded-[5px] px-xs font-semibold",
                    tagTones[tag.tone ?? "default"],
                  )}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          )
        )}
      </div>
    </Link>
  );
}
