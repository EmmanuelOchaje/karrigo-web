"use server";

import { revalidatePath } from "next/cache";

import { ApiError, api, type Schemas } from "@/lib/api/client";
import { orderDetailView, type OrderDetailView } from "@/lib/admin/orders";
import { requireAdmin, requireSuperAdmin } from "@/lib/admin/session";
import { formatKobo, koboToNaira } from "@/lib/money";

import type { ActionResult } from "./queue-actions";

function fail(error: unknown): ActionResult {
  if (error instanceof ApiError || error instanceof Error) {
    return { ok: false, error: error.message };
  }
  return { ok: false, error: "That didn't go through. Try again." };
}

export async function loadOrderDetail(
  id: string,
): Promise<{ ok: true; detail: OrderDetailView } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    const order = await api<Schemas["AdminOrderDetailDto"]>(`/admin/orders/${id}`, {
      scope: "admin",
    });
    return { ok: true, detail: orderDetailView(order) };
  } catch (error) {
    const result = fail(error);
    return { ok: false, error: result.ok ? "" : result.error };
  }
}

/** Reverses the Paystack charge and records the refund. Money, so super admin
 *  only, and checked here rather than by hiding the button. */
export async function refundOrder(id: string, note: string): Promise<ActionResult> {
  try {
    await requireSuperAdmin();
    await api(`/admin/orders/${id}/refund`, {
      method: "POST",
      scope: "admin",
      body: note.trim() ? { note: note.trim() } : {},
    });
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Order refunded" };
  } catch (error) {
    return fail(error);
  }
}

/** Store credit, applied in full at the customer's next checkout. */
export async function giveCredit(
  customerId: string,
  amountKobo: number,
  note: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await api(`/admin/users/${customerId}/credit`, {
      method: "POST",
      scope: "admin",
      body: { amountNaira: koboToNaira(amountKobo), ...(note ? { note } : {}) },
    });
    revalidatePath("/admin", "layout");
    return { ok: true, message: `${formatKobo(amountKobo)} credit sent` };
  } catch (error) {
    return fail(error);
  }
}
