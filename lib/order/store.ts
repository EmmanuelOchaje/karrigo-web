"use client";

import { useSyncExternalStore } from "react";

/**
 * The ordering flow's browser state: the cart, and where the food is going.
 *
 * The cart holds dish ids and quantities only — never a price or a name. Every
 * figure is worked out on the server from the live menu (`priceCartAction`), so
 * a price change or a sell-out shows up the next time the cart is opened
 * (CLAUDE.md rules 4 and 5). Who is signed in is not kept here at all: it
 * comes from the server on every page, so it cannot go stale or be faked.
 */

type State = {
  /** One kitchen per order: the cart belongs to exactly one kitchen. */
  cart: { kitchenSlug: string; kitchenName: string; lines: Record<string, number> } | null;
  landmark: string;
  address: string;
  area: string;
  toast: string;
};

const KEY = "karrigo-order";
const empty: State = { cart: null, landmark: "", address: "", area: "", toast: "" };

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
 *  readable yet — lets a page show "loading" rather than "empty". */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function say(toast: string) {
  clearTimeout(toastTimer);
  set({ toast });
  toastTimer = setTimeout(() => set({ toast: "" }), 2600);
}

export function addDish(kitchen: { slug: string; name: string }, dishId: string) {
  load();
  const current = state.cart;
  if (current && current.kitchenSlug !== kitchen.slug) {
    say(`New cart started at ${kitchen.name}`);
    set({ cart: { kitchenSlug: kitchen.slug, kitchenName: kitchen.name, lines: { [dishId]: 1 } } });
    return;
  }
  const lines = current?.lines ?? {};
  set({
    cart: {
      kitchenSlug: kitchen.slug,
      kitchenName: kitchen.name,
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
  set({ cart: Object.keys(lines).length ? { ...state.cart, lines } : null });
}

/** Drops dishes the kitchen can no longer serve, keeping the rest. */
export function keepOnly(dishIds: string[]) {
  load();
  if (!state.cart) return;
  const lines = Object.fromEntries(Object.entries(state.cart.lines).filter(([id]) => dishIds.includes(id)));
  set({ cart: Object.keys(lines).length ? { ...state.cart, lines } : null });
}

export function clearCart() {
  set({ cart: null });
}

export function setDelivery(patch: { landmark?: string; address?: string; area?: string }) {
  load();
  set(patch);
}

export function cartCount(cart: State["cart"]): number {
  return cart ? Object.values(cart.lines).reduce((sum, qty) => sum + qty, 0) : 0;
}
