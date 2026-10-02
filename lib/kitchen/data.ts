import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { ApiError, api, type Schemas } from "@/lib/api/client";
import { SCOPES } from "@/lib/api/scopes";
import { nairaToKobo } from "@/lib/money";
import type { DayHours, Earnings, Kitchen, KitchenOrder, Payout, StaffProfile, Ticket } from "./types";

/** Where a live kitchen is run from, and where one that is not live yet
 *  finishes its application. */
export const CONSOLE = "/my-kitchen";
export const APPLICATION = "/partners/kitchen";

const signedOut = (error: unknown) =>
  error instanceof ApiError && (error.status === 401 || error.status === 403);

/**
 * The signed-in staff member's kitchen, or null. One lookup per request, and
 * none at all for the customers who make up nearly every visit: without a
 * kitchen cookie there is nobody to ask about.
 */
export const getKitchen = cache(async (): Promise<Kitchen | null> => {
  const jar = await cookies();
  if (!jar.get(SCOPES.kitchen.access)?.value) return null;

  try {
    const [k, me] = await Promise.all([
      api<Schemas["KitchenWithMenuResponseDto"]>("/kitchen-console/kitchen", { scope: "kitchen" }),
      api<Schemas["AuthenticatedKitchenStaffResponseDto"]>("/kitchen-auth/me", { scope: "kitchen" }),
    ]);
    return {
      name: k.name,
      slug: k.slug,
      status: k.status,
      role: me.staffRole,
      isOpen: k.isOpen,
      notice: k.noticeText ?? "",
      cuisine: k.cuisine ?? "",
      feeKobo: nairaToKobo(k.feeNaira ?? 0),
      sections: [...k.sections]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((s) => ({
          id: s.id,
          label: s.label,
          note: s.note ?? "",
          dishes: [...s.items]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((i) => ({
              id: i.id,
              sectionId: i.sectionId,
              name: i.name,
              description: i.description ?? "",
              priceKobo: nairaToKobo(i.priceNaira),
              imageUrl: i.imageUrl ?? null,
              soldOut: i.isSoldOut,
            })),
        })),
    };
  } catch (error) {
    if (signedOut(error)) return null;
    throw error;
  }
});

/**
 * The guard on every console page (CLAUDE.md rule 3). Nobody signed in goes
 * to the kitchen login; a kitchen ops has not approved goes back to its
 * application, which is the only thing it can usefully do.
 */
export async function requireKitchen(): Promise<Kitchen> {
  const kitchen = await getKitchen();
  if (!kitchen) redirect(`${APPLICATION}/login`);
  if (kitchen.status !== "ACTIVE") redirect(APPLICATION);
  return kitchen;
}

/** Payouts and the kitchen's settings belong to the owner; the backend
 *  refuses staff, and this keeps them from landing on a page of refusals. */
export async function requireOwner(): Promise<Kitchen> {
  const kitchen = await requireKitchen();
  if (kitchen.role !== "OWNER") redirect(CONSOLE);
  return kitchen;
}

/** Every order the kitchen has, oldest first — the order to cook them in.
 *  Cached for the request: the console's layout and the orders page both ask. */
export const listOrders = cache(async (): Promise<KitchenOrder[]> => {
  const orders = await api<Schemas["KitchenOrderWithDetailsResponseDto"][]>("/kitchen-console/orders", {
    scope: "kitchen",
  });
  return orders.map((o) => ({
    id: o.id,
    code: o.order.code,
    status: o.status,
    placedAt: o.order.placedAt,
    area: o.order.address?.area ?? "",
    subtotalKobo: nairaToKobo(o.subtotalNaira),
    items: o.items.map((i) => ({
      id: i.id,
      name: i.nameSnapshot,
      qty: i.qty,
      unitPriceKobo: nairaToKobo(i.unitPriceNaira),
    })),
  }));
});

const DEFAULT_DAY = { closed: false, open: "08:00", close: "21:00" };

/** All seven days, Sunday first. A kitchen that has never set its hours gets
 *  a sensible day to start from rather than seven blanks. */
export async function getHours(): Promise<{ days: DayHours[]; saved: boolean }> {
  const rows = await api<Schemas["KitchenHoursResponseDto"][]>("/kitchen-console/kitchen/hours", {
    scope: "kitchen",
  });
  const days = Array.from({ length: 7 }, (_, day) => {
    const row = rows.find((r) => r.dayOfWeek === day);
    if (!row) return { day, ...DEFAULT_DAY };
    return {
      day,
      closed: row.isClosed,
      // The backend may answer "08:00:00"; a time input wants "08:00".
      open: (row.openTime ?? DEFAULT_DAY.open).slice(0, 5),
      close: (row.closeTime ?? DEFAULT_DAY.close).slice(0, 5),
    };
  });
  return { days, saved: rows.length > 0 };
}

export async function getEarnings(): Promise<Earnings> {
  const e = await api<Schemas["KitchenEarningsSummaryResponseDto"]>("/kitchen-console/kitchen/earnings-summary", {
    scope: "kitchen",
  });
  return {
    commissionRate: e.commissionRate,
    salesKobo: nairaToKobo(e.salesNaira),
    commissionKobo: nairaToKobo(e.commissionNaira),
    nextPayoutKobo: nairaToKobo(e.nextPayoutNaira),
    nextPayoutOrders: e.nextPayoutOrders,
    nextPayoutDaysAway: e.nextPayoutDaysAway,
  };
}

export async function listPayouts(): Promise<Payout[]> {
  const payouts = await api<Schemas["KitchenPayoutResponseDto"][]>("/kitchen-console/kitchen/payouts", {
    scope: "kitchen",
  });
  return payouts.map((p) => ({
    id: p.id,
    amountKobo: nairaToKobo(p.amountNaira),
    status: p.status,
    at: p.settledAt ?? p.createdAt,
    orders: p.kitchenOrdersPaidOut.length,
  }));
}

export async function listTickets(): Promise<Ticket[]> {
  const tickets = await api<Schemas["SupportTicketResponseDto"][]>("/kitchen-console/support-tickets", {
    scope: "kitchen",
  });
  return tickets.map((t) => ({ id: t.id, subject: t.subject, status: t.status, createdAt: t.createdAt }));
}

export async function getStaffProfile(): Promise<StaffProfile> {
  const me = await api<Schemas["KitchenStaffResponseDto"]>("/kitchen-auth/me/profile", { scope: "kitchen" });
  return { name: me.name, email: me.email, phone: me.phone ?? "" };
}
