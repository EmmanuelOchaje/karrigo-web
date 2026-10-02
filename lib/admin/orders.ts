import type { Schemas } from "@/lib/api/types";
import { formatKobo, nairaToKobo } from "@/lib/money";
import { ageLabel, whenLabel } from "./format";
import { type OrderStage, type PaymentMethod } from "./types";

/**
 * An order as ops reads it on the board, built from karrigo-be's admin order
 * list. The backend has no notion of "late" or of a rider being "assigned" by
 * hand (riders accept broadcast offers), so those are derived here, in one
 * place, and stated as policy.
 */

type Status = Schemas["AdminOrderListItemDto"]["status"];

/** An order still waiting for a kitchen past this is the 3-minute rule being
 *  broken (CLAUDE.md: kitchens have 3 minutes to accept). */
export const ACCEPT_WINDOW_MINUTES = 3;
/** Past this, any order still in flight is running late. The product has not
 *  fixed a delivery promise yet, so this is ops' working number. */
export const LATE_AFTER_MINUTES = 45;

const STAGE: Record<Status, OrderStage> = {
  PLACED: "waiting",
  ACCEPTED: "accepted",
  PREPARING: "cooking",
  READY: "ready",
  PICKED_UP: "on_the_way",
  DELIVERING: "on_the_way",
  DELIVERED: "delivered",
  CANCELLED: "waiting",
  REFUNDED: "delivered",
};

export type LiveOrder = {
  id: string;
  /** The number said out loud — "KG-2217". */
  code: string;
  status: Status;
  stage: OrderStage;
  cancelled: boolean;
  refunded: boolean;
  late: boolean;
  elapsedMinutes: number;
  placedAt: string;
  placedLabel: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  kitchens: string;
  riderName: string | null;
  payment: PaymentMethod;
  paymentStatus: Schemas["AdminPaymentDto"]["status"] | null;
  totalKobo: number;
};

export function paymentMethodOf(payment: Schemas["AdminPaymentDto"] | undefined): PaymentMethod {
  if (!payment || payment.provider === "CASH") return "cash";
  return payment.channel === "BANK_TRANSFER" ? "transfer" : "card";
}

export function liveOrder(o: Schemas["AdminOrderListItemDto"], now = new Date()): LiveOrder {
  const cancelled = o.status === "CANCELLED";
  const refunded = o.status === "REFUNDED";
  const over = cancelled || refunded || o.status === "DELIVERED";
  const elapsedMinutes = Math.max(
    0,
    Math.floor((now.getTime() - new Date(o.placedAt).getTime()) / 60_000),
  );
  const payment = o.payments[0];

  return {
    id: o.id,
    code: o.code,
    status: o.status,
    stage: STAGE[o.status],
    cancelled,
    refunded,
    late:
      !over &&
      (o.status === "PLACED"
        ? elapsedMinutes > ACCEPT_WINDOW_MINUTES
        : elapsedMinutes > LATE_AFTER_MINUTES),
    elapsedMinutes,
    placedAt: o.placedAt,
    placedLabel: whenLabel(o.placedAt, now),
    customerId: o.customerId,
    customerName: o.customer.name ?? o.customer.phone,
    customerPhone: o.customer.phone,
    kitchens: o.kitchenOrders.map((k) => k.kitchen.name).join(" + ") || "—",
    riderName: o.rider ? (o.rider.user.name ?? o.rider.user.phone) : null,
    payment: paymentMethodOf(payment),
    paymentStatus: payment?.status ?? null,
    totalKobo: nairaToKobo(o.totalNaira),
  };
}

export function isActive(order: LiveOrder): boolean {
  return !order.cancelled && !order.refunded && order.stage !== "delivered";
}

/** No rider on an order that is on or past `ready` — the food is getting cold
 *  while nobody is coming for it. */
export function isUnassigned(order: LiveOrder): boolean {
  return (
    order.riderName === null &&
    isActive(order) &&
    (order.stage === "ready" || order.stage === "on_the_way")
  );
}

export const ORDER_FILTERS = ["active", "late", "delivered", "cancelled", "all"] as const;
export type OrderFilter = (typeof ORDER_FILTERS)[number];

export const ORDER_FILTER_LABEL: Record<OrderFilter, string> = {
  active: "Active",
  late: "Late",
  delivered: "Delivered",
  cancelled: "Cancelled",
  all: "All",
};

export function matchesFilter(order: LiveOrder, filter: OrderFilter): boolean {
  switch (filter) {
    case "active":
      return isActive(order);
    case "late":
      return order.late;
    case "delivered":
      return order.status === "DELIVERED";
    case "cancelled":
      return order.cancelled || order.refunded;
    case "all":
      return true;
  }
}

/** One box for everything ops might have in hand: a number read off a
 *  screenshot, a phone number read out over the line, a kitchen name. */
export function matchesQuery(order: LiveOrder, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [order.code, order.customerName, order.customerPhone, order.kitchens, order.riderName ?? ""]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

/* ---------------------------------------------------------------- detail */

export type OrderDetailView = {
  address: string;
  instructions: string | null;
  items: { name: string; qty: number; unitPriceKobo: number }[];
  subtotalKobo: number;
  feeKobo: number;
  discountKobo: number;
  creditKobo: number;
  tipKobo: number;
  totalKobo: number;
  promoCode: string | null;
  timeline: { label: string; time: string; reached: boolean; current: boolean }[];
  /** Admin actions already taken on it, newest last. */
  log: { event: string; at: string; by: string }[];
  tickets: { id: string; subject: string; status: string }[];
};

export function orderDetailView(o: Schemas["AdminOrderDetailDto"]): OrderDetailView {
  const steps: { label: string; at: string | null }[] = [
    { label: "Placed", at: o.placedAt },
    { label: "Rider at the kitchen", at: o.riderArrivedAtKitchenAt },
    { label: "Picked up", at: o.pickedUpAt },
    { label: "Delivered", at: o.deliveredAt },
  ];
  const lastReached = steps.reduce((last, s, i) => (s.at ? i : last), 0);
  const ended = o.status === "DELIVERED" || o.status === "CANCELLED" || o.status === "REFUNDED";

  return {
    address: `${o.address.line1}, ${o.address.area}`,
    instructions: o.address.instructions ?? null,
    items: o.kitchenOrders.flatMap((k) =>
      k.items.map((i) => ({
        name: i.nameSnapshot,
        qty: i.qty,
        unitPriceKobo: nairaToKobo(i.unitPriceNaira),
      })),
    ),
    subtotalKobo: nairaToKobo(o.subtotalNaira),
    feeKobo: nairaToKobo(o.deliveryFeeNaira),
    discountKobo: nairaToKobo(o.discountNaira),
    creditKobo: nairaToKobo(o.creditAppliedNaira),
    tipKobo: nairaToKobo(o.tipNaira),
    totalKobo: nairaToKobo(o.totalNaira),
    promoCode: o.promoCode ?? null,
    timeline: steps.map((s, i) => ({
      label: s.label,
      time: s.at ? whenLabel(s.at) : "—",
      reached: !!s.at,
      current: !!s.at && i === lastReached && !ended,
    })),
    log: o.timeline.map((t) => ({ event: t.event, at: ageLabel(t.at), by: t.adminName ?? "An admin" })),
    tickets: o.supportTickets.map((t) => ({ id: t.id, subject: t.subject, status: t.status })),
  };
}

export function money(kobo: number): string {
  return formatKobo(kobo);
}
