"use server";

import { revalidatePath } from "next/cache";

import { ApiError, api, type Schemas } from "@/lib/api/client";
import { liveOrder, type LiveOrder } from "@/lib/admin/orders";
import { requireAdmin, requireSuperAdmin } from "@/lib/admin/session";

import type { ActionResult } from "./queue-actions";

function message(error: unknown): string {
  return error instanceof ApiError || error instanceof Error
    ? error.message
    : "That didn't go through. Try again.";
}

/** Refund starts from the number the customer reads out, so look it up by
 *  that. The backend matches part of the code; an exact match wins. */
export async function findOrderByCode(
  code: string,
): Promise<{ ok: true; order: LiveOrder | null } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    const wanted = code.trim().toUpperCase();
    if (!wanted) return { ok: true, order: null };
    const page = await api<Schemas["AdminOrderPageDto"]>("/admin/orders", {
      scope: "admin",
      query: { q: wanted, pageSize: 10 },
    });
    const hit = page.items.find((o) => o.code.toUpperCase() === wanted);
    return { ok: true, order: hit ? liveOrder(hit) : null };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}

export async function sweepPushTokens(): Promise<ActionResult> {
  try {
    await requireSuperAdmin();
    const result = await api<Schemas["SweepPushReceiptsResponseDto"]>(
      "/admin/notifications/sweep-push-receipts",
      { method: "POST", scope: "admin" },
    );
    revalidatePath("/admin", "layout");
    return {
      ok: true,
      message: `Checked ${result.checked} · removed ${result.pruned} dead push token${result.pruned === 1 ? "" : "s"}`,
    };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}
