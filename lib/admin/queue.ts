/**
 * Kitchens and riders are the same job: someone applied, ops checks their
 * paperwork, approves or rejects them with a reason, and later settles what
 * they are owed. One shape describes both, so there is one review screen and
 * one set of rules about what can be done from which state.
 */

import type { Schemas } from "@/lib/api/types";
import { formatKobo, nairaToKobo } from "@/lib/money";
import { whenLabel } from "./format";
import type { KitchenStatus, RiderStatus } from "./types";

export type QueueKind = "kitchens" | "riders";
export type QueueStatus = KitchenStatus | RiderStatus;

export type QueueCheck = {
  label: string;
  ok: boolean;
  /** An uploaded file ops can open, rather than a fact we hold. Names which
   *  one, so the viewer can ask for just that signed URL. */
  document?: "license" | "id" | "vehicleReg";
};

export type QueueItem = {
  id: string;
  title: string;
  /** The one line under the name on the row. */
  sub: string;
  status: QueueStatus;
  when: string;
  /** ISO, for ordering — the queue is oldest first. */
  createdAt: string;
  /** Why they were rejected or suspended. They see this. */
  note: string | null;
  fields: { key: string; value: string }[];
  checks: QueueCheck[];
  /** Owed to them, before anything is netted off. */
  unpaidKobo: number;
  /** What a payout would send, as the backend computes it — never worked out
   *  here, so this screen cannot disagree with the transfer. */
  netKobo: number;
  /** Rider only: cash they already hold from cash-on-delivery orders. */
  cashHeldKobo: number;
  /** False when there is no confirmed bank account to send to. */
  payable: boolean;
};

/** What actually leaves our account. A rider has already been paid part of
 *  what they are owed, in cash, by customers at the gate. */
export function payoutKobo(item: QueueItem): number {
  return item.netKobo;
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

export function kitchenItem(
  kitchen: Schemas["KitchenResponseDto"],
  due?: Schemas["KitchenPayoutDueDto"],
): QueueItem {
  const netKobo = due ? nairaToKobo(due.netNaira) : 0;
  const area = kitchen.area ?? "—";
  const cuisine = kitchen.cuisine ?? "—";
  return {
    id: kitchen.id,
    title: kitchen.name,
    sub: `${area} · ${cuisine}`,
    status: kitchen.status,
    when: whenLabel(kitchen.createdAt),
    createdAt: kitchen.createdAt,
    note: kitchen.rejectionNote ?? null,
    fields: [
      { key: "Area", value: area },
      { key: "Cuisine", value: cuisine },
      { key: "Signed up", value: whenLabel(kitchen.createdAt) },
      { key: "Delivery fee", value: formatKobo(nairaToKobo(kitchen.feeNaira)) },
    ],
    checks: [
      { label: "Location pinned on the map", ok: kitchen.lat != null && kitchen.lng != null },
      { label: "Payout bank account confirmed", ok: !!kitchen.payoutAccountName },
    ],
    unpaidKobo: netKobo,
    netKobo,
    cashHeldKobo: 0,
    payable: !!due?.hasPayoutAccount,
  };
}

export function riderItem(
  rider: Schemas["AdminRiderListItemDto"],
  due?: Schemas["RiderPayoutDueDto"],
): QueueItem {
  const vehicle = rider.vehicleType ?? "—";
  const plate = rider.plateNumber ?? "—";
  return {
    id: rider.id,
    title: rider.user.name ?? rider.user.phone,
    sub: `${vehicle} · ${plate}`,
    status: rider.verificationStatus,
    when: whenLabel(rider.documentsSubmittedAt ?? rider.createdAt),
    createdAt: rider.documentsSubmittedAt ?? rider.createdAt,
    note: rider.rejectionNote ?? null,
    fields: [
      { key: "Phone", value: rider.user.phone },
      { key: "Vehicle", value: vehicle },
      { key: "Plate", value: plate },
      { key: "Applied", value: whenLabel(rider.documentsSubmittedAt ?? rider.createdAt) },
    ],
    checks: [
      { label: "Driver's licence", ok: !!rider.licenseDocUrl, document: "license" },
      { label: "Government ID", ok: !!rider.idDocUrl, document: "id" },
      { label: "Vehicle papers", ok: !!rider.vehicleRegDocUrl, document: "vehicleReg" },
      { label: "Guarantor details", ok: !!rider.guarantorName && !!rider.guarantorPhone },
      { label: "Payout bank account", ok: !!rider.payoutAccountName },
    ],
    unpaidKobo: due ? nairaToKobo(due.earnedNaira + due.waitPayNaira) : 0,
    netKobo: due ? nairaToKobo(due.netNaira) : 0,
    cashHeldKobo: due ? nairaToKobo(due.cashHeldNaira) : 0,
    payable: !!due?.hasPayoutAccount,
  };
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
