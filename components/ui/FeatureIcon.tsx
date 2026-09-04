import { cn } from "@/lib/cn";

type Tone = "accent" | "muted" | "danger";

const tones: Record<Tone, string> = {
  accent: "bg-accent text-on-accent",
  muted: "bg-surface-raised text-text",
  danger: "bg-danger-bg text-danger-text",
};

export function FeatureIcon({
  tone = "accent",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "size-feature-icon rounded-icon grid shrink-0 place-items-center text-2xl",
        tones[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
