import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "accent" | "dark" | "outline" | "ghost" | "muted";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  accent: "bg-accent text-on-accent font-semibold",
  dark: "bg-text text-bg font-medium",
  outline: "border-[1.5px] border-border-strong text-text font-medium",
  ghost: "text-text-secondary font-normal",
  muted: "bg-surface-raised text-text font-medium",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-lg text-label",
  md: "h-button-height px-xl text-button",
};

type Props = {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  className?: string;
  children: React.ReactNode;
};

function classes({ variant = "accent", size = "md", full, className }: Props) {
  return cn(
    "inline-flex items-center justify-center gap-sm rounded-pill",
    "transition-colors duration-(--duration-fast)",
    "disabled:opacity-40 disabled:pointer-events-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
    variants[variant],
    sizes[size],
    full && "w-full",
    className,
  );
}

export function Button({
  variant,
  size,
  full,
  className,
  children,
  ...props
}: Props & Omit<React.ComponentProps<"button">, "className" | "children">) {
  return (
    <button
      className={classes({ variant, size, full, className, children })}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  full,
  className,
  children,
  ...props
}: Props & Omit<React.ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link
      className={classes({ variant, size, full, className, children })}
      {...props}
    >
      {children}
    </Link>
  );
}
