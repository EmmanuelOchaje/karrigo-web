import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "bg-surface border-border rounded-card shadow-card border p-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
