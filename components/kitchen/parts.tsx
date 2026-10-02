"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

export type Result = { ok: true } | { ok: false; error: string };

export const panel = "bg-bg rounded-panel-sm p-xl md:p-xxl";

const TABS = [
  { href: "/my-kitchen", label: "Today", ownerOnly: false },
  { href: "/my-kitchen/orders", label: "Orders", ownerOnly: false },
  { href: "/my-kitchen/menu", label: "Menu", ownerOnly: false },
  { href: "/my-kitchen/settings", label: "Hours & details", ownerOnly: true },
  { href: "/my-kitchen/money", label: "Money", ownerOnly: true },
  { href: "/my-kitchen/help", label: "Help", ownerOnly: false },
];

/** The console's sections. A row that scrolls sideways on a phone, so every
 *  section is one thumb-reach away and none hides behind a menu. */
export function ConsoleTabs({ owner, waiting }: { owner: boolean; waiting: number }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Kitchen" className="-mx-screen-x px-screen-x gap-xs flex overflow-x-auto pb-xs">
      {TABS.filter((t) => owner || !t.ownerOnly).map((t) => {
        const current = t.href === "/my-kitchen" ? pathname === t.href : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={current ? "page" : undefined}
            className={cn(
              "rounded-pill text-nav-link gap-sm flex shrink-0 items-center px-lg py-sm transition-colors duration-(--duration-fast)",
              current ? "bg-text text-bg" : "bg-bg text-text hover:bg-surface-raised",
            )}
          >
            {t.label}
            {t.href === "/my-kitchen/orders" && waiting > 0 && (
              <span className="bg-accent text-on-accent rounded-pill text-label grid h-[20px] min-w-[20px] place-items-center px-xs font-bold">
                {waiting}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/** A switch big enough to hit with a floury thumb. Controlled: the caller
 *  holds the truth, so a refused change snaps back on its own. */
export function Switch({
  checked,
  label,
  disabled,
  size = "md",
  onAccent = false,
  onChange,
}: {
  checked: boolean;
  label: string;
  disabled?: boolean;
  size?: "md" | "lg";
  /** Sitting on the lime fill, where a lime track would vanish. */
  onAccent?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "rounded-pill relative shrink-0 transition-colors duration-(--duration-fast) disabled:opacity-50",
        size === "lg" ? "h-[40px] w-[72px]" : "h-[28px] w-[48px]",
        checked ? (onAccent ? "bg-on-accent" : "bg-accent") : "bg-border-strong",
      )}
    >
      <span
        className={cn(
          "absolute rounded-full transition-all duration-(--duration-fast)",
          size === "lg" ? "top-[4px] size-[32px]" : "top-[3px] size-[22px]",
          checked ? (onAccent ? "bg-accent" : "bg-on-accent") : "bg-knob",
          size === "lg" ? (checked ? "left-[36px]" : "left-[4px]") : checked ? "left-[23px]" : "left-[3px]",
        )}
      />
    </button>
  );
}

/** A quiet "it worked", for forms that stay on screen after saving. */
export function Saved({ children }: { children: string }) {
  if (!children) return null;
  return (
    <p role="status" className="text-accent-text text-site-label font-semibold">
      ✓ {children}
    </p>
  );
}

export function Empty({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="bg-bg rounded-panel-sm px-xl py-[48px] text-center">
      <p className="text-site-title">{title}</p>
      <p className="text-site-body text-text-secondary mx-auto mt-sm max-w-[44ch]">{text}</p>
      {children && <div className="mt-xl">{children}</div>}
    </div>
  );
}
