import "server-only";

import { ApiError, api } from "@/lib/api/client";
import type { VerificationPhoto } from "@/lib/api/extra";

const unavailable = (error: unknown) =>
  error instanceof ApiError &&
  (error.status === 401 ||
    error.status === 403 ||
    (error.status === 409 && error.body.code === "NO_STORE"));

/** The store's own six verification photos. Signed URLs are read for every
 * request and never cached. Staff cannot list them, so their count comes from
 * the store application instead. */
export async function listStoreVerificationPhotos(): Promise<{
  photos: VerificationPhoto[];
  failed: boolean;
}> {
  try {
    const photos = await api<VerificationPhoto[]>("/store-console/store/photos", { scope: "kitchen" });
    return { photos, failed: false };
  } catch (error) {
    if (unavailable(error)) return { photos: [], failed: false };
    console.error("Couldn't load store verification photos", error);
    return { photos: [], failed: true };
  }
}
