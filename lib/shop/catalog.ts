import "server-only";

import { api, ApiError, type Schemas } from "@/lib/api/client";
import type { KitchenRiderBaseFee } from "@/lib/api/extra";
import { DEFAULT_RIDER_BASE_FEE_NAIRA } from "@/lib/kitchen/types";
import { nairaToKobo } from "@/lib/money";
import type { PricedCart, ShopKitchen, ShopMenu, Side } from "./types";

/** Delivery = rider pay = max(base fee, km x per-km rate), worked out by the
 *  backend when the order is placed. Before then the base fee is the honest
 *  floor. Never the legacy `feeNaira` (0 for every new kitchen). */
function deliveryFromKobo(k: KitchenRiderBaseFee): number {
  const base = k.riderBaseFeeNaira;
  return nairaToKobo(base != null && base > 0 ? base : DEFAULT_RIDER_BASE_FEE_NAIRA);
}

function kitchen(k: Schemas["KitchenResponseDto"] & KitchenRiderBaseFee, side: Side = "FOOD"): ShopKitchen {
  return {
    id: k.id,
    slug: k.slug,
    name: k.name,
    emoji: k.emoji ?? null,
    cuisine: k.cuisine ?? (side === "GROCERY" ? "Groceries" : "Home cooking"),
    area: k.area ?? "Makurdi",
    landmarkNote: k.landmarkNote ?? null,
    imageUrl: k.heroImageUrl ?? null,
    open: k.isOpen,
    notice: k.noticeText ?? null,
    deliveryFromKobo: deliveryFromKobo(k),
    rating: k.ratingAvg,
    ratingsCount: k.ratingsCount,
    minOrderKobo: k.minOrderNaira != null ? nairaToKobo(k.minOrderNaira) : null,
    maxItems: k.maxItemsPerOrder ?? null,
  };
}

/** Every request is live: a kitchen changes a price or sells out and the next
 *  page load shows it (CLAUDE.md rule 5). Nothing here is cached. */
export async function listKitchens(side: Side = "FOOD"): Promise<ShopKitchen[]> {
  const rows = await api<(Schemas["KitchenResponseDto"] & KitchenRiderBaseFee)[]>("/kitchens", { query: { type: side } });
  // Open kitchens first; closed ones stay visible below, never hidden.
  return rows.map((k) => kitchen(k, side)).sort((a, b) => Number(b.open) - Number(a.open) || a.name.localeCompare(b.name));
}

export async function getKitchenMenu(slug: string, side: Side = "FOOD"): Promise<ShopMenu | null> {
  try {
    const k = await api<Schemas["KitchenWithMenuResponseDto"] & KitchenRiderBaseFee>(`/kitchens/${encodeURIComponent(slug)}`, {
      query: { type: side },
    });
    return {
      ...kitchen(k, side),
      side,
      sections: [...k.sections]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((s) => ({
          id: s.id,
          label: s.label,
          note: s.note ?? null,
          dishes: [...s.items]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((i) => ({
              id: i.id,
              name: i.name,
              description: i.description ?? "",
              priceKobo: nairaToKobo(i.priceNaira),
              soldOut: i.isSoldOut,
              imageUrl: i.imageUrl ?? null,
              tags: (i.tags ?? []).map((t) => t.label),
              unit: i.unit ?? "",
            })),
        })),
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/** Prices a cart against the menu as it is right now. Used on cart open and
 *  again at checkout — an item can sell out while sitting in a cart. */
export async function priceLines(
  slug: string,
  lines: Record<string, number>,
  side: Side = "FOOD",
): Promise<PricedCart | null> {
  const menu = await getKitchenMenu(slug, side);
  if (!menu) return null;

  const dishes = new Map(menu.sections.flatMap((s) => s.dishes).map((d) => [d.id, d]));
  const priced: PricedCart["lines"] = [];
  const unavailable: string[] = [];

  for (const [dishId, qty] of Object.entries(lines)) {
    const dish = dishes.get(dishId);
    if (!dish || dish.soldOut) {
      unavailable.push(dish?.name ?? "A dish");
      continue;
    }
    priced.push({ dishId, name: dish.name, qty, unitKobo: dish.priceKobo, lineKobo: dish.priceKobo * qty });
  }

  const subtotalKobo = priced.reduce((sum, l) => sum + l.lineKobo, 0);
  const { sections, side: _side, ...summary } = menu;
  void sections;
  void _side;
  return {
    side,
    kitchen: summary,
    lines: priced,
    unavailable,
    count: priced.reduce((sum, l) => sum + l.qty, 0),
    subtotalKobo,
    deliveryFromKobo: summary.deliveryFromKobo,
    estimatedTotalKobo: subtotalKobo + summary.deliveryFromKobo,
  };
}
