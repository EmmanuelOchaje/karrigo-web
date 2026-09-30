"use client";

import { useSyncExternalStore } from "react";

import { ORDERS } from "./fixtures";
import type {
  KitchenStatus,
  Order,
  RiderStatus,
  TicketStatus,
} from "./types";

/**
 * What ops has done during this sitting, kept in the browser until the API
 * lands. Every field here becomes a server mutation with an audit-log entry
 * (BUILD-ORDER M9) — the names are the actions, so that swap is mechanical.
 *
 * Deliberately not persisted. A payout marked sent should not still look sent
 * after a refresh when no money actually moved; losing it on reload is the
 * honest behaviour while this is a fixture.
 */

type OpsState = {
  toast: string;
  /** Attention rows already dealt with. */
  resolvedAttention: Record<string, true>;
  creditedOrders: Record<string, true>;
  cancelledOrders: Record<string, true>;
  /** Order id -> rider assigned by hand from the board. */
  riderAssignments: Record<string, string>;
  kitchenStatus: Record<string, KitchenStatus>;
  riderStatus: Record<string, RiderStatus>;
  /** The reason typed when rejecting or suspending. The applicant sees it. */
  reviewNotes: Record<string, string>;
  /** Kitchen or rider id whose balance has been settled. */
  paidOut: Record<string, true>;
  ticketStatus: Record<string, TicketStatus>;
  refundedOrders: Record<string, true>;
  pushSwept: boolean;
};

const empty: OpsState = {
  toast: "",
  resolvedAttention: {},
  creditedOrders: {},
  cancelledOrders: {},
  riderAssignments: {},
  kitchenStatus: {},
  riderStatus: {},
  reviewNotes: {},
  paidOut: {},
  ticketStatus: {},
  refundedOrders: {},
  pushSwept: false,
};

let state: OpsState = empty;
const listeners = new Set<() => void>();
let toastTimer: ReturnType<typeof setTimeout> | undefined;

function set(patch: Partial<OpsState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOps(): OpsState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => empty,
  );
}

/** A short confirmation of something that just happened. Ops acts fast and
 *  needs to know the click landed without reading the board again. */
export function say(toast: string) {
  set({ toast });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => set({ toast: "" }), 2600);
}

/* ---------------------------------------------------------------- orders */

export function assignRider(orderId: string, rider: string) {
  set({ riderAssignments: { ...state.riderAssignments, [orderId]: rider } });
  say(`${rider} assigned to ${orderId}`);
}

export function giveLateCredit(orderId: string, customerFirstName: string) {
  set({ creditedOrders: { ...state.creditedOrders, [orderId]: true } });
  say(`₦500 credit sent to ${customerFirstName}`);
}

export function cancelOrder(orderId: string, total: string) {
  set({ cancelledOrders: { ...state.cancelledOrders, [orderId]: true } });
  say(`${orderId} cancelled · ${total} refunded`);
}

export function refundOrder(orderId: string, total: string) {
  set({ refundedOrders: { ...state.refundedOrders, [orderId]: true } });
  say(`${orderId} refunded · ${total}`);
}

/** The fixtures with this sitting's changes folded in. Pages read this rather
 *  than ORDERS so an assignment made on the overview shows on the board. */
export function applyOrderOverrides(ops: OpsState): Order[] {
  return ORDERS.map((order) => {
    const rider = ops.riderAssignments[order.id] ?? order.riderName;
    const cancelled = order.cancelled || !!ops.cancelledOrders[order.id];
    return {
      ...order,
      riderName: rider,
      cancelled,
      // A cancelled order is not late; it is over.
      late: order.late && !cancelled,
    };
  });
}

/* ------------------------------------------------------------- attention */

export function resolveAttention(
  id: string,
  doneLabel: string,
  effect?: { creditOrder?: string; assignRider?: { orderId: string; rider: string } },
) {
  set({
    resolvedAttention: { ...state.resolvedAttention, [id]: true },
    creditedOrders: effect?.creditOrder
      ? { ...state.creditedOrders, [effect.creditOrder]: true }
      : state.creditedOrders,
    riderAssignments: effect?.assignRider
      ? {
          ...state.riderAssignments,
          [effect.assignRider.orderId]: effect.assignRider.rider,
        }
      : state.riderAssignments,
  });
  say(doneLabel);
}

/* -------------------------------------------------- approvals and payouts */

export function setKitchenStatus(
  id: string,
  status: KitchenStatus,
  note: string,
  message: string,
) {
  set({
    kitchenStatus: { ...state.kitchenStatus, [id]: status },
    reviewNotes: note ? { ...state.reviewNotes, [id]: note } : state.reviewNotes,
  });
  say(message);
}

export function setRiderStatus(
  id: string,
  status: RiderStatus,
  note: string,
  message: string,
) {
  set({
    riderStatus: { ...state.riderStatus, [id]: status },
    reviewNotes: note ? { ...state.reviewNotes, [id]: note } : state.reviewNotes,
  });
  say(message);
}

export function markPaidOut(id: string, amount: string, name: string) {
  set({ paidOut: { ...state.paidOut, [id]: true } });
  say(`${amount} sent to ${name}`);
}

/* --------------------------------------------------------------- tickets */

export function setTicketStatus(
  id: string,
  status: TicketStatus,
  message: string,
) {
  set({ ticketStatus: { ...state.ticketStatus, [id]: status } });
  say(message);
}

/* ----------------------------------------------------------------- other */

export function sweepPushTokens(count: number) {
  set({ pushSwept: true });
  say(`Removed ${count} dead push tokens`);
}
