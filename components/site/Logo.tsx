import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("text-h2 font-light tracking-[-0.03em]", className)}
      aria-label="M-Kart home"
    >
      m<span className="font-semibold">-kart</span>
    </Link>
  );
}
