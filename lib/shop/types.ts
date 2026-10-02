/**
 * The ordering flow's view of karrigo-be: money already in kobo, nothing the
 * customer has no use for (payout accounts, review notes). Safe in client
 * components.
 */

export type ShopDish = {
  id: string;
  name: string;
  description: string;
  priceKobo: number;
  soldOut: boolean;
  imageUrl: string | null;
  tags: string[];
};

export type ShopSection = {
  id: string;
  label: string;
  note: string | null;
  dishes: ShopDish[];
};

export type ShopKitchen = {
  id: string;
  slug: string;
  name: string;
  emoji: string | null;
  cuisine: string;
  area: string;
  landmarkNote: string | null;
  imageUrl: string | null;
  open: boolean;
  /** The kitchen's own words, e.g. "Closed for Sallah". */
  notice: string | null;
  feeKobo: number;
  rating: number;
  ratingsCount: number;
};

export type ShopMenu = ShopKitchen & { sections: ShopSection[] };

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  /** Store credit, applied in full at the next checkout. */
  creditKobo: number;
};

/** The cart priced against the live menu. */
export type PricedLine = {
  dishId: string;
  name: string;
  qty: number;
  unitKobo: number;
  lineKobo: number;
};

export type PricedCart = {
  kitchen: ShopKitchen;
  lines: PricedLine[];
  /** Names of dishes that sold out or left the menu since they were added. */
  unavailable: string[];
  count: number;
  subtotalKobo: number;
  feeKobo: number;
  totalKobo: number;
};
