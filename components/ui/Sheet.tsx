"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export function Sheet({
  open,
  onClose,
  title,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="bg-scrim absolute inset-0"
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "bg-bg relative rounded-t-sheet px-screen-x pt-md pb-lg outline-none",
          className,
        )}
      >
        <div className="bg-border-strong rounded-pill mx-auto mb-md h-1 w-[34px]" />
        <h2 className="text-h2 mb-md">{title}</h2>
        {children}
      </div>
    </div>
  );
}
