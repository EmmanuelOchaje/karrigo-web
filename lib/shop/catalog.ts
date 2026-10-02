import "server-only";

import { api, ApiError, type Schemas } from "@/lib/api/client";
import { nairaToKobo } from "@/lib/money";
import type { PricedCart, ShopKitchen, ShopMenu } from "./types";

function kitchen(k: Schemas["KitchenResponseDto"]): ShopKitchen {
  return {
    id: k.id,
    slug: k.slug,
    name: k.name,
    emoji: k.emoji ?? null,
    cuisine: k.cuisine ?? "Home cooking",
    area: k.area ?? "Makurdi",
    landmarkNote: k.landmarkNote ?? null,
    imageUrl: k.heroImageUrl ?? null,
    open: k.isOpen,
    notice: k.noticeText ?? null,
    feeKobo: nairaToKobo(k.feeNaira),
    rating: k.ratingAvg,
    ratingsCount: k.ratingsCount,
  };
}

/** Every request is live: a kitchen changes a price or sells out and the next
 *  page load shows it (CLAUDE.md rule 5). Nothing here is cached. */
export async function listKitchens(): Promise<ShopKitchen[]> {
  const rows = await api<Schemas["KitchenResponseDto"][]>("/kitchens");
  // Open kitchens first; closed ones stay visible below, never hidden.
  return rows.map(kitchen).sort((a, b) => Number(b.open) - Number(a.open) || a.name.localeCompare(b.name));
}

export async function getKitchenMenu(slug: string): Promise<ShopMenu | null> {
  try {
    const k = await api<Schemas["KitchenWithMenuResponseDto"]>(`/kitchens/${encodeURIComponent(slug)}`);
    return {
      ...kitchen(k),
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
): Promise<PricedCart | null> {
  const menu = await getKitchenMenu(slug);
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
  const { sections, ...summary } = menu;
  void sections;
  return {
    kitchen: summary,
    lines: priced,
    unavailable,
    count: priced.reduce((sum, l) => sum + l.qty, 0),
    subtotalKobo,
    feeKobo: summary.feeKobo,
    totalKobo: subtotalKobo + summary.feeKobo,
  };
}
