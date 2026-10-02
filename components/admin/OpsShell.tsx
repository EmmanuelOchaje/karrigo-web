"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import type { AdminUser } from "@/lib/admin/types";
import type { OpsTheme } from "@/lib/admin/theme";

import { Sidebar, type NavCounts } from "./Sidebar";
import { Wordmark } from "./Wordmark";

/**
 * The shell, at both sizes.
 *
 * On a desktop the sidebar is a column of the grid and always there — a
 * dispatcher needs the badge counts in their peripheral vision all shift.
 * On a phone there is no room for that, so the same sidebar becomes a drawer
 * over the content, and the counts move to the top bar so nothing that needs
 * attention is hidden behind a closed menu.
 *
 * It is one `<Sidebar>` in both cases, not two components that drift apart.
 */
export function OpsShell({
  admin,
  theme,
  signOut,
  counts,
  nowMinutes,
  children,
}: {
  admin: AdminUser;
  counts: NavCounts;
  nowMinutes: number;
  theme: OpsTheme;
  signOut: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const drawer = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    // The board behind the drawer must not scroll under your thumb.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus lands inside the drawer so a keyboard or screen reader follows it
    // open; it goes back to the button on close. Captured now — by cleanup the
    // ref may point somewhere else.
    drawer.current?.focus();
    const opener = trigger.current;

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      opener?.focus();
    };
  }, [open]);

  return (
    <div
      data-ops-drawer={open ? "open" : "closed"}
      className="md:grid md:min-h-screen md:grid-cols-[clamp(196px,17vw,232px)_minmax(0,1fr)]"
    >
      <header className="border-text/7 bg-ops-bg sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4 md:hidden">
        <button
          ref={trigger}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="ops-drawer"
          className="text-text -ml-1 grid size-9 flex-none place-items-center rounded-full"
        >
          <MenuIcon />
        </button>
        <Wordmark size={26} />
      </header>

      {/* Scrim. Always mounted so it can fade rather than blink. */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "bg-scrim fixed inset-0 z-40 md:hidden",
          "transition-opacity duration-(--duration-slow)",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        id="ops-drawer"
        ref={drawer}
        tabIndex={-1}
        role="dialog"
        aria-modal={open}
        aria-label="Sections"
        className={cn(
          "ops-drawer",
          "fixed inset-y-0 left-0 z-50 w-[min(82vw,290px)] outline-none",
          "bg-ops-bg shadow-[8px_0_40px_-12px_rgba(0,0,0,0.55)]",
          // The curve matters more than the duration: it leaves fast and
          // arrives slowly, which is what makes a drawer feel attached to
          // your thumb rather than animated at you.
          "transition-transform duration-[420ms] ease-[cubic-bezier(.32,.72,0,1)]",
          open ? "translate-x-0" : "-translate-x-full",
          // Back to being an ordinary grid column on a desktop.
          "md:static md:z-auto md:w-auto md:translate-x-0 md:shadow-none md:transition-none",
        )}
      >
        <Sidebar
          admin={admin}
          theme={theme}
          signOut={signOut}
          counts={counts}
          nowMinutes={nowMinutes}
          onDismiss={() => setOpen(false)}
        />
      </div>

      <main data-ops-main className="min-w-0">
        {children}
      </main>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden fill="none">
      {[1, 7, 13].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="20"
          y2={y}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
