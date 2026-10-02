"use server";

import { revalidatePath } from "next/cache";

import { ApiError, api } from "@/lib/api/client";
import { requireAdmin } from "@/lib/admin/session";
import type { TicketStatus } from "@/lib/admin/types";

import type { ActionResult } from "./queue-actions";

/** Nothing is sent to the person who filed it — this only moves the ticket
 *  and is recorded in the audit log. Replying is done on WhatsApp. */
export async function moveTicket(
  id: string,
  status: TicketStatus,
  said: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await api(`/admin/support-tickets/${id}`, {
      method: "PATCH",
      scope: "admin",
      body: { status },
    });
    revalidatePath("/admin", "layout");
    return { ok: true, message: said };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "That didn't go through. Try again.",
    };
  }
}
