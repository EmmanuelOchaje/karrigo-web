/**
 * The ops domain. These types describe what a dispatcher in Makurdi looks at
 * during a shift; they are deliberately independent of the customer app's
 * types, because ops sees things a customer never does — cash held by a rider,
 * a kitchen's payout balance, why an application was rejected.
 *
 * Money is kobo, always integers (CLAUDE.md rule 4).
 */

/* ---------------------------------------------------------------- orders */

/** The six states an order moves through, in order. The index matters: the
 *  timeline renders them in sequence and "how far along" is a comparison. */
export const ORDER_STAGES = [
  "waiting",
  "accepted",
  "cooking",
  "ready",
  "on_the_way",
  "delivered",
] as const;

export type OrderStage = (typeof ORDER_STAGES)[number];

export const STAGE_LABEL: Record<OrderStage, string> = {
  waiting: "Waiting for kitchen",
  accepted: "Accepted",
  cooking: "Cooking",
  ready: "Ready",
  on_the_way: "On the way",
  delivered: "Delivered",
};

export type PaymentMethod = "card" | "transfer" | "cash";

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  card: "Card",
  transfer: "Bank transfer",
  cash: "Cash on delivery",
};

/* ------------------------------------------------------- kitchens, riders */

export type KitchenStatus = "PENDING" | "ACTIVE" | "SUSPENDED";

export type RiderStatus = "PENDING" | "APPROVED" | "REJECTED";

/* --------------------------------------------------------------- tickets */

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export type Ticket = {
  id: string;
  subject: string;
  body: string;
  fromType: "Customer" | "Rider" | "Kitchen";
  fromName: string;
  channel: "IN_APP" | "WHATSAPP";
  /** The order it is about, when there is one. */
  orderId: string | null;
  status: TicketStatus;
  /** "8 min ago", "Yesterday". */
  age: string;
  /** International format, for the WhatsApp deep link. */
  phone: string;
};

/* -------------------------------------------------------------- overview */

/* ----------------------------------------------------------------- staff */

/** Moderators run the shift: orders, approvals, tickets. Only a super admin
 *  moves money — payouts and refunds. Enforced server-side, never by hiding
 *  the button alone. */
export type AdminRole = "SUPER_ADMIN" | "MODERATOR";

export type AdminUser = {
  name: string;
  email: string;
  role: AdminRole;
  /** Two letters for the sidebar avatar. */
  initials: string;
};
