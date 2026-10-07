import type { Side } from "./types";

/** A place's page. Food is the default; a store's grocery page names its side. */
export function placeHref(slug: string, side: Side = "FOOD"): string {
  return `/k/${slug}${side === "GROCERY" ? "?type=GROCERY" : ""}`;
}
