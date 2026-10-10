"use client";

import { useSyncExternalStore } from "react";

/** One clock for the whole panel. Every live timer subscribes to this single
 *  interval rather than starting its own, and it holds still while the tab is
 *  in the background. */
const listeners = new Set<() => void>();
let tick = 0;
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    timer = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      tick = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  tick = Date.now();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) clearInterval(timer);
  };
}

/** The current time in ms once mounted, 0 on the server and during hydration,
 *  so the first paint matches what the server rendered. */
export function useNow(): number {
  return useSyncExternalStore(
    subscribe,
    () => tick,
    () => 0,
  );
}
