/**
 * Placeholder ops data while there is no backend, matching the design in
 * `design/karrigo-admin.html`. Every export here is replaced by a query when
 * the API lands; the shapes are the contract.
 *
 * The shift clock is pinned. A dashboard that derives times from `Date.now()`
 * renders differently on the server and the client and hydrates with a
 * mismatch, and every screenshot of it is a different screenshot. One constant
 * fixes both, and it is the only thing that has to change when this goes live.
 */

import type {
  AdminUser,
  AttentionItem,
  FeedEvent,
  Kitchen,
  KitchenService,
  Kpi,
  Order,
  Rider,
  StageLoad,
  Ticket,
} from "./types";

/** Minutes past midnight, WAT. 14:32 — mid-afternoon, the lunch rush easing. */
export const SHIFT_NOW = 14 * 60 + 32;

/** The day these numbers describe, and what the comparison column is against.
 *  Pinned with the clock above — see the note at the top of this file. */
export const SHIFT_DATE = "Monday 28 September";
export const COMPARED_WITH = "Monday 21 September";

/** The shift these numbers describe. */
export const SHIFT = { startMinutes: 8 * 60, endMinutes: 22 * 60 } as const;

/** Minutes each stage was reached, relative to the order being placed. Used to
 *  build a timeline backwards from "placed N minutes ago". */
export const STAGE_OFFSETS = [0, 2, 3, 24, 28, 43] as const;

/** The one ops account, until there is an admins table. The email is checked
 *  against OPS_ADMIN_EMAIL at sign-in; this is what the sidebar shows. */
export const SIGNED_IN: AdminUser = {
  name: "Karrigo Admin",
  email: "admin@karrigo.com",
  role: "SUPER_ADMIN",
  initials: "KA",
};

/** Per area, per CLAUDE.md: never a flat number. */
export const DELIVERY_FEE_KOBO: Record<string, number> = {
  Wadata: 80000,
  "High Level": 70000,
  Wurukum: 60000,
  "Modern Market": 60000,
  "North Bank": 100000,
  Kanshio: 90000,
  "Judges Quarters": 80000,
  "Old GRA": 80000,
};

/** The automatic goodwill credit on a late order. Still an open policy
 *  question in CLAUDE.md — ops applies it by hand here, nothing is automatic. */
export const LATE_CREDIT_KOBO = 50000;

/** Over this and a rider is carrying too much of our money. */
export const RIDER_CASH_LIMIT_KOBO = 4000000;

export const ORDERS: Order[] = [
  {
    id: "KG-2217",
    customerName: "Aondona Iyorkyaa",
    customerPhone: "0803 412 7765",
    kitchen: "Wadata Swallow House",
    riderName: null,
    area: "Wadata",
    landmark: "Behind St. Theresa's Church, blue gate",
    stage: "waiting",
    elapsedMinutes: 3,
    late: false,
    cancelled: false,
    payment: "card",
    items: [
      { name: "Pounded yam & egusi", qty: 1, unitPriceKobo: 330000 },
      { name: "Chilled zobo", qty: 2, unitPriceKobo: 40000 },
    ],
  },
  {
    id: "KG-2216",
    customerName: "Mfon Udo",
    customerPhone: "0909 004 3312",
    kitchen: "Benue Pot",
    riderName: null,
    area: "High Level",
    landmark: "Federal Housing, block C",
    stage: "accepted",
    elapsedMinutes: 5,
    late: false,
    cancelled: false,
    payment: "card",
    items: [{ name: "Catfish pepper soup", qty: 1, unitPriceKobo: 350000 }],
  },
  {
    id: "KG-2214",
    customerName: "Ngozi Eze",
    customerPhone: "0905 330 1182",
    kitchen: "Terkimbi's Kitchen",
    riderName: null,
    area: "High Level",
    landmark: "Beside First Bank",
    stage: "cooking",
    elapsedMinutes: 9,
    late: false,
    cancelled: false,
    payment: "card",
    items: [
      { name: "Pounded yam & ogbono", qty: 1, unitPriceKobo: 300000 },
      { name: "Goat meat", qty: 2, unitPriceKobo: 80000 },
    ],
  },
  {
    id: "KG-2211",
    customerName: "Iveren Gbaden",
    customerPhone: "0703 221 6650",
    kitchen: "Iorja Grills & Rice",
    riderName: null,
    area: "Wurukum",
    landmark: "Opposite Wurukum roundabout, yellow storey building",
    stage: "cooking",
    elapsedMinutes: 17,
    late: false,
    cancelled: false,
    payment: "transfer",
    items: [{ name: "Chicken & chips", qty: 1, unitPriceKobo: 420000 }],
  },
  {
    id: "KG-2213",
    customerName: "Doowuese Ikyaa",
    customerPhone: "0810 552 9981",
    kitchen: "Modern Market Suya",
    riderName: null,
    area: "Modern Market",
    landmark: "Gate 2, by the POS stand",
    stage: "ready",
    elapsedMinutes: 25,
    late: false,
    cancelled: false,
    payment: "card",
    items: [{ name: "Suya (large)", qty: 2, unitPriceKobo: 250000 }],
  },
  {
    id: "KG-2209",
    customerName: "Blessing Ochoche",
    customerPhone: "0706 118 2290",
    kitchen: "Mama Nkechi's Kitchen",
    riderName: null,
    area: "North Bank",
    landmark: "Opposite NASME filling station",
    stage: "ready",
    elapsedMinutes: 26,
    late: false,
    cancelled: false,
    payment: "transfer",
    items: [{ name: "Jollof rice & turkey", qty: 2, unitPriceKobo: 380000 }],
  },
  {
    id: "KG-2205",
    customerName: "Sesugh Tyav",
    customerPhone: "0816 774 0023",
    kitchen: "Sewuese Rice Spot",
    riderName: "Tersoo Agba",
    area: "Kanshio",
    landmark: "Kanshio market, behind the tyre shop",
    stage: "on_the_way",
    elapsedMinutes: 31,
    late: false,
    cancelled: false,
    payment: "cash",
    items: [
      { name: "Ofada rice & ayamase", qty: 1, unitPriceKobo: 350000 },
      { name: "Fried plantain", qty: 1, unitPriceKobo: 60000 },
    ],
  },
  {
    id: "KG-2199",
    customerName: "Chinedu Okafor",
    customerPhone: "0802 667 1440",
    kitchen: "Mama Nkechi's Kitchen",
    riderName: "Aondoakaa Uke",
    area: "Judges Quarters",
    landmark: "House after the mosque, brown gate",
    stage: "on_the_way",
    elapsedMinutes: 38,
    late: true,
    cancelled: false,
    payment: "transfer",
    items: [
      { name: "Nkwobi", qty: 1, unitPriceKobo: 450000 },
      { name: "Fried yam", qty: 1, unitPriceKobo: 200000 },
    ],
  },
  {
    id: "KG-2196",
    customerName: "Terhemba Akaa",
    customerPhone: "0812 990 4471",
    kitchen: "Iorja Grills & Rice",
    riderName: "Emmanuel Ochaje",
    area: "Old GRA",
    landmark: "Second gate after Old GRA police post",
    stage: "on_the_way",
    elapsedMinutes: 52,
    late: true,
    cancelled: false,
    payment: "cash",
    items: [
      { name: "Grilled croaker", qty: 1, unitPriceKobo: 650000 },
      { name: "Fried rice", qty: 1, unitPriceKobo: 250000 },
    ],
  },
  {
    id: "KG-2190",
    customerName: "Samuel Adah",
    customerPhone: "0806 192 3345",
    kitchen: "Benue Pot",
    riderName: null,
    area: "Kanshio",
    landmark: "Behind Living Faith church",
    /** Cancelled at the kitchen — it never got past accepted. */
    stage: "cooking",
    elapsedMinutes: 40,
    late: false,
    cancelled: true,
    payment: "transfer",
    items: [{ name: "Egusi & semo", qty: 1, unitPriceKobo: 280000 }],
  },
  {
    id: "KG-2188",
    customerName: "Joy Agbo",
    customerPhone: "0705 881 2206",
    kitchen: "Terkimbi's Kitchen",
    riderName: "Msughter Iorkaa",
    area: "Wadata",
    landmark: "Wadata market road, green kiosk",
    stage: "delivered",
    elapsedMinutes: 64,
    late: false,
    cancelled: false,
    payment: "cash",
    items: [{ name: "Pounded yam & egusi", qty: 2, unitPriceKobo: 330000 }],
  },
  {
    id: "KG-2184",
    customerName: "Aver Ityav",
    customerPhone: "0813 440 7721",
    kitchen: "Iorja Grills & Rice",
    riderName: "Emmanuel Ochaje",
    area: "North Bank",
    landmark: "Opposite Uni Agric north gate",
    stage: "delivered",
    elapsedMinutes: 71,
    late: false,
    cancelled: false,
    payment: "card",
    items: [{ name: "Grilled chicken (half)", qty: 1, unitPriceKobo: 550000 }],
  },
];

/** Riders free to take a job, nearest first — what the assign sheet offers. */
export const NEARBY_RIDERS = [
  { name: "Fater Ioryue", area: "Wurukum", distance: "1.2 km away" },
  { name: "Msughter Iorkaa", area: "Wadata", distance: "2.0 km away" },
  { name: "Nguveren Asema", area: "High Level", distance: "2.6 km away" },
];

export const KITCHENS: Kitchen[] = [
  {
    id: "k9",
    name: "Ochanya's Pepper Soup",
    owner: "Ochanya Ode",
    email: "ochanya.ode@gmail.com",
    phone: "0806 551 2231",
    area: "North Bank",
    cuisine: "Pepper soup, swallow",
    status: "PENDING",
    submitted: "Today 11:05",
    menuItems: 9,
    locationPinned: true,
    bankConfirmed: true,
    unpaidKobo: 0,
    note: null,
  },
  {
    id: "k10",
    name: "Mama Dooshima Grills",
    owner: "Dooshima Tor",
    email: "dooshima.grills@gmail.com",
    phone: "0703 998 1204",
    area: "Wurukum",
    cuisine: "Grills, rice",
    status: "PENDING",
    submitted: "Yesterday 18:40",
    menuItems: 14,
    locationPinned: true,
    bankConfirmed: false,
    unpaidKobo: 0,
    note: null,
  },
  {
    id: "k11",
    name: "Apir Bukka",
    owner: "Terna Apir",
    email: "apirbukka@yahoo.com",
    phone: "0815 220 7736",
    area: "Apir",
    cuisine: "Swallow, soups",
    status: "PENDING",
    submitted: "Sat 26 Sep",
    menuItems: 0,
    locationPinned: false,
    bankConfirmed: false,
    unpaidKobo: 0,
    note: null,
  },
  {
    id: "k1",
    name: "Mama Nkechi's Kitchen",
    owner: "Nkechi Obi",
    email: "nkechi@karrigo.app",
    phone: "0802 114 5520",
    area: "North Bank",
    cuisine: "Nigerian classics",
    status: "ACTIVE",
    submitted: "Mar 2026",
    menuItems: 32,
    locationPinned: true,
    bankConfirmed: true,
    unpaidKobo: 15657000,
    note: null,
  },
  {
    id: "k2",
    name: "Iorja Grills & Rice",
    owner: "Iorja Tyokase",
    email: "iorja@karrigo.app",
    phone: "0813 776 1100",
    area: "Wurukum",
    cuisine: "Grills, rice",
    status: "ACTIVE",
    submitted: "Feb 2026",
    menuItems: 27,
    locationPinned: true,
    bankConfirmed: true,
    unpaidKobo: 19677500,
    note: null,
  },
  {
    id: "k3",
    name: "Terkimbi's Kitchen",
    owner: "Terkimbi Ahule",
    email: "terkimbi@karrigo.app",
    phone: "0706 331 9087",
    area: "High Level",
    cuisine: "Swallow, soups",
    status: "ACTIVE",
    submitted: "Jan 2026",
    menuItems: 21,
    locationPinned: true,
    bankConfirmed: true,
    unpaidKobo: 12138000,
    note: null,
  },
  {
    id: "k4",
    name: "Benue Pot",
    owner: "Mnena Ikyo",
    email: "benuepot@gmail.com",
    phone: "0909 442 6671",
    area: "Kanshio",
    cuisine: "Soups, fish",
    status: "ACTIVE",
    submitted: "Apr 2026",
    menuItems: 18,
    locationPinned: true,
    bankConfirmed: true,
    unpaidKobo: 8194000,
    note: null,
  },
  {
    id: "k12",
    name: "Quick Chops Wadata",
    owner: "Adah Emmanuel",
    email: "quickchops@gmail.com",
    phone: "0805 110 3349",
    area: "Wadata",
    cuisine: "Snacks",
    status: "SUSPENDED",
    submitted: "May 2026",
    menuItems: 11,
    locationPinned: true,
    bankConfirmed: true,
    unpaidKobo: 0,
    note: "Repeated hygiene complaints from customers, 3 in one week.",
  },
];

const ALL_DOCS = {
  licence: true,
  governmentId: true,
  vehiclePapers: true,
  guarantor: true,
  bankAccount: true,
};

export const RIDERS: Rider[] = [
  {
    id: "r21",
    name: "Ushahemba Kwaghga",
    phone: "0810 334 2290",
    vehicle: "Motorbike",
    plate: "MKD 412 QA",
    area: "Wurukum",
    status: "PENDING",
    submitted: "Today 09:12",
    documents: { ...ALL_DOCS },
    unpaidKobo: 0,
    cashHeldKobo: 0,
    note: null,
  },
  {
    id: "r22",
    name: "Blessing Adoga",
    phone: "0703 118 4462",
    vehicle: "Motorbike",
    plate: "BNU 881 KT",
    area: "High Level",
    status: "PENDING",
    submitted: "Today 07:48",
    documents: { ...ALL_DOCS, vehiclePapers: false },
    unpaidKobo: 0,
    cashHeldKobo: 0,
    note: null,
  },
  {
    id: "r23",
    name: "Tavershima Iorwuese",
    phone: "0906 772 1030",
    vehicle: "Bicycle",
    plate: "—",
    area: "Old GRA",
    status: "PENDING",
    submitted: "Yesterday 16:20",
    documents: { ...ALL_DOCS, guarantor: false, bankAccount: false },
    unpaidKobo: 0,
    cashHeldKobo: 0,
    note: null,
  },
  {
    id: "r1",
    name: "Emmanuel Ochaje",
    phone: "0812 440 9981",
    vehicle: "Motorbike",
    plate: "MKD 207 AB",
    area: "Old GRA",
    status: "APPROVED",
    submitted: "Jan 2026",
    documents: { ...ALL_DOCS },
    unpaidKobo: 4860000,
    cashHeldKobo: 1240000,
    note: null,
  },
  {
    id: "r2",
    name: "Tersoo Agba",
    phone: "0706 221 7754",
    vehicle: "Motorbike",
    plate: "BNU 334 GH",
    area: "Kanshio",
    status: "APPROVED",
    submitted: "Feb 2026",
    documents: { ...ALL_DOCS },
    unpaidKobo: 3915000,
    cashHeldKobo: 4350000,
    note: null,
  },
  {
    id: "r3",
    name: "Msughter Iorkaa",
    phone: "0815 667 2201",
    vehicle: "Motorbike",
    plate: "MKD 990 LA",
    area: "Wadata",
    status: "APPROVED",
    submitted: "Mar 2026",
    documents: { ...ALL_DOCS },
    unpaidKobo: 2780000,
    cashHeldKobo: 0,
    note: null,
  },
  {
    id: "r24",
    name: "Ikenna Ude",
    phone: "0807 551 8830",
    vehicle: "Motorbike",
    plate: "ENU 102 XZ",
    area: "North Bank",
    status: "REJECTED",
    submitted: "Thu 24 Sep",
    documents: { ...ALL_DOCS },
    unpaidKobo: 0,
    cashHeldKobo: 0,
    note: "Licence photo is blurry and the plate number doesn't match the vehicle papers. Please re-upload both.",
  },
];

export const TICKETS: Ticket[] = [
  {
    id: "t1",
    subject: "Food arrived cold",
    body: "The pepper soup was cold when it got here and the rider took almost an hour. I paid ₦9,800 for this.",
    fromType: "Customer",
    fromName: "Terhemba Akaa",
    channel: "IN_APP",
    orderId: "KG-2196",
    status: "OPEN",
    age: "8 min ago",
    phone: "2348129904471",
  },
  {
    id: "t2",
    subject: "Rider asked for extra money",
    body: "The rider said I should add ₦300 for fuel before he hands over the food. Is this allowed?",
    fromType: "Customer",
    fromName: "Joy Agbo",
    channel: "WHATSAPP",
    orderId: "KG-2188",
    status: "OPEN",
    age: "21 min ago",
    phone: "2347058812206",
  },
  {
    id: "t3",
    subject: "Customer not at landmark",
    body: "I have waited 12 minutes at St Theresa's Church. The customer is not picking my calls.",
    fromType: "Rider",
    fromName: "Tersoo Agba",
    channel: "IN_APP",
    orderId: "KG-2205",
    status: "OPEN",
    age: "34 min ago",
    phone: "2347062217754",
  },
  {
    id: "t4",
    subject: "Payout not received",
    body: "My last payout says sent on Friday but nothing has entered my GTBank account.",
    fromType: "Kitchen",
    fromName: "Benue Pot",
    channel: "IN_APP",
    orderId: null,
    status: "IN_PROGRESS",
    age: "2 h ago",
    phone: "2349094426671",
  },
  {
    id: "t5",
    subject: "Wrong item in my order",
    body: "I ordered ofada rice and ayamase. I got white rice and stew.",
    fromType: "Customer",
    fromName: "Sesugh Tyav",
    channel: "WHATSAPP",
    orderId: "KG-2205",
    status: "IN_PROGRESS",
    age: "3 h ago",
    phone: "2348167740023",
  },
  {
    id: "t6",
    subject: "App keeps logging me out",
    body: "Every time I switch to rider mode it asks me to log in again.",
    fromType: "Rider",
    fromName: "Msughter Iorkaa",
    channel: "IN_APP",
    orderId: null,
    status: "RESOLVED",
    age: "Yesterday",
    phone: "2348156672201",
  },
  {
    id: "t7",
    subject: "Menu photo upload fails",
    body: "The photo for my egusi keeps failing to upload. It is a normal phone picture.",
    fromType: "Kitchen",
    fromName: "Terkimbi's Kitchen",
    channel: "IN_APP",
    orderId: null,
    status: "CLOSED",
    age: "Fri 25 Sep",
    phone: "2347063319087",
  },
];

export const KPIS: Kpi[] = [
  { label: "Orders", value: "412", versus: "vs 368", delta: "▲ 12%", good: true },
  {
    label: "Sales",
    value: "₦2,184,600",
    versus: "vs ₦2,004,100",
    delta: "▲ 9%",
    good: true,
  },
  {
    label: "Karrigo revenue",
    value: "₦368,900",
    versus: "vs ₦332,300",
    delta: "▲ 11%",
    good: true,
  },
  {
    label: "Avg delivery",
    value: "38 min",
    versus: "target 35 · was 34",
    delta: "▲ 4 min",
    good: false,
  },
  { label: "Riders online", value: "46", versus: "vs 41", delta: "▲ 5", good: true },
  {
    label: "Cancellation",
    value: "3.4%",
    versus: "vs 2.1%",
    delta: "▲ 1.3 pts",
    good: false,
  },
];

/** Orders per hour, 08:00–22:00. `today` stops at the current hour. */
export const HOURLY = {
  scaleMax: 120,
  lastWeek: [12, 24, 38, 56, 84, 104, 50, 66, 58, 72, 90, 96, 70, 40, 18],
  today: [14, 26, 41, 63, 92, 118, 58],
} as const;

export const ATTENTION: AttentionItem[] = [
  {
    id: "a1",
    severity: "danger",
    title: "Wadata Swallow House isn't answering KG-2217",
    meta: "2:40 of the 3:00 accept window · 2 missed today",
    action: "Call kitchen",
    doneLabel: "Called kitchen",
  },
  {
    id: "a2",
    severity: "danger",
    title: "No rider has accepted KG-2209",
    meta: "Ready for 6 min at Mama Nkechi's · North Bank",
    action: "Assign rider",
    doneLabel: "Rider assigned",
  },
  {
    id: "a3",
    severity: "warning",
    title: "KG-2196 is 17 min late",
    meta: "Iorja Grills & Rice → Old GRA · Emmanuel Ochaje",
    action: "Give ₦500 credit",
    doneLabel: "Credit sent",
  },
  {
    id: "a4",
    severity: "warning",
    title: "Tersoo Agba is holding ₦43,500 cash",
    meta: "Over the ₦40,000 limit for 25 min",
    action: "Message rider",
    doneLabel: "Message sent",
  },
  {
    id: "a5",
    severity: "warning",
    title: "Only 2 riders in Kanshio for 7 open orders",
    meta: "Nearest spare riders are in Wurukum",
    action: "Ping riders",
    doneLabel: "Riders pinged",
  },
];

/** Which order the attention actions touch, so acting on a row changes the
 *  board the same way the real action would. */
export const ATTENTION_EFFECTS: Record<
  string,
  { creditOrder?: string; assignRider?: { orderId: string; rider: string } }
> = {
  a2: { assignRider: { orderId: "KG-2209", rider: "Fater Ioryue" } },
  a3: { creditOrder: "KG-2196" },
};

export const STAGE_LOAD: StageLoad[] = [
  { label: "Waiting for kitchen", count: 7, average: "2m 10s", target: "3m", slow: false },
  { label: "Accepted", count: 5, average: "1m 40s", target: "2m", slow: false },
  { label: "Cooking", count: 18, average: "23 min", target: "20 min", slow: true },
  { label: "Ready", count: 4, average: "6 min", target: "4 min", slow: true },
  { label: "On the way", count: 21, average: "14 min", target: "15 min", slow: false },
];

export const KITCHEN_SERVICE: KitchenService[] = [
  { name: "Mama Nkechi's Kitchen", state: "open", pausedMinutes: 0, activeOrders: 6, acceptRate: 97, prepMinutes: 18, salesKobo: 18420000 },
  { name: "Iorja Grills & Rice", state: "open", pausedMinutes: 0, activeOrders: 9, acceptRate: 94, prepMinutes: 24, salesKobo: 23150000 },
  { name: "Wadata Swallow House", state: "open", pausedMinutes: 0, activeOrders: 7, acceptRate: 83, prepMinutes: 34, salesKobo: 15790000 },
  { name: "Terkimbi's Kitchen", state: "open", pausedMinutes: 0, activeOrders: 4, acceptRate: 99, prepMinutes: 16, salesKobo: 14280000 },
  { name: "Sewuese Rice Spot", state: "open", pausedMinutes: 0, activeOrders: 5, acceptRate: 88, prepMinutes: 27, salesKobo: 11830000 },
  { name: "Benue Pot", state: "paused", pausedMinutes: 12, activeOrders: 0, acceptRate: 71, prepMinutes: 31, salesKobo: 9640000 },
  { name: "Modern Market Suya", state: "open", pausedMinutes: 0, activeOrders: 3, acceptRate: 92, prepMinutes: 12, salesKobo: 8860000 },
  { name: "Ochanya's Pepper Soup", state: "closed", pausedMinutes: 0, activeOrders: 0, acceptRate: null, prepMinutes: null, salesKobo: 4120000 },
];

/** An accept rate under this, or a prep time over it, is worth a second look. */
export const SERVICE_THRESHOLDS = { acceptRate: 85, prepMinutes: 30 } as const;

export const FEED: FeedEvent[] = [
  { time: "14:32", kind: "order", text: "KG-2217 · Wadata Swallow House · ₦7,400" },
  { time: "14:31", kind: "reject", text: "Benue Pot rejected KG-2215 · “out of catfish”" },
  { time: "14:30", kind: "sold", text: "Iorja Grills & Rice · Grilled croaker" },
  { time: "14:29", kind: "pause", text: "Benue Pot for 30 min" },
  { time: "14:28", kind: "online", text: "Fater Ioryue · Wurukum" },
  { time: "14:27", kind: "pickup", text: "Tersoo Agba · KG-2205 from Sewuese Rice Spot" },
  { time: "14:26", kind: "accept", text: "Terkimbi's Kitchen · KG-2214 in 38s" },
  { time: "14:24", kind: "deliv", text: "KG-2188 to Wadata · 41 min" },
  { time: "14:24", kind: "cash", text: "Msughter Iorkaa collected ₦7,400 · KG-2188" },
  { time: "14:20", kind: "settle", text: "Card payment · KG-2211 · ₦4,800" },
];

/** The commission Karrigo keeps on a kitchen's sales. */
export const COMMISSION_RATE = 0.15;

export const PUSH_SWEEP = {
  lastRun: "Sun 27 Sep, 22:00",
  deadTokens: 38,
  devices: 1204,
} as const;
