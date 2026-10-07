import "server-only";

import { api } from "@/lib/api/client";
import type { AreaPublic } from "@/lib/api/extra";
import { AREAS } from "@/lib/order/schema";

/**
 * The neighbourhoods an address can be in, as ops keeps them. If the list
 * can't be loaded, or ops hasn't added any yet, the built-in Makurdi list
 * keeps checkout and sign-up working rather than leaving the field empty.
 */
export async function listAreaNames(): Promise<string[]> {
  try {
    const areas = await api<AreaPublic[]>("/areas", { revalidate: 300 });
    const names = areas.map((a) => a.name).filter(Boolean);
    if (names.length > 0) return names;
  } catch {
    // Fall through to the built-in list.
  }
  return [...AREAS];
}
