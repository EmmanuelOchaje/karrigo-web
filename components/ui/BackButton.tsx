"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

export function BackButton({
  href,
  label = "Go back",
  className,
}: {
  href?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => (href ? router.push(href) : router.back())}
      className={cn(
        "bg-surface-raised text-text size-back-button",
        "grid place-items-center rounded-full text-[15px] leading-none",
        className,
      )}
    >
      ‹
    </button>
  );
}
