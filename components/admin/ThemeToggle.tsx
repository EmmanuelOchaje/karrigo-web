"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import {
  OPS_THEME_COOKIE,
  OPS_THEME_MAX_AGE,
  type OpsTheme,
} from "@/lib/admin/theme";

/**
 * A CSS time as milliseconds. Browsers normalise `750ms` to `.75s` when you
 * read it back, so a bare parseFloat gives 0.75 and every timeout built on it
 * lands an order of magnitude too early.
 */
function cssDurationMs(value: string, fallback: number): number {
  const raw = value.trim();
  const amount = Number.parseFloat(raw);
  if (!Number.isFinite(amount)) return fallback;
  if (raw.endsWith("ms")) return amount;
  if (raw.endsWith("s")) return amount * 1000;
  return fallback;
}

/**
 * Writes the preference and swaps the palette in place.
 *
 * Deliberately outside the component: it touches `document` directly, and the
 * attribute has to be set synchronously inside the view-transition callback —
 * a React state update would not have reached the DOM by the time the browser
 * captures the new frame, and the transition times out waiting for it.
 */
function swapTheme(next: OpsTheme, onCommit: (theme: OpsTheme) => void) {
  document.cookie = `${OPS_THEME_COOKIE}=${next};path=/;max-age=${OPS_THEME_MAX_AGE};samesite=lax`;

  const root = document.querySelector<HTMLElement>("[data-ops]");
  const html = document.documentElement;

  let done = false;
  const commit = () => {
    if (done) return;
    done = true;
    if (root) root.dataset.theme = next;
    onCommit(next);
  };
  const cleanUp = () => {
    delete html.dataset.opsVt;
    delete html.dataset.opsWipe;
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduced) {
    commit();
    return;
  }

  // Light arrives from the left, dark from the right — the direction the thumb
  // is travelling.
  html.dataset.opsWipe = next === "light" ? "ltr" : "rtl";
  html.dataset.opsVt = "1";

  const transition = document.startViewTransition(commit);

  // The wipe is driven by `data-ops-wipe`, so clearing it early kills the
  // animation and the new palette snaps in. Never clean up on a timer that
  // could be shorter than the animation — read the duration from the
  // stylesheet rather than repeating it here, where the two would drift.
  const wipeMs = cssDurationMs(
    getComputedStyle(html).getPropertyValue("--ops-wipe-duration"),
    750,
  );

  // The transition finishing is the real signal.
  transition.finished.catch(() => {}).finally(cleanUp);

  // A view transition can still be abandoned — the browser times out waiting
  // for the DOM update, another one starts, the tab stops rendering. If it
  // never even begins, there is no animation to protect, so apply the theme
  // at once.
  transition.ready.catch(() => {
    commit();
    cleanUp();
  });

  // Last resort, for the case where nothing above ever settles. Comfortably
  // past the end of the wipe so it cannot cut a healthy one short.
  window.setTimeout(() => {
    commit();
    cleanUp();
  }, wipeMs + 600);
}

export function ThemeToggle({ theme: initial }: { theme: OpsTheme }) {
  const [theme, setTheme] = useState<OpsTheme>(initial);

  return (
    <div className="bg-ops-surface relative grid grid-cols-2 rounded-pill p-1">
      <span
        aria-hidden
        className={cn(
          "bg-accent pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)]",
          "rounded-pill shadow-[0_6px_14px_-8px_rgba(14,15,13,.45)]",
          "transition-transform duration-(--duration-slow) ease-[cubic-bezier(.2,.8,.2,1)]",
          "[view-transition-name:ops-theme-thumb]",
          theme === "light" && "translate-x-full",
        )}
      />
      {(["dark", "light"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => option !== theme && swapTheme(option, setTheme)}
          aria-pressed={theme === option}
          className={cn(
            "relative h-8 rounded-pill text-label font-semibold capitalize",
            "transition-colors duration-(--duration-slow)",
            theme === option ? "text-on-accent" : "text-text",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
