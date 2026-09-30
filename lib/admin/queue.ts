/**
 * Kitchens and riders are the same job: someone applied, ops checks their
 * paperwork, approves or rejects them with a reason, and later settles what
 * they are owed. One shape describes both, so there is one review screen and
 * one set of rules about what can be done from which state.
 */

import { formatKobo } from "@/lib/money";
import { KITCHENS, RIDERS } from "./fixtures";
import type {
  Kitchen,
  KitchenStatus,
  Rider,
  RiderStatus,
} from "./types";

export type QueueKind = "kitchens" | "riders";
export type QueueStatus = KitchenStatus | RiderStatus;

export type QueueCheck = {
  label: string;
  ok: boolean;
  /** An uploaded file ops can open, rather than a fact we hold. */
  document?: boolean;
};

export type QueueItem = {
  id: string;
  title: string;
  /** The one line under the name on the row. */
  sub: string;
  status: QueueStatus;
  when: string;
  /** Why they were rejected or suspended. They see this. */
  note: string | null;
  fields: { key: string; value: string }[];
  checks: QueueCheck[];
  /** Owed to them, before anything is netted off. */
  unpaidKobo: number;
  /** Rider only: cash they already hold from cash-on-delivery orders. */
  cashHeldKobo: number;
};

/** What actually leaves our account. A rider has already been paid part of
 *  what they are owed, in cash, by customers at the gate. */
export function payoutKobo(item: QueueItem): number {
  return Math.max(0, item.unpaidKobo - item.cashHeldKobo);
}

export const QUEUE_TABS: Record<QueueKind, { status: QueueStatus; label: string }[]> =
  {
    kitchens: [
      { status: "PENDING", label: "Waiting for approval" },
      { status: "ACTIVE", label: "Live" },
      { status: "SUSPENDED", label: "Suspended" },
    ],
    riders: [
      { status: "PENDING", label: "Waiting for review" },
      { status: "APPROVED", label: "Approved" },
      { status: "REJECTED", label: "Rejected" },
    ],
  };

export const QUEUE_STATUS_LABEL: Record<QueueStatus, string> = {
  PENDING: "Pending",
  ACTIVE: "Live",
  SUSPENDED: "Suspended",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

function kitchenItem(kitchen: Kitchen): QueueItem {
  return {
    id: kitchen.id,
    title: kitchen.name,
    sub: `${kitchen.owner} · ${kitchen.area} · ${kitchen.cuisine}`,
    status: kitchen.status,
    when: kitchen.submitted,
    note: kitchen.note,
    fields: [
      { key: "Owner", value: kitchen.owner },
      { key: "Email", value: kitchen.email },
      { key: "Phone", value: kitchen.phone },
      { key: "Area", value: kitchen.area },
      { key: "Cuisine", value: kitchen.cuisine },
      { key: "Signed up", value: kitchen.submitted },
    ],
    checks: [
      { label: "Location pinned on the map", ok: kitchen.locationPinned },
      { label: "Payout bank account confirmed", ok: kitchen.bankConfirmed },
      {
        label: kitchen.menuItems
          ? `${kitchen.menuItems} dishes on the menu`
          : "No dishes yet",
        ok: kitchen.menuItems > 0,
      },
    ],
    unpaidKobo: kitchen.unpaidKobo,
    cashHeldKobo: 0,
  };
}

function riderItem(rider: Rider): QueueItem {
  return {
    id: rider.id,
    title: rider.name,
    sub: `${rider.vehicle} · ${rider.plate} · ${rider.area}`,
    status: rider.status,
    when: rider.submitted,
    note: rider.note,
    fields: [
      { key: "Phone", value: rider.phone },
      { key: "Vehicle", value: rider.vehicle },
      { key: "Plate", value: rider.plate },
      { key: "Area", value: rider.area },
      { key: "Applied", value: rider.submitted },
    ],
    checks: [
      { label: "Driver's licence", ok: rider.documents.licence, document: true },
      { label: "Government ID", ok: rider.documents.governmentId, document: true },
      {
        label: "Vehicle papers",
        ok: rider.documents.vehiclePapers,
        document: true,
      },
      { label: "Guarantor details", ok: rider.documents.guarantor },
      { label: "Payout bank account", ok: rider.documents.bankAccount },
    ],
    unpaidKobo: rider.unpaidKobo,
    cashHeldKobo: rider.cashHeldKobo,
  };
}

/**
 * The queue with this sitting's decisions folded in: a status ops has changed,
 * a note they typed, a balance they have settled.
 */
export function queueItems(
  kind: QueueKind,
  overrides: {
    status: Record<string, QueueStatus>;
    notes: Record<string, string>;
    paid: Record<string, true>;
  },
): QueueItem[] {
  const base =
    kind === "kitchens" ? KITCHENS.map(kitchenItem) : RIDERS.map(riderItem);

  return base.map((item) => ({
    ...item,
    status: overrides.status[item.id] ?? item.status,
    note: overrides.notes[item.id] ?? item.note,
    unpaidKobo: overrides.paid[item.id] ? 0 : item.unpaidKobo,
    cashHeldKobo: overrides.paid[item.id] ? 0 : item.cashHeldKobo,
  }));
}

/** The money line added to the detail panel once there is a balance. */
export function balanceFields(
  kind: QueueKind,
  item: QueueItem,
): { key: string; value: string }[] {
  if (!item.unpaidKobo) return [];
  if (kind === "kitchens") {
    return [
      { key: "Unpaid sales (after 15%)", value: formatKobo(item.unpaidKobo) },
    ];
  }
  return [
    { key: "Unpaid trip pay", value: formatKobo(item.unpaidKobo) },
    { key: "Cash held from COD", value: formatKobo(item.cashHeldKobo) },
  ];
}
