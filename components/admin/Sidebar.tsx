"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { SHIFT, formatClock } from "@/lib/admin/shift";
import { isCurrent, OPS_NAV, type OpsSection } from "@/lib/admin/nav";
import { say } from "@/lib/admin/store";
import type { AdminUser } from "@/lib/admin/types";
import type { OpsTheme } from "@/lib/admin/theme";

import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./Wordmark";

/** Matches the row height (40px) plus the gap (2px), so the pill lands on
 *  each item exactly. Change one and change the other. */
const ROW_PITCH = 42;

export type NavCounts = { kitchens: number; riders: number; issues: number };

export function Sidebar({
  admin,
  theme,
  signOut,
  counts,
  nowMinutes,
  onDismiss,
}: {
  admin: AdminUser;
  /** Waiting kitchens, riders and open tickets, from the server. */
  counts: NavCounts;
  /** Lagos minutes past midnight when this was rendered. */
  nowMinutes: number;
  theme: OpsTheme;
  /** A server action — the cookie is httpOnly and only the server can clear it. */
  signOut: () => Promise<void>;
  /** Closes the drawer on a phone. Absent on a desktop, where the sidebar is
   *  a permanent column and there is nothing to close. */
  onDismiss?: () => void;
}) {
  const pathname = usePathname();
  const currentIndex = OPS_NAV.findIndex((s) => isCurrent(s.href, pathname));

  return (
    /* Only the list of sections scrolls. On a laptop the nav, the theme toggle,
       the shift card and the account card together are taller than the
       viewport; the header and footer stay put and the nav takes the
       remaining height, so the account card is never cut off and Sign out
       is always in reach. */
    <aside className="border-text/7 sticky top-0 flex h-screen flex-col overflow-hidden border-r px-3.5 py-[22px]">
      <div className="flex shrink-0 items-center justify-between gap-2 px-2 pb-[26px]">
        <Wordmark />
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Close menu"
            className="text-text/55 -mr-1 grid size-9 flex-none place-items-center rounded-full md:hidden"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden fill="none">
              <path
                d="M1 1l13 13M14 1L1 14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="-mx-1 min-h-0 flex-1 overflow-y-auto overscroll-contain px-1">
        <nav className="relative flex flex-col gap-0.5">
          {currentIndex >= 0 && (
            <span
              aria-hidden
              className={cn(
                "bg-accent pointer-events-none absolute inset-x-0 top-0 h-10 rounded-pill",
                "shadow-[0_8px_18px_-10px_rgba(198,244,50,.6)]",
                "transition-transform duration-[450ms] ease-[cubic-bezier(.2,.8,.2,1)]",
              )}
              style={{ transform: `translateY(${currentIndex * ROW_PITCH}px)` }}
            />
          )}
          {OPS_NAV.map((section) => (
            <NavRow
              key={section.href}
              section={section}
              current={isCurrent(section.href, pathname)}
              badge={section.badge ? counts[section.badge] : 0}
              onDismiss={onDismiss}
            />
          ))}
        </nav>
      </div>

      <div className="shrink-0">
        <div className="mt-2 mb-2">
          <ThemeToggle theme={theme} />
        </div>

        <ShiftCard nowMinutes={nowMinutes} onDuty={admin.name} />

        <div className="border-text/8 mt-2 flex flex-wrap items-center gap-2.5 rounded-[15px] border px-3.5 py-3">
          <span className="bg-accent-warm text-on-accent grid size-[34px] flex-none place-items-center rounded-full text-[13px] font-extrabold">
            {admin.initials}
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <span className="text-text truncate text-[13px] font-semibold">
              {admin.name}
            </span>
            <span
              className={cn(
                "text-[10.5px] font-semibold tracking-[0.08em] whitespace-nowrap uppercase",
                admin.role === "SUPER_ADMIN" ? "text-accent-text" : "text-text/62",
              )}
            >
              {admin.role === "SUPER_ADMIN" ? "Super admin" : "Moderator"}
            </span>
          </span>
          <form action={signOut} className="w-full">
            <button
              type="submit"
              className="border-text/10 text-text/62 h-[34px] w-full rounded-pill border text-[12px] font-semibold"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

function NavRow({
  section,
  current,
  badge,
  onDismiss,
}: {
  section: OpsSection;
  current: boolean;
  badge: number;
  /** Tapping a section should take you there, not leave the drawer sitting
   *  open over the thing you asked for. */
  onDismiss?: () => void;
}) {
  const className = cn(
    "ops-nav-item",
    "relative flex h-10 items-center justify-between gap-2.5 rounded-pill px-3.5",
    "text-left text-[14px] transition-colors duration-(--duration-slow)",
    current
      ? "text-on-accent font-bold"
      : section.later
        ? "text-text/50 font-medium"
        : "text-text font-medium",
  );

  const inner = (
    <>
      <span className="whitespace-nowrap">{section.label}</span>
      {badge > 0 && !section.later && (
        <span className="bg-danger text-ops-surface min-w-[22px] rounded-pill px-[7px] text-center text-[11px]/[20px] font-bold">
          {badge}
        </span>
      )}
      {section.later && (
        <span className="text-text/40 text-[10.5px] font-medium">next</span>
      )}
    </>
  );

  if (section.later) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => {
          say(`${section.label} is in the next round`);
          onDismiss?.();
        }}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link
      href={section.href}
      className={className}
      aria-current={current && "page"}
      onClick={onDismiss}
    >
      {inner}
    </Link>
  );
}

/** How much of the shift is left. The bar is the clock a dispatcher actually
 *  watches — everything else on the screen is about right now. */
function ShiftCard({ onDuty, nowMinutes }: { onDuty: string; nowMinutes: number }) {
  const elapsed = nowMinutes - SHIFT.startMinutes;
  const length = SHIFT.endMinutes - SHIFT.startMinutes;
  const remaining = Math.max(0, length - elapsed);
  const percent = Math.min(100, Math.max(0, (elapsed / length) * 100));

  return (
    <div className="bg-ops-surface flex flex-col gap-2 rounded-[15px] p-3.5">
      <span className="text-text/55 text-[11px] font-semibold tracking-[0.1em] uppercase">
        Shift
      </span>
      <span className="text-text text-[14px] font-semibold">
        {formatClock(SHIFT.startMinutes)} – {formatClock(SHIFT.endMinutes)} WAT
      </span>
      <div className="bg-text/10 h-1.5 overflow-hidden rounded-pill">
        <div
          className="bg-accent h-full rounded-pill"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-text/62 text-[12.5px] font-light">
        {Math.floor(remaining / 60)} h {remaining % 60} min left · {onDuty} on duty
      </span>
    </div>
  );
}
