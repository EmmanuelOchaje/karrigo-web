import "server-only";

import { api } from "@/lib/api/client";
import type { AreaPublic } from "@/lib/api/extra";
import { AREAS } from "@/lib/order/schema";

/**
 * The neighbourhoods ops keeps, with the ids the backend wants. There is no
 * built-in fallback with ids, so a failed load is an empty list and callers
 * that need ids must say so rather than guess.
 */
export async function listAreas(): Promise<{ id: string; name: string }[]> {
  try {
    const areas = await api<AreaPublic[]>("/areas", { revalidate: 300 });
    return areas.filter((a) => a.id && a.name).map((a) => ({ id: a.id, name: a.name }));
  } catch {
    return [];
  }
}

/**
 * The names an address can be in. If the list can't be loaded, or ops hasn't
 * added any yet, the built-in Makurdi list keeps checkout and sign-up working
 * rather than leaving the field empty.
 */
export async function listAreaNames(): Promise<string[]> {
  const names = (await listAreas()).map((a) => a.name);
  return names.length > 0 ? names : [...AREAS];
}
