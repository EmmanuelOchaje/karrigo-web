/**
 * Placeholder data for the marketing pages while there is no backend.
 * Every one of these is replaced by a live query in M4. Money is kobo.
 */

export type Kitchen = {
  slug: string;
  name: string;
  cuisine: string;
  area: string;
  emoji: string;
  distanceKm: number;
  etaMinutes: [number, number];
  deliveryFeeKobo: number;
  closedUntil?: string;
};

export const kitchens: Kitchen[] = [
  {
    slug: "terkimbis-kitchen",
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
    name: "Benue Grills",
    cuisine: "Catfish & pepper soup",
    area: "Judges Quarters",
    emoji: "🐟",
    distanceKm: 2.6,
    etaMinutes: [35, 45],
    deliveryFeeKobo: 80000,
  },
  {
    slug: "modern-market-suya",
    name: "Modern Market Suya",
    cuisine: "Suya & grills",
    area: "Modern Market",
    emoji: "🍢",
    distanceKm: 3.1,
    etaMinutes: [30, 40],
    deliveryFeeKobo: 90000,
  },
  {
    slug: "ankpa-bukka",
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
