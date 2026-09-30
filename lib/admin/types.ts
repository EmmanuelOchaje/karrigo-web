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

export type OrderItem = {
  name: string;
  qty: number;
  /** Per unit. The line total is qty × this. */
  unitPriceKobo: number;
};

export type Order = {
  /** The number ops and the customer both say out loud — "KG-2217". */
  id: string;
  customerName: string;
  customerPhone: string;
  kitchen: string;
  /** Null until a rider accepts. An order past `ready` with no rider is the
   *  single most urgent thing on the board. */
  riderName: string | null;
  area: string;
  /** Landmark addressing — free text, never a dropped pin (CLAUDE.md). */
  landmark: string;
  stage: OrderStage;
  /** Minutes since the customer placed it. */
  elapsedMinutes: number;
  /** Past the promised window. Drives the red stripe and the credit offer. */
  late: boolean;
  cancelled: boolean;
  payment: PaymentMethod;
  items: OrderItem[];
};

/* ------------------------------------------------------- kitchens, riders */

export type KitchenStatus = "PENDING" | "ACTIVE" | "SUSPENDED";

export type Kitchen = {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  area: string;
  cuisine: string;
  status: KitchenStatus;
  /** As ops reads it on the row — "Today 11:05", "Mar 2026". Fixture-shaped;
   *  a real timestamp formats into this. */
  submitted: string;
  menuItems: number;
  locationPinned: boolean;
  bankConfirmed: boolean;
  /** Completed orders not yet settled, after the 15% commission. */
  unpaidKobo: number;
  /** Why it was suspended or rejected. The kitchen sees this. */
  note: string | null;
};

export type RiderStatus = "PENDING" | "APPROVED" | "REJECTED";

/** The five things a rider has to produce before going online. The first three
 *  are uploaded documents ops can open; the last two are data. */
export type RiderDocuments = {
  licence: boolean;
  governmentId: boolean;
  vehiclePapers: boolean;
  guarantor: boolean;
  bankAccount: boolean;
};

export type Rider = {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  /** "—" for a bicycle. */
  plate: string;
  area: string;
  status: RiderStatus;
  submitted: string;
  documents: RiderDocuments;
  /** Trip pay and tips owed. */
  unpaidKobo: number;
  /** Cash collected on delivery and not yet handed in. Netted off the payout,
   *  and watched during a shift — a rider over the limit is a risk. */
  cashHeldKobo: number;
  note: string | null;
};

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

/** One of the six numbers across the top of the shift. */
export type Kpi = {
  label: string;
  value: string;
  /** What it is being compared against. */
  versus: string;
  delta: string;
  /** Whether the movement is the direction we want. Up is not always good:
   *  average delivery time and cancellations rising are both bad. */
  good: boolean;
};

/** Something a person has to deal with now, with the one action that deals
 *  with it. Ordered by urgency, severest first. */
export type AttentionItem = {
  id: string;
  severity: "danger" | "warning";
  title: string;
  meta: string;
  /** The button label — "Call kitchen", "Assign rider". */
  action: string;
  /** What the row says once it is done. */
  doneLabel: string;
};

/** A bar in the funnel: how many orders sit in this stage and how long they
 *  are taking against target. */
export type StageLoad = {
  label: string;
  count: number;
  average: string;
  target: string;
  /** Running behind target — the bar turns amber. */
  slow: boolean;
};

export type KitchenService = {
  name: string;
  state: "open" | "paused" | "closed";
  /** Minutes remaining on a pause. */
  pausedMinutes: number;
  activeOrders: number;
  /** Share of orders accepted within the 3-minute window. Null when closed. */
  acceptRate: number | null;
  /** Average minutes from accept to ready. Null when closed. */
  prepMinutes: number | null;
  salesKobo: number;
};

export type FeedKind =
  | "order"
  | "reject"
  | "sold"
  | "pause"
  | "online"
  | "pickup"
  | "accept"
  | "deliv"
  | "cash"
  | "settle";

export type FeedEvent = {
  time: string;
  kind: FeedKind;
  text: string;
};

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
