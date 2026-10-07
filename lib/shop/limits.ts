import { formatKobo } from "@/lib/money";
import type { Side } from "./types";

/**
 * A store's own rules for a grocery order: most items, and a minimum basket.
 * Mirrors karrigo-be's `checkGroceryLimits` so a customer hears about it
 * before pressing Place order; the backend still has the last word. Food
 * orders have no such limits, even from a place that serves both.
 */
export type BasketLimits = {
  side: Side;
  name: string;
  count: number;
  subtotalKobo: number;
  maxItems: number | null;
  minOrderKobo: number | null;
};

export type BasketIssue =
  | { kind: "TOO_MANY"; message: string }
  | { kind: "BELOW_MINIMUM"; message: string; shortfallKobo: number };

export function basketIssue(b: BasketLimits): BasketIssue | null {
  if (b.side !== "GROCERY") return null;
  if (b.maxItems != null && b.count > b.maxItems) {
    return {
      kind: "TOO_MANY",
      message: `${b.name} takes at most ${b.maxItems} items per order. You have ${b.count}.`,
    };
  }
  if (b.minOrderKobo != null && b.minOrderKobo > 0 && b.subtotalKobo < b.minOrderKobo) {
    return {
      kind: "BELOW_MINIMUM",
      message: `${b.name} needs at least ${formatKobo(b.minOrderKobo)} per order. Your items come to ${formatKobo(b.subtotalKobo)}.`,
      shortfallKobo: b.minOrderKobo - b.subtotalKobo,
    };
  }
  return null;
}
