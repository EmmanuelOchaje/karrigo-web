/**
 * Everything the ops screens compute from the raw records. Kept out of the
 * components so the arithmetic — money especially — is testable and stated
 * once, and so swapping fixtures for queries touches nothing here.
 */

import { formatKobo } from "@/lib/money";
import {
  DELIVERY_FEE_KOBO,
  LATE_CREDIT_KOBO,
  SHIFT_NOW,
  STAGE_OFFSETS,
} from "./fixtures";
import {
  ORDER_STAGES,
  STAGE_LABEL,
  type Order,
  type OrderItem,
  type OrderStage,
} from "./types";

/** 872 -> "14:32". Minutes past midnight, 24-hour, as the shift is spoken. */
export function formatClock(minutesPastMidnight: number): string {
  const m = ((minutesPastMidnight % 1440) + 1440) % 1440;
  const hh = String(Math.floor(m / 60)).padStart(2, "0");
  const mm = String(m % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function stageIndex(stage: OrderStage): number {
  return ORDER_STAGES.indexOf(stage);
}

/** A cancelled order is not "on the way" however far it got — ops needs one
 *  word for it, and it is not a stage. */
export function isActive(order: Order): boolean {
  return !order.cancelled && order.stage !== "delivered";
}

/** No rider on an order still in flight. The thing that most often needs a
 *  human: the food is getting cold while nobody is coming for it. */
export function isUnassigned(order: Order): boolean {
  return order.riderName === null && isActive(order);
}

export function deliveryFeeKobo(area: string): number {
  // An area with no band is a gap in the fee table, not a free delivery.
  return DELIVERY_FEE_KOBO[area] ?? 80000;
}

/** One line of an order: two zobo at ₦400 is ₦800. */
export function lineTotal(item: OrderItem): string {
  return formatKobo(item.qty * item.unitPriceKobo);
}

export type OrderTotals = {
  subtotalKobo: number;
  feeKobo: number;
  creditKobo: number;
  totalKobo: number;
  subtotal: string;
  fee: string;
  /** Null when no credit was given, so the row can be left out entirely. */
  credit: string | null;
  total: string;
};

export function orderTotals(order: Order, credited = false): OrderTotals {
  const subtotalKobo = order.items.reduce(
    (sum, item) => sum + item.qty * item.unitPriceKobo,
    0,
  );
  const feeKobo = deliveryFeeKobo(order.area);
  const creditKobo = credited ? LATE_CREDIT_KOBO : 0;
  const totalKobo = subtotalKobo + feeKobo - creditKobo;

  return {
    subtotalKobo,
    feeKobo,
    creditKobo,
    totalKobo,
    subtotal: formatKobo(subtotalKobo),
    fee: formatKobo(feeKobo),
    credit: creditKobo ? `−${formatKobo(creditKobo)}` : null,
    total: formatKobo(totalKobo),
  };
}

export function placedAt(order: Order): string {
  return formatClock(SHIFT_NOW - order.elapsedMinutes);
}

export type TimelineStep = {
  label: string;
  /** The clock time it happened, or "—" if it has not. */
  time: string;
  reached: boolean;
  /** The stage the order is sitting in right now. */
  current: boolean;
};

/**
 * The six stages with the time each was reached, worked backwards from how
 * long ago the order was placed. A cancelled order keeps only the moment it
 * came in — everything after it did not happen.
 */
export function orderTimeline(order: Order): TimelineStep[] {
  const reachedThrough = stageIndex(order.stage);
  const placed = SHIFT_NOW - order.elapsedMinutes;

  return ORDER_STAGES.map((stage, i) => {
    const reached = !order.cancelled && i <= reachedThrough;
    const time = reached
      ? formatClock(placed + STAGE_OFFSETS[i])
      : order.cancelled && i === 0
        ? formatClock(placed)
        : "—";

    return {
      label: STAGE_LABEL[stage],
      time,
      reached,
      current: reached && i === reachedThrough && order.stage !== "delivered",
    };
  });
}

/** How long it has been running, or how long it took. */
export function elapsedLabel(order: Order): string {
  if (order.stage === "delivered" && !order.cancelled) {
    const doorToDoor = STAGE_OFFSETS[STAGE_OFFSETS.length - 1] - STAGE_OFFSETS[0];
    return `${doorToDoor}–${order.elapsedMinutes} min`;
  }
  return `${order.elapsedMinutes} min`;
}

/* --------------------------------------------------------------- filters */

export const ORDER_FILTERS = [
  "active",
  "late",
  "delivered",
  "cancelled",
  "all",
] as const;

export type OrderFilter = (typeof ORDER_FILTERS)[number];

export const ORDER_FILTER_LABEL: Record<OrderFilter, string> = {
  active: "Active",
  late: "Late",
  delivered: "Delivered",
  cancelled: "Cancelled",
  all: "All",
};

export function matchesFilter(order: Order, filter: OrderFilter): boolean {
  switch (filter) {
    case "active":
      return isActive(order);
    case "late":
      return order.late && !order.cancelled;
    case "delivered":
      return !order.cancelled && order.stage === "delivered";
    case "cancelled":
      return order.cancelled;
    case "all":
      return true;
  }
}

/** One box searching everything ops might have to hand: a number read off a
 *  screenshot, a phone number read out over the line, a kitchen name. */
export function matchesQuery(order: Order, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [
    order.id,
    order.customerName,
    order.kitchen,
    order.riderName ?? "",
    order.area,
    order.customerPhone,
  ]
    .join(" ")
    .toLowerCase()
    .includes(q);
}
