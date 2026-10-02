"use client";

import { useSyncExternalStore } from "react";

/**
 * The one piece of ops state that lives in the browser: the toast. Everything
 * else — orders, approvals, payouts, tickets — is the server's, and is read
 * fresh on each page and changed only through Server Actions.
 */

type OpsState = { toast: string };

const empty: OpsState = { toast: "" };

let state: OpsState = empty;
const listeners = new Set<() => void>();
let toastTimer: ReturnType<typeof setTimeout> | undefined;

function set(patch: Partial<OpsState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOps(): OpsState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => empty,
  );
}

/** A short confirmation of something that just happened. Ops acts fast and
 *  needs to know the click landed without reading the board again. */
export function say(toast: string) {
  set({ toast });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => set({ toast: "" }), 2600);
}
