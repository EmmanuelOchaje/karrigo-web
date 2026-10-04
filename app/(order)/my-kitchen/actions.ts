"use server";

import { revalidatePath } from "next/cache";

import { ApiError, api } from "@/lib/api/client";
import { APPLICATION, CONSOLE } from "@/lib/kitchen/data";
import {
  dishSchema,
  hoursSchema,
  noticeSchema,
  orderStatusSchema,
  passwordSchema,
  profileSchema,
  sectionSchema,
  ticketSchema,
} from "@/lib/kitchen/schema";
import type { DayHours, OrderStatus } from "@/lib/kitchen/types";
import { firstIssue } from "@/lib/order/schema";
import { e164 } from "@/lib/phone";

/**
 * Running a live kitchen: the door, the menu, the orders, the hours. Every
 * call carries the kitchen's own token, and karrigo-be decides what that
 * token may touch — a kitchen can only ever reach its own dishes and orders,
 * and only an owner can change settings (CLAUDE.md rule 3).
 */

type Failure = { ok: false; error: string };
type Done = { ok: true } | Failure;

const OWNER_ONLY = "Only the kitchen's owner can change this. Ask them to log in.";

function failure(error: unknown, messages: Partial<Record<number, string>> = {}): Failure {
  if (error instanceof ApiError) {
    return { ok: false, error: messages[error.status] ?? (error.status === 403 ? OWNER_ONLY : error.message) };
  }
  return { ok: false, error: "That didn't go through. Try again." };
}

/** The console shares its kitchen with the application page, so both go. */
function changed() {
  revalidatePath(CONSOLE, "layout");
  revalidatePath(APPLICATION);
}

const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PHOTO_MAX_BYTES = 2.5 * 1024 * 1024;

const item = (id: string) => `/kitchen-console/menu/items/${encodeURIComponent(id)}`;
const section = (id: string) => `/kitchen-console/menu/sections/${encodeURIComponent(id)}`;

/* ------------------------------------------------------------------ door */

export async function setOpen(isOpen: boolean): Promise<Done> {
  try {
    await api("/kitchen-console/kitchen", { method: "PATCH", scope: "kitchen", body: { isOpen } });
    changed();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function saveNotice(input: string): Promise<Done> {
  const notice = noticeSchema.safeParse(input);
  if (!notice.success) return { ok: false, error: firstIssue(notice.error) };
  try {
    await api("/kitchen-console/kitchen", { method: "PATCH", scope: "kitchen", body: { noticeText: notice.data } });
    changed();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function saveProfile(input: { name: string; cuisine: string; feeNaira: number }): Promise<Done> {
  const profile = profileSchema.safeParse(input);
  if (!profile.success) return { ok: false, error: firstIssue(profile.error) };
  try {
    await api("/kitchen-console/kitchen", { method: "PATCH", scope: "kitchen", body: profile.data });
    changed();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function saveHours(input: DayHours[]): Promise<Done> {
  const days = hoursSchema.safeParse(input);
  if (!days.success) return { ok: false, error: firstIssue(days.error) };
  try {
    await api("/kitchen-console/kitchen/hours", {
      method: "PATCH",
      scope: "kitchen",
      body: {
        days: days.data.map((d) => ({
          dayOfWeek: d.day,
          isClosed: d.closed,
          ...(d.closed ? {} : { openTime: d.open, closeTime: d.close }),
        })),
      },
    });
    changed();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

/* ------------------------------------------------------------------ menu */

export async function addSection(input: { label: string; note: string }): Promise<Done> {
  const parsed = sectionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
  try {
    await api("/kitchen-console/menu/sections", {
      method: "POST",
      scope: "kitchen",
      body: { label: parsed.data.label, ...(parsed.data.note ? { note: parsed.data.note } : {}) },
    });
    changed();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function saveSection(id: string, input: { label: string; note: string }): Promise<Done> {
  const parsed = sectionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
  try {
    await api(section(id), { method: "PATCH", scope: "kitchen", body: parsed.data });
    changed();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function removeSection(id: string): Promise<Done> {
  try {
    await api(section(id), { method: "DELETE", scope: "kitchen" });
    changed();
    return { ok: true };
  } catch (error) {
    return failure(error, { 409: "Move or remove the dishes in this section first — then it can go." });
  }
}

type DishInput = { sectionId: string; name: string; description: string; priceNaira: number };

export async function addDish(input: DishInput): Promise<Done> {
  const dish = dishSchema.safeParse(input);
  if (!dish.success) return { ok: false, error: firstIssue(dish.error) };
  const { description, ...rest } = dish.data;
  try {
    await api("/kitchen-console/menu/items", {
      method: "POST",
      scope: "kitchen",
      body: { ...rest, ...(description ? { description } : {}) },
    });
    changed();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function saveDish(id: string, input: DishInput): Promise<Done> {
  const dish = dishSchema.safeParse(input);
  if (!dish.success) return { ok: false, error: firstIssue(dish.error) };
  try {
    await api(item(id), { method: "PATCH", scope: "kitchen", body: dish.data });
    changed();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function setSoldOut(id: string, isSoldOut: boolean): Promise<Done> {
  try {
    await api(item(id), { method: "PATCH", scope: "kitchen", body: { isSoldOut } });
    changed();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function removeDish(id: string): Promise<Done> {
  try {
    await api(item(id), { method: "DELETE", scope: "kitchen" });
    changed();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function uploadDishPhoto(form: FormData): Promise<Done> {
  const id = String(form.get("id") ?? "");
  const file = form.get("file");
  if (!id) return { ok: false, error: "Unknown dish." };
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose a photo first." };
  if (!PHOTO_TYPES.includes(file.type)) return { ok: false, error: "Use a JPG or PNG photo." };
  if (file.size > PHOTO_MAX_BYTES) return { ok: false, error: "That photo is too large. Try a smaller one." };
  try {
    const body = new FormData();
    body.set("file", file, file.name || "dish.jpg");
    await api(`${item(id)}/image`, { method: "POST", scope: "kitchen", body });
    changed();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

/* ---------------------------------------------------------------- orders */

export async function setOrderStatus(id: string, input: OrderStatus): Promise<Done> {
  const status = orderStatusSchema.safeParse(input);
  if (!status.success) return { ok: false, error: "That isn't a step an order can take." };
  try {
    await api(`/kitchen-console/orders/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      scope: "kitchen",
      body: { status: status.data },
    });
    changed();
    return { ok: true };
  } catch (error) {
    // The order moved on while this screen was showing its old state, no
    // rider has taken it yet, or (moving to PREPARING) the customer hasn't
    // paid. Show the current truth alongside the reason.
    changed();
    if (error instanceof ApiError && error.status === 409 && error.body.code === "AWAITING_PAYMENT") {
      return { ok: false, error: String(error.body.message ?? "Waiting for the customer to pay.") };
    }
    return failure(error, {
      409:
        status.data === "PICKED_UP"
          ? "No rider has taken this order yet. Hand it over once a rider arrives for it."
          : "This order has already moved on. The list has been updated.",
      404: "We can't find that order any more. The list has been updated.",
    });
  }
}

/* --------------------------------------------------------- help, account */

export async function reportProblem(input: { subject: string; body: string }): Promise<Done> {
  const ticket = ticketSchema.safeParse(input);
  if (!ticket.success) return { ok: false, error: firstIssue(ticket.error) };
  try {
    await api("/kitchen-console/support-tickets", {
      method: "POST",
      scope: "kitchen",
      body: { subject: ticket.data.subject, ...(ticket.data.body ? { body: ticket.data.body } : {}) },
    });
    changed();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function saveStaffPhone(input: string): Promise<Done> {
  const phone = e164(input);
  if (!/^\+234\d{10}$/.test(phone)) return { ok: false, error: "Enter an 11-digit phone number, like 0803 123 4567." };
  try {
    await api("/kitchen-auth/me/profile", { method: "PATCH", scope: "kitchen", body: { phone } });
    changed();
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function changePassword(input: { currentPassword: string; newPassword: string }): Promise<Done> {
  const parsed = passwordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
  try {
    await api("/kitchen-auth/password/change", { method: "POST", scope: "kitchen", body: parsed.data });
    return { ok: true };
  } catch (error) {
    return failure(error, { 401: "That isn't your current password. Check it and try again." });
  }
}
