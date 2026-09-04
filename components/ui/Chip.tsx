import { cn } from "@/lib/cn";

type Tone = "default" | "selected" | "danger";

const tones: Record<Tone, string> = {
  default: "bg-surface-raised text-text",
  selected: "bg-accent text-on-accent",
  danger: "bg-danger-bg text-danger-text",
};

export function Chip({
  tone = "default",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-pill text-label inline-flex items-center gap-xs px-md py-sm",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
