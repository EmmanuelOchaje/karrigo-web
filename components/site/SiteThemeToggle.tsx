"use client";

import { useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";
import { SITE_THEME_KEY, type SiteTheme } from "@/lib/site-theme";

/** The page's palette lives on <html data-theme>. Reading it from there, not
 *  from React state, keeps the button honest after the pre-paint script has
 *  already switched it, and in step across every toggle on the page. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const read = (): SiteTheme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

function apply(next: SiteTheme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(SITE_THEME_KEY, next);
  } catch {
    // Private mode or blocked storage: the choice just won't outlive the tab.
  }
}

/** Sun or moon, whichever the next press will switch to. */
export function SiteThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as SiteTheme);
  const next: SiteTheme = theme === "dark" ? "light" : "dark";

  function toggle() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) return apply(next);
    document.startViewTransition(() => apply(next));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={cn(
        "text-text/72 hover:bg-text/10 hover:text-text rounded-pill grid size-9 shrink-0 place-items-center transition-colors duration-(--duration-fast)",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {theme === "dark" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        )}
      </svg>
    </button>
  );
}
