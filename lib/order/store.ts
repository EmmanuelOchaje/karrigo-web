"use client";

import { useSyncExternalStore } from "react";
import { findKitchen, type Dish, type Kitchen } from "@/lib/fixtures";
import type { PaymentMethod } from "./schema";

/**
 * The ordering flow's state, kept in the browser until there is a backend.
 *
 * The cart holds dish ids and quantities only — never a price. Every total is
 * worked out from the menu at render time, so a price change or a sell-out
 * shows up the next time the cart is looked at (CLAUDE.md rules 4 and 5).
 *
 * Accounts are a stand-in for the SMS-OTP sign-in in API.md. No password is
 * stored: a known phone number logs in with any valid password. Replace the
 * whole `accounts` idea when auth lands.
 */

export type User = { name: string; phone: string };

export type PlacedOrder = {
  id: string;
  kitchenSlug: string;
  kitchenName: string;
  items: { name: string; qty: number; priceKobo: number }[];
  subtotalKobo: number;
  feeKobo: number;
  totalKobo: number;
  pay: PaymentMethod;
  to: string;
  placedAt: number;
};

type State = {
  user: User | null;
  accounts: Record<string, string>;
  /** One kitchen per order: the cart belongs to exactly one kitchen. */
  cart: { kitchenSlug: string; lines: Record<string, number> } | null;
  landmark: string;
  address: string;
  order: PlacedOrder | null;
  toast: string;
};

const KEY = "karrigo-order";
const empty: State = {
  user: null,
  accounts: {},
  cart: null,
  landmark: "",
  address: "",
  order: null,
  toast: "",
};

let state: State = empty;
let loaded = false;
const listeners = new Set<() => void>();
let toastTimer: ReturnType<typeof setTimeout> | undefined;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<State>;
    state = { ...empty, ...saved, toast: "" };
  } catch {
    // Private windows and blocked storage: start empty, the flow still works.
  }
}

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, toast: "" }));
  } catch {
    // As above — persistence is a convenience, not a requirement.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOrderState(): State {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return state;
    },
    () => empty,
  );
}

const noop = () => () => {};

/** False on the server and during hydration, when the saved state is not
 *  readable yet — lets a page show "loading" rather than "not found". */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function say(toast: string) {
  clearTimeout(toastTimer);
  set({ toast });
  toastTimer = setTimeout(() => set({ toast: "" }), 2600);
}

export function addDish(kitchen: Kitchen, dishId: string) {
  load();
  const current = state.cart;
  if (current && current.kitchenSlug !== kitchen.slug) {
    say(`New cart started at ${kitchen.name}`);
    set({ cart: { kitchenSlug: kitchen.slug, lines: { [dishId]: 1 } } });
    return;
  }
  const lines = current?.lines ?? {};
  set({
    cart: {
      kitchenSlug: kitchen.slug,
      lines: { ...lines, [dishId]: (lines[dishId] ?? 0) + 1 },
    },
  });
}

export function removeDish(dishId: string) {
  load();
  if (!state.cart) return;
  const lines = { ...state.cart.lines };
  lines[dishId] = (lines[dishId] ?? 0) - 1;
  if (lines[dishId] <= 0) delete lines[dishId];
  set({
    cart: Object.keys(lines).length
      ? { kitchenSlug: state.cart.kitchenSlug, lines }
      : null,
  });
}

export function setDelivery(patch: { landmark?: string; address?: string }) {
  load();
  set(patch);
}

/** Returns an error message, or null on success. */
export function logIn(phone: string): string | null {
  load();
  const name = state.accounts[phone];
  if (!name) return "No account with that number. Sign up instead.";
  set({ user: { name, phone } });
  return null;
}

export function signUp(name: string, phone: string): string | null {
  load();
  if (state.accounts[phone]) {
    return "That number already has an account. Log in instead.";
  }
  set({ user: { name, phone }, accounts: { ...state.accounts, [phone]: name } });
  return null;
}

export function logOut() {
  set({ user: null });
  say("Logged out");
}

/** Stamps the order with an id and time, empties the cart, returns the id. */
export function placeOrder(order: Omit<PlacedOrder, "id" | "placedAt">): string {
  const id = String(1000 + Math.floor(Math.random() * 9000));
  set({ order: { ...order, id, placedAt: Date.now() }, cart: null });
  return id;
}

export function clearOrder() {
  set({ order: null });
}

export type CartLine = { dish: Dish; qty: number; lineKobo: number };

export type PricedCart = {
  kitchen: Kitchen;
  lines: CartLine[];
  /** Lines whose dish has sold out or left the menu since it was added. */
  unavailable: string[];
  count: number;
  subtotalKobo: number;
  feeKobo: number;
  totalKobo: number;
  /** How far below the kitchen's minimum the subtotal is; 0 when clear. */
  shortfallKobo: number;
};

/** Revalidates the cart against the menu and prices it. */
export function priceCart(cart: State["cart"]): PricedCart | null {
  if (!cart) return null;
  const kitchen = findKitchen(cart.kitchenSlug);
  if (!kitchen) return null;

  const lines: CartLine[] = [];
  const unavailable: string[] = [];
  for (const [dishId, qty] of Object.entries(cart.lines)) {
    const dish = kitchen.menu.find((d) => d.id === dishId);
    if (!dish || dish.soldOut) {
      unavailable.push(dish?.name ?? "A dish");
      continue;
    }
    lines.push({ dish, qty, lineKobo: dish.priceKobo * qty });
  }

  const subtotalKobo = lines.reduce((sum, line) => sum + line.lineKobo, 0);
  const feeKobo = kitchen.deliveryFeeKobo;
  return {
    kitchen,
    lines,
    unavailable,
    count: lines.reduce((sum, line) => sum + line.qty, 0),
    subtotalKobo,
    feeKobo,
    totalKobo: subtotalKobo + feeKobo,
    shortfallKobo: Math.max(0, kitchen.minOrderKobo - subtotalKobo),
  };
}
