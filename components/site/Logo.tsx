import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "text-logo gap-xs inline-flex items-baseline",
        className,
      )}
      aria-label="M-Kart home"
    >
      m
      <span aria-hidden className="bg-accent block size-[6px] rounded-full" />
      kart
    </Link>
  );
}
