"use server";

import { ApiError, api, type Schemas } from "@/lib/api/client";

export type PublicTrackingResult =
  | { ok: true; tracking: Schemas["PublicTrackingResponseDto"] }
  | { ok: false; expired: boolean };

export async function readPublicTracking(token: string): Promise<PublicTrackingResult> {
  try {
    const tracking = await api<Schemas["PublicTrackingResponseDto"]>(
      `/public/track/${encodeURIComponent(token)}`,
    );
    return { ok: true, tracking };
  } catch (error) {
    return { ok: false, expired: error instanceof ApiError && error.status === 404 };
  }
}
