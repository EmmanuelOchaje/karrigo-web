/**
 * Shapes for karrigo-be endpoints that are newer than the pinned
 * `api/openapi.json`. Once the spec is regenerated (`npm run api:types`)
 * against a backend that has them, replace these with `Schemas[...]`.
 */

/** GET /areas — the neighbourhoods the address picker offers. */
export type AreaPublic = {
  id: string;
  name: string;
  slug: string;
  lat: number | null;
  lng: number | null;
};

/** GET /admin/areas — including archived ones. */
export type AdminArea = AreaPublic & {
  city: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
};

/** GET /admin/flagged-items. */
export type FlaggedItem = {
  itemId: string;
  itemName: string;
  kitchenId: string;
  kitchenName: string;
  flaggedAt: string;
  flagNote: string | null;
  flagAppealNote: string | null;
  flagAppealedAt: string | null;
};
