import { cn } from "@/lib/cn";

/**
 * The small label above a section heading. Always a pill, always lime type on
 * something dark: a solid near-black one on the page's light ground, and a
 * translucent lime one on the dark panels, where a solid pill would disappear.
 *
 * Both scope themselves to the dark palette so `accentText` resolves to the
 * lime itself rather than to its light-background substitute — the pill is the
 * background here, not the page.
 */
export function Eyebrow({
  tone = "onLight",
  className,
  children,
}: {
  tone?: "onLight" | "onDark";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      data-theme="dark"
      className={cn(
        "text-eyebrow text-accent-text rounded-pill gap-sm inline-flex w-fit items-center px-lg py-xs uppercase",
        tone === "onDark" ? "bg-accent/14" : "bg-bg",
        className,
      )}
    >
      {children}
    </span>
  );
}
