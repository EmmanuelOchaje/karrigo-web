/**
 * Placeholder data for the marketing pages while there is no backend.
 * Every one of these is replaced by a live query in M4. Money is kobo.
 */

export type PhotoCredit = {
  artist: string;
  license: string;
  source: string;
};

export type Kitchen = {
  slug: string;
  image: string;
  /** Absent while we are still chasing the source for a replaced photo. */
  credit?: PhotoCredit;
  name: string;
  cuisine: string;
  area: string;
  emoji: string;
  distanceKm: number;
  etaMinutes: [number, number];
  deliveryFeeKobo: number;
  closedUntil?: string;
  /** A short opening-hours notice shown on the kitchen's card — the kitchen
   *  is still browsable, just not taking orders yet today. */
  opensAt?: string;
};

export const kitchens: Kitchen[] = [
  {
    slug: "terkimbis-kitchen",
    image: "/food/poundo.jpg",
    // TODO: credit unknown for poundo.jpg — add artist, licence and source before launch.
    name: "Terkimbi's Kitchen",
    cuisine: "Swallow & soups",
    area: "Wurukum",
    emoji: "🍲",
    distanceKm: 0.8,
    etaMinutes: [20, 30],
    deliveryFeeKobo: 0,
  },
  {
    slug: "sewuese-rice-spot",
    image: "/food/jollof-chicken.jpg",
    // TODO: credit unknown for jollof-chicken.jpg — add artist, licence and source before launch.
    name: "Sewuese Rice Spot",
    cuisine: "Jollof & chicken",
    area: "North Bank",
    emoji: "🍛",
    distanceKm: 1.4,
    etaMinutes: [25, 35],
    deliveryFeeKobo: 50000,
  },
  {
    slug: "benue-grills",
    image: "/food/barbeque.jpg",
    // TODO: credit unknown for barbeque.jpg — add artist, licence and source before launch.
    name: "Benue Grills",
    cuisine: "Grills & barbecue",
    area: "Judges Quarters",
    emoji: "🍖",
    distanceKm: 2.6,
    etaMinutes: [35, 45],
    deliveryFeeKobo: 80000,
  },
  {
    slug: "modern-market-suya",
    image: "/food/meat.jpg",
    // TODO: credit unknown for meat.jpg — add artist, licence and source before launch.
    name: "Modern Market Suya",
    cuisine: "Suya & grills",
    area: "Modern Market",
    emoji: "🍢",
    distanceKm: 3.1,
    etaMinutes: [30, 40],
    deliveryFeeKobo: 90000,
    opensAt: "Opens 6pm",
  },
  {
    slug: "ankpa-bukka",
    image: "/food/egusi.jpg",
    // TODO: credit unknown for egusi.jpg — add artist, licence and source before launch.
    name: "Ankpa Bukka",
    cuisine: "Local dishes",
    area: "Ankpa Ward",
    emoji: "🍗",
    distanceKm: 3.6,
    etaMinutes: [35, 45],
    deliveryFeeKobo: 90000,
  },
  {
    slug: "aondona-breakfast",
    image: "/food/aondona-breakfast.jpg",
    credit: {
      artist: "Ceentia",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Bean_cake_(Akara).jpg",
    },
    name: "Aondona Breakfast",
    cuisine: "Pap, akara & tea",
    area: "High Level",
    emoji: "🥣",
    distanceKm: 1.9,
    etaMinutes: [20, 30],
    deliveryFeeKobo: 50000,
    closedUntil: "Opens 6:30am tomorrow",
  },
];

/** The scrolling dish rail on the homepage. Reuses photos already credited
 *  (or tracked) against a kitchen above, so it introduces no new attribution
 *  gaps — same images, priced at dish level instead of kitchen level. */
export const dishes = [
  { name: "Pounded yam & egusi", image: "/food/poundo.jpg", priceKobo: 330000 },
  { name: "Jollof & chicken", image: "/food/jollof-chicken.jpg", priceKobo: 280000 },
  { name: "Grilled chicken", image: "/food/barbeque.jpg", priceKobo: 450000 },
  { name: "Suya, full wrap", image: "/food/meat.jpg", priceKobo: 150000 },
] as const;

export const areasLive = [
  "High Level",
  "Wurukum",
  "North Bank",
  "Modern Market",
  "Judges Quarters",
  "Ankpa Ward",
  "BSU and around",
];

export const areasComingNext = [
  "Gyado Villa",
  "Achusa",
  "Logo 1",
  "Gboko — being asked for a lot",
];

export const heroStats = [
  { value: "7 areas", label: "covered today" },
  { value: "29 min", label: "average to your gate" },
  { value: "₦500", label: "delivery in your area" },
];

export const steps = [
  {
    title: "Tell us where",
    body: "An address or a landmark. We show the kitchens that reach you.",
  },
  {
    title: "Pick your food",
    body: "Real menus, today's prices, live availability.",
  },
  {
    title: "Pay your way",
    body: "Card, transfer, or cash to the rider.",
  },
  {
    title: "Watch it come",
    body: "Follow your rider on a map and call them if needed.",
  },
];

export const benefitCards = [
  {
    title: "Landmarks, not addresses",
    body: "“Behind BSU main gate” is a real address here. Tell us the school gate, the church, the filling station — our riders know Makurdi, so you never drag a pin on a map.",
    href: "/areas",
    image: "/images/location.jpg",
    imageAlt: "A location pin",
  },
  {
    title: "Follow your rider to your gate",
    body: "Watch them leave the kitchen and come to you. Share the link so whoever is waiting can follow it too — no app, no account, and it works on a slow connection.",
    href: "/help",
    image: "/images/bike.jpg",
    imageAlt: "A delivery scooter carrying a box",
  },
  {
    title: "Pay how you actually pay",
    body: "Card, bank transfer, or cash to the rider at your door. Nothing to install and no account needed, and if an order goes wrong you reach a person in Makurdi.",
    href: "/help#payment",
    image: "/images/payment.jpg",
    imageAlt: "Paying on a phone with a card",
  },
] as const;

export const faqs = [
  {
    q: "Do I need to create an account?",
    a: "No. You can order with just a phone number. We text you a link to follow the order, and you can make an account later if you want your addresses saved.",
  },
  {
    q: "What if I do not have a street address?",
    a: "Most people here do not use one. Give us a landmark — a school gate, a church, a filling station — and the area. Riders find it the same way you would tell a friend.",
  },
  {
    q: "How much is delivery?",
    a: "It depends on how far the kitchen is from you, so it is shown per kitchen before you order. It is never a surprise at checkout.",
  },
  {
    q: "Can I pay cash?",
    a: "Yes, cash to the rider when the food reaches you. Card and bank transfer also work.",
  },
  {
    q: "Which areas do you deliver to?",
    a: "Seven areas around Makurdi today. We open a new area only when we have enough riders to serve it properly, rather than taking orders we cannot deliver.",
  },
];

/** Footer link columns. These exist for local search as much as navigation. */
export const cuisines = [
  "Swallow & soups",
  "Jollof & rice",
  "Pepper soup",
  "Suya & grills",
  "Breakfast",
  "Drinks",
];
