"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export function Toggle({
  label,
  defaultChecked = false,
  onCheckedChange,
}: {
  label: string;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => {
        setChecked(!checked);
        onCheckedChange?.(!checked);
      }}
      className={cn(
        "relative h-[20px] w-[35px] shrink-0 rounded-pill transition-colors duration-(--duration-fast)",
        checked ? "bg-accent" : "bg-border-strong",
      )}
    >
      <span
        className={cn(
          "absolute top-[2.5px] size-[15px] rounded-full transition-all duration-(--duration-fast)",
          checked ? "right-[2.5px] bg-on-accent" : "left-[2.5px] bg-knob",
        )}
      />
    </button>
  );
}
