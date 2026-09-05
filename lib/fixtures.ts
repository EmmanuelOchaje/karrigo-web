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
  credit: PhotoCredit;
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
    image: "/food/terkimbis-kitchen.jpg",
    credit: {
      artist: "Onyenachi64",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Egusi_soup_with_pounded_yam_and_assorted_meats.jpg",
    },
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
    image: "/food/sewuese-rice-spot.jpg",
    credit: {
      artist: "daSupremo",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Jollof_rice_with_boiled_egg_and_fried_chicken.jpg",
    },
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
    image: "/food/benue-grills.jpg",
    credit: {
      artist: "Halima Waziri",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Catfish_pepper_soup_with_vegetables.jpg",
    },
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
    image: "/food/modern-market-suya.jpg",
    credit: {
      artist: "Bukky658",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Suya_with_pepper_sauce.jpg",
    },
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
    image: "/food/ankpa-bukka.jpg",
    credit: {
      artist: "Bukky658",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Efo_riro.jpg",
    },
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

export const benefits = [
  {
    icon: "⌖",
    title: "Landmarks, not addresses",
    body: "“Behind BSU main gate” is a real address here. Our riders know Makurdi, so you never drag a pin on a map.",
  },
  {
    icon: "🍲",
    title: "Kitchens you already know",
    body: "The bukkas and spots you would walk to anyway — not a list of places that pay to be at the top.",
  },
  {
    icon: "📶",
    title: "Built for the network you have",
    body: "The whole site works on a slow connection. No app to install before you can order once.",
  },
  {
    icon: "🛵",
    title: "Follow your rider",
    body: "Watch them leave the kitchen and reach your gate. Share the link so whoever is waiting can watch too.",
  },
  {
    icon: "💵",
    title: "Pay how you actually pay",
    body: "Card, bank transfer, or cash to the rider at your door. No account needed to order.",
  },
  {
    icon: "☎",
    title: "A person, not a form",
    body: "If an order goes wrong, you reach someone in Makurdi who can call the kitchen and the rider.",
  },
];

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
    q: "What if the kitchen has finished the food?",
    a: "Dishes that have run out are marked finished and cannot be ordered. If a kitchen runs out after you have paid, we cancel and refund you in full, and we tell you which dish it was.",
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

export const riderSteps = [
  {
    icon: "📝",
    title: "Sign up and get verified",
    body: "Bring a bike, a rider's card and a phone. We check your papers and put you on the road within a week.",
  },
  {
    icon: "📍",
    title: "Pick up orders near you",
    body: "Orders come to the riders closest to the kitchen. You choose your own hours — ride when it suits you.",
  },
  {
    icon: "💰",
    title: "Get paid every Friday",
    body: "Paid per trip, straight to your account, every Friday. You keep 100% of your tips.",
  },
];
