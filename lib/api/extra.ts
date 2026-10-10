/**
 * Shapes for karrigo-be endpoints that are newer than the pinned
 * `api/openapi.json`. Once the spec is regenerated (`bun run api:types`)
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

/**
 * POST /kitchen-auth/otp/request — body `{ phone }`. Replace with
 * `Schemas[...]` once the spec is regenerated.
 *
 * POST /kitchen-auth/register now also requires `phone`, `otpCode` (6 digits)
 * and `areaId` (and no longer takes `area`); its response is unchanged.
 */
export type KitchenOtpRequested = { resendCooldownSeconds: number };

/** What a kitchen still has to do before it can open. */
export type KitchenMissing = "LOCATION" | "RIDER_FEE";

/**
 * Added to GET /kitchen-console/kitchen. `feeNaira` stays on the response as
 * a read-only legacy field; the writable one is `riderBaseFeeNaira`. All
 * optional so an older server still parses. Replace once the spec is
 * regenerated.
 */
export type KitchenReadiness = {
  riderBaseFeeNaira?: number | null;
  missing?: KitchenMissing[];
  verificationPhotoCount?: number;
};

/**
 * Every kitchen payload (public GET /kitchens and /kitchens/:slug, admin
 * GET /admin/kitchens and /admin/kitchens/:id) returns the whole Kitchen row,
 * so it carries the rider base fee. Optional so an older server still parses.
 * Never use the legacy `feeNaira` for display or pricing: it is 0 for new
 * kitchens. Replace once the spec is regenerated.
 */
export type KitchenRiderBaseFee = { riderBaseFeeNaira?: number | null };

/** One kitchen verification photo. `url` is signed and expires, so it is
 *  fetched on each page load and never stored. */
export type VerificationPhoto = { id: string; url: string };

/** GET /admin/kitchens/:id now also carries the photos. Replace once the
 *  spec is regenerated. */
export type AdminKitchenPhotos = { verificationPhotos?: VerificationPhoto[] };

/**
 * GET /kitchen-auth/me (and /store-auth/me) now returns the partner's whole
 * scope: one shared login for a business that has a kitchen, a store, or both.
 * `kitchenId` / `storeId` are null when the business has not registered that
 * side yet. Replace with `Schemas[...]` once the spec is regenerated.
 */
export type PartnerMe = {
  kitchenStaffId: string;
  businessId: string;
  kitchenId: string | null;
  storeId: string | null;
  staffRole: "OWNER" | "STAFF";
};

/**
 * GET /store-console/store: the store row plus what it still needs before it
 * can open. The payout fields are the business's (shared with its kitchen).
 * Replace with `Schemas[...]` once the spec is regenerated.
 */
export type StoreConsoleRow = {
  id: string;
  slug: string;
  name: string;
  area: string | null;
  lat: number | null;
  lng: number | null;
  landmarkNote: string | null;
  heroImageUrl: string | null;
  isOpen: boolean;
  noticeText: string | null;
  riderBaseFeeNaira: number | null;
  minOrderNaira: number | null;
  maxItemsPerOrder: number | null;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  rejectionNote: string | null;
  appealNote: string | null;
  appealedAt: string | null;
  reviewedAt: string | null;
  payoutBankCode: string | null;
  payoutAccountNumber: string | null;
  payoutAccountName: string | null;
  missing: ("LOCATION" | "RIDER_FEE")[];
  verificationPhotoCount: number;
};
