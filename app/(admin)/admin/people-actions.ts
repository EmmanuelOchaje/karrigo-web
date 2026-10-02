"use server";

import { revalidatePath } from "next/cache";

import { ApiError, api, type Schemas } from "@/lib/api/client";
import { requireAdmin, requireSuperAdmin } from "@/lib/admin/session";
import { koboToNaira } from "@/lib/money";

import type { ActionResult } from "./queue-actions";

function fail(error: unknown): ActionResult {
  if (error instanceof ApiError || error instanceof Error) return { ok: false, error: error.message };
  return { ok: false, error: "That didn't go through. Try again." };
}

async function attempt(work: () => Promise<string>, guard = requireAdmin): Promise<ActionResult> {
  try {
    await guard();
    const message = await work();
    revalidatePath("/admin", "layout");
    return { ok: true, message };
  } catch (error) {
    return fail(error);
  }
}

/* ------------------------------------------------------------- customers */

export async function setUserStatus(id: string, status: "ACTIVE" | "SUSPENDED", note: string) {
  return attempt(async () => {
    if (status === "SUSPENDED" && !note) throw new Error("Add a reason — it is saved to the audit log.");
    await api(`/admin/users/${id}/status`, {
      method: "PATCH",
      scope: "admin",
      body: { status, ...(note ? { note } : {}) },
    });
    return status === "SUSPENDED" ? "Account suspended" : "Account reactivated";
  });
}

/* --------------------------------------------------------------- reviews */

export async function setReviewHidden(id: string, isHidden: boolean, note: string) {
  return attempt(async () => {
    await api(`/admin/reviews/${id}`, {
      method: "PATCH",
      scope: "admin",
      body: { isHidden, ...(note ? { note } : {}) },
    });
    return isHidden ? "Review hidden · rating recalculated" : "Review visible again";
  });
}

/* ---------------------------------------------------------------- promos */

export type PromoDraft = {
  code: string;
  description: string;
  discountType: "PERCENT" | "FIXED";
  /** A percentage, or kobo for a fixed discount. */
  value: number;
  maxUses: number | null;
  minSubtotalKobo: number | null;
  expiresAt: string | null;
};

export async function createPromo(draft: PromoDraft) {
  return attempt(async () => {
    const promo = await api<Schemas["AdminPromoCodeDto"]>("/admin/promo-codes", {
      method: "POST",
      scope: "admin",
      body: {
        code: draft.code.trim().toUpperCase(),
        ...(draft.description.trim() ? { description: draft.description.trim() } : {}),
        discountType: draft.discountType,
        value: draft.discountType === "FIXED" ? koboToNaira(draft.value) : draft.value,
        ...(draft.maxUses ? { maxUses: draft.maxUses } : {}),
        ...(draft.minSubtotalKobo ? { minSubtotalNaira: koboToNaira(draft.minSubtotalKobo) } : {}),
        ...(draft.expiresAt ? { expiresAt: new Date(draft.expiresAt).toISOString() } : {}),
      },
    });
    return `${promo.code} is live`;
  }, requireSuperAdmin);
}

export async function setPromoActive(id: string, active: boolean) {
  return attempt(async () => {
    await api(`/admin/promo-codes/${id}`, { method: "PATCH", scope: "admin", body: { active } });
    return active ? "Promo reactivated" : "Promo switched off";
  }, requireSuperAdmin);
}

/* ------------------------------------------------------------------ team */

export async function inviteAdmin(input: {
  name: string;
  email: string;
  adminRole: "SUPER_ADMIN" | "MODERATOR";
}): Promise<{ ok: true; temporaryPassword: string; name: string } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const issued = await api<Schemas["AdminCredentialsIssuedDto"]>("/admin/admins", {
      method: "POST",
      scope: "admin",
      body: { name: input.name.trim(), email: input.email.trim(), adminRole: input.adminRole },
    });
    revalidatePath("/admin", "layout");
    return { ok: true, temporaryPassword: issued.temporaryPassword, name: issued.admin.name };
  } catch (error) {
    const f = fail(error);
    return { ok: false, error: f.ok ? "" : f.error };
  }
}

export async function updateAdmin(
  id: string,
  patch: { status?: "ACTIVE" | "REVOKED"; adminRole?: "SUPER_ADMIN" | "MODERATOR" },
) {
  return attempt(async () => {
    await api(`/admin/admins/${id}`, { method: "PATCH", scope: "admin", body: patch });
    if (patch.status === "REVOKED") return "Access revoked · signed out everywhere";
    if (patch.status === "ACTIVE") return "Access restored";
    return patch.adminRole === "SUPER_ADMIN" ? "Now a super admin" : "Now a moderator";
  }, requireSuperAdmin);
}

export async function resetAdminPassword(
  id: string,
): Promise<{ ok: true; temporaryPassword: string } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const issued = await api<Schemas["AdminCredentialsIssuedDto"]>(`/admin/admins/${id}/reset-password`, {
      method: "POST",
      scope: "admin",
    });
    revalidatePath("/admin", "layout");
    return { ok: true, temporaryPassword: issued.temporaryPassword };
  } catch (error) {
    const f = fail(error);
    return { ok: false, error: f.ok ? "" : f.error };
  }
}
