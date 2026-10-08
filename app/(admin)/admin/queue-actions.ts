"use server";

import { revalidatePath } from "next/cache";

import { ApiError, api, type Schemas } from "@/lib/api/client";
import type { AdminKitchenPhotos, VerificationPhoto } from "@/lib/api/extra";
import { VERIFICATION_PHOTOS_REQUIRED, photosNeededText } from "@/lib/kitchen/types";
import { requireAdmin, requireSuperAdmin } from "@/lib/admin/session";
import { formatKobo, nairaToKobo } from "@/lib/money";

export type ActionResult = { ok: true; message: string } | { ok: false; error: string };

function fail(error: unknown): ActionResult {
  if (error instanceof ApiError) return { ok: false, error: error.message };
  if (error instanceof Error) return { ok: false, error: error.message };
  return { ok: false, error: "That didn't go through. Try again." };
}

function refresh() {
  revalidatePath("/admin", "layout");
}

export async function setKitchenStatus(
  id: string,
  status: "ACTIVE" | "SUSPENDED",
  note: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const kitchen = await api<Schemas["KitchenResponseDto"]>(`/admin/kitchens/${id}/status`, {
      method: "PATCH",
      scope: "admin",
      body: { status, ...(note ? { note } : {}) },
    });
    refresh();
    return {
      ok: true,
      message: status === "ACTIVE" ? `${kitchen.name} is live` : `${kitchen.name} suspended`,
    };
  } catch (error) {
    // Approving needs all the kitchen photos. The button is disabled before
    // this happens, so this is only a stale screen; say the same thing.
    if (error instanceof ApiError && error.status === 422 && error.body.code === "VERIFICATION_PHOTOS_REQUIRED") {
      const details = (error.body.details ?? {}) as { required?: number; have?: number };
      return {
        ok: false,
        error: photosNeededText(details.have ?? 0, details.required ?? VERIFICATION_PHOTOS_REQUIRED),
      };
    }
    return fail(error);
  }
}

export async function setRiderVerification(
  id: string,
  status: "APPROVED" | "REJECTED",
  note: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (status === "REJECTED" && !note.trim()) {
      return { ok: false, error: "Add a reason — the rider sees it." };
    }
    await api(`/admin/riders/${id}/verification`, {
      method: "PATCH",
      scope: "admin",
      body: { status, ...(note ? { note } : {}) },
    });
    refresh();
    return { ok: true, message: status === "APPROVED" ? "Rider approved" : "Rider rejected" };
  } catch (error) {
    return fail(error);
  }
}

/** Moves real money. Super admin only, checked here and not by the button. */
export async function payOut(kind: "kitchens" | "riders", id: string): Promise<ActionResult> {
  try {
    await requireSuperAdmin();
    const result = await api<Schemas["KitchenPayoutResultResponseDto"]>(
      `/admin/${kind}/${id}/payout`,
      { method: "POST", scope: "admin" },
    );
    refresh();
    return { ok: true, message: `${formatKobo(nairaToKobo(result.amountNaira))} sent` };
  } catch (error) {
    return fail(error);
  }
}

/** Identity documents. Signed URLs are short-lived, so they are fetched when
 *  someone clicks View and never kept. */
export async function riderDocumentUrl(
  id: string,
  which: "license" | "id" | "vehicleReg",
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    const urls = await api<Schemas["RiderDocumentUrlsResponseDto"]>(
      `/admin/riders/${id}/documents`,
      { scope: "admin" },
    );
    const url = { license: urls.licenseDocUrl, id: urls.idDocUrl, vehicleReg: urls.vehicleRegDocUrl }[which];
    return url ? { ok: true, url } : { ok: false, error: "That document hasn't been uploaded." };
  } catch (error) {
    const result = fail(error);
    return { ok: false, error: result.ok ? "" : result.error };
  }
}

/** What the list does not carry: the owner's login and how many dishes there
 *  are. Fetched when a kitchen is opened. */
export async function kitchenDetail(id: string): Promise<
  | { ok: true; fields: { key: string; value: string }[]; menuItems: number; photos: VerificationPhoto[] }
  | { ok: false; error: string }
> {
  try {
    await requireAdmin();
    const k = await api<Schemas["AdminKitchenDetailDto"] & AdminKitchenPhotos>(`/admin/kitchens/${id}`, {
      scope: "admin",
    });
    const owner = k.staff.find((s) => s.staffRole === "OWNER") ?? k.staff[0];
    return {
      ok: true,
      menuItems: k.stats.menuItemCount,
      // Signed URLs that expire: fetched when the kitchen is opened, never kept.
      photos: k.verificationPhotos ?? [],
      fields: owner
        ? [
            { key: "Owner", value: owner.name },
            { key: "Email", value: owner.email },
            { key: "Phone", value: owner.phone ?? "—" },
          ]
        : [],
    };
  } catch (error) {
    const result = fail(error);
    return { ok: false, error: result.ok ? "" : result.error };
  }
}
