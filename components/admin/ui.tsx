import Link from "next/link";

import { cn } from "@/lib/cn";
import { PageSizeSelect } from "./PageSizeSelect";

/**
 * The small pieces every ops screen is built from. Ops is a dense, plain
 * surface — these stay closer to a spreadsheet than the customer app's
 * component library does, which is why they live here rather than in
 * `components/ui`.
 */

export type Tone = "danger" | "warning" | "success" | "info" | "muted";

const toneText: Record<Tone, string> = {
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
  info: "text-info",
  muted: "text-text/72",
};

const toneBg: Record<Tone, string> = {
  danger: "bg-danger-bg",
  warning: "bg-warning-bg",
  success: "bg-success-bg",
  info: "bg-info-bg",
  muted: "bg-text/8",
};

/**
 * A status pill. Each tone carries a different shape as well as a different
 * colour — square for trouble, triangle for a warning, a filled dot for
 * settled or moving, a hollow ring for something inert. Around 1 in 12 men
 * has some form of colour blindness, and this is a board people scan at a
 * glance all day.
 */
export function StatusChip({
  tone,
  children,
  className,
}: {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill py-1 pr-2.5 pl-2",
        "text-[12px]/none font-semibold whitespace-nowrap",
        toneBg[tone],
        toneText[tone],
        className,
      )}
    >
      <ToneMark tone={tone} />
      {children}
    </span>
  );
}

function ToneMark({ tone }: { tone: Tone }) {
  if (tone === "danger") {
    return <span aria-hidden className="size-[7px] rounded-[1px] bg-current" />;
  }
  if (tone === "warning") {
    return (
      <span
        aria-hidden
        className="size-0 border-x-4 border-b-[7px] border-x-transparent border-b-current"
      />
    );
  }
  if (tone === "muted") {
    return (
      <span
        aria-hidden
        className="size-2 rounded-full border-[1.5px] border-current"
      />
    );
  }
  return <span aria-hidden className="size-[7px] rounded-full bg-current" />;
}

/** A card on the ops ground. White in light mode, a step up from black in
 *  dark — see the `ops*` note in theme.ts. */
export function Panel({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("bg-ops-surface rounded-card p-lg", className)}
      {...props}
    >
      {children}
    </section>
  );
}

export function PanelHeading({
  title,
  meta,
  action,
}: {
  title: string;
  meta?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-lg flex items-baseline justify-between gap-md">
      <div className="flex items-baseline gap-md">
        <h2 className="text-text text-[16px] font-bold tracking-[-0.02em]">
          {title}
        </h2>
        {meta && <p className="text-text/55 text-[12.5px] font-light">{meta}</p>}
      </div>
      {action}
    </header>
  );
}

/** The uppercase micro-label above a number or a field value. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-text/55 text-[11px] font-semibold tracking-[0.1em] uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A counted tab, as used over every queue: Active 7, Late 2, Delivered 2. */
export function CountTab({
  label,
  count,
  selected,
  onClick,
}: {
  label: string;
  count: number | string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex h-8 items-center gap-2 rounded-pill px-3.5 text-[12.5px] font-semibold",
        selected ? "bg-accent text-on-accent" : "bg-text/7 text-text",
      )}
    >
      {label}
      <span className={cn(selected ? "text-on-accent/60" : "text-text/55")}>
        {count}
      </span>
    </button>
  );
}

/**
 * Every list has a loading state, an empty state and an error state
 * (CLAUDE.md conventions). This is the empty one, and it says what would put
 * something here rather than just "no results".
 */
export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-lg py-[52px] text-center">
      <p className="text-text text-[15px] font-semibold">{title}</p>
      <p className="text-text/55 max-w-[38ch] text-[13px] font-light">{text}</p>
      {action}
    </div>
  );
}

/** A grey block standing in for content that has not arrived. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("bg-text/7 animate-pulse rounded-[10px]", className)}
    />
  );
}

/** A filter tab that is a real link — `?status=` in the URL, so every view
 *  is shareable and server-rendered. Same look as `CountTab`. */
export function LinkTab({
  href,
  label,
  count,
  selected,
}: {
  href: string;
  label: string;
  count?: number | string;
  selected: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={selected ? "page" : undefined}
      className={cn(
        "flex h-8 items-center gap-2 rounded-pill px-3.5 text-[12.5px] font-semibold",
        selected ? "bg-accent text-on-accent" : "bg-text/7 text-text",
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn(selected ? "text-on-accent/60" : "text-text/55")}>{count}</span>
      )}
    </Link>
  );
}

/** Previous / next over a paged list, as links. */
export function Pager({
  page,
  pageSize,
  total,
  href,
  previous = "← Newer",
  next = "Older →",
  sizes,
  sizeHref,
}: {
  page: number;
  pageSize: number;
  total: number;
  href: (page: number) => string;
  /** Labels for lists that aren't newest-first. */
  previous?: string;
  next?: string;
  /** Row counts to offer, with a link for each. Leave out for a fixed size. */
  sizes?: number[];
  sizeHref?: (size: number) => string;
}) {
  const last = Math.max(1, Math.ceil(total / pageSize));
  // The size choice stays visible even on a single page, otherwise picking
  // "100" on a short list would leave no way back to a smaller page.
  const choosable = sizes && sizeHref && total > Math.min(...sizes);
  if (last <= 1 && !choosable) return null;
  const link = "border-text/16 text-text flex h-8 items-center rounded-pill border px-3.5 text-[12.5px] font-semibold";
  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 px-lg py-3.5" aria-label="Pages">
      {page > 1 ? <Link href={href(page - 1)} className={link}>{previous}</Link> : <span />}
      <span className="text-text/55 text-[12px]">
        Page {page} of {last} · {total} in all
      </span>
      {page < last ? <Link href={href(page + 1)} className={link}>{next}</Link> : <span />}
      {choosable && (
        <div className="flex basis-full justify-center">
          <PageSizeSelect current={pageSize} options={sizes.map((size) => ({ size, href: sizeHref(size) }))} />
        </div>
      )}
    </nav>
  );
}

/** A search box that submits as a plain GET form — works without JS. */
export function SearchBox({
  name = "q",
  defaultValue,
  placeholder,
  hidden,
}: {
  name?: string;
  defaultValue?: string;
  placeholder: string;
  /** Other query params to keep, such as the selected tab. */
  hidden?: Record<string, string | undefined>;
}) {
  return (
    <form role="search" className="ml-auto flex w-[min(280px,100%)]">
      {Object.entries(hidden ?? {}).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label={placeholder}
        className="bg-text/6 text-text placeholder:text-text/45 h-8 w-full rounded-pill px-3.5 text-[12.5px] font-medium outline-none"
      />
    </form>
  );
}
