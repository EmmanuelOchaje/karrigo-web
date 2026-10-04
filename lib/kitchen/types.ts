/** A live kitchen as the people running it see it. Money is kobo throughout;
 *  the conversion from the backend's naira happens in `data.ts`. Safe in
 *  client components. */

export type StaffRole = "OWNER" | "STAFF";

export type Dish = {
  id: string;
  sectionId: string;
  name: string;
  description: string;
  priceKobo: number;
  imageUrl: string | null;
  soldOut: boolean;
};

export type MenuSection = {
  id: string;
  label: string;
  note: string;
  dishes: Dish[];
};

export type Kitchen = {
  name: string;
  slug: string;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  role: StaffRole;
  isOpen: boolean;
  notice: string;
  cuisine: string;
  feeKobo: number;
  sections: MenuSection[];
};

export const ORDER_STATUSES = ["PLACED", "ACCEPTED", "PREPARING", "READY", "PICKED_UP", "CANCELLED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** The parent order's own status: `ACCEPTED` here means every kitchen
 *  accepted AND the customer paid. `AWAITING_PAYMENT` means accepted but
 *  not yet paid — nobody may start cooking. */
export type ParentOrderStatus =
  | "PLACED"
  | "AWAITING_PAYMENT"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "PICKED_UP"
  | "DELIVERING"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type KitchenOrder = {
  id: string;
  code: string;
  status: OrderStatus;
  placedAt: string;
  area: string;
  subtotalKobo: number;
  items: { id: string; name: string; qty: number; unitPriceKobo: number }[];
  /** The parent order, for telling "accepted, unpaid" from "accepted, paid". */
  order: {
    status: ParentOrderStatus;
    paymentDueAt: string | null;
    paidAt: string | null;
  };
};

/** One day of the week. `day` is 0 = Sunday, as `Date.getDay()` has it. */
export type DayHours = { day: number; closed: boolean; open: string; close: string };

export type Earnings = {
  /** Karrigo's share, as a fraction: 0.15 is 15%. */
  commissionRate: number;
  salesKobo: number;
  commissionKobo: number;
  nextPayoutKobo: number;
  nextPayoutOrders: number;
  nextPayoutDaysAway: number;
};

export type Payout = {
  id: string;
  amountKobo: number;
  status: "PENDING" | "FAILED" | "SETTLED";
  at: string;
  orders: number;
};

export type Ticket = {
  id: string;
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
};

export type StaffProfile = { name: string; email: string; phone: string };
