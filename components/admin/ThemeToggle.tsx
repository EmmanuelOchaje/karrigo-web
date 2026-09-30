"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import {
  OPS_THEME_COOKIE,
  OPS_THEME_MAX_AGE,
  type OpsTheme,
} from "@/lib/admin/theme";

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
  // A view transition can be abandoned — the browser times out waiting for the
  // DOM update, another starts, the tab stops rendering. The theme has to
  // change anyway: `commit` is idempotent, so run it regardless and let the
  // wipe be the decoration it is.
  transition.finished.catch(() => {}).finally(cleanUp);
  window.setTimeout(() => {
    commit();
    cleanUp();
  }, 600);
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
