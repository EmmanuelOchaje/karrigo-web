import "server-only";

import { api, type Schemas } from "@/lib/api/client";

/** Real platform totals for landing-page surfaces. A stats outage must never
 * take the storefront down, so callers can simply omit the panel on null. */
export async function getPublicStats(): Promise<Schemas["PublicStatsResponseDto"] | null> {
  try {
    return await api<Schemas["PublicStatsResponseDto"]>("/public/stats", {
      revalidate: 3600,
    });
  } catch {
    return null;
  }
}
