"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const notes = {
  food: "No street address? A landmark works — our riders know the area.",
  groceries:
    "Supermarkets and provision shops near you. Minimum order shown per store.",
} as const;

/**
 * Food/Groceries switch under the hero's address form. Purely cosmetic here
 * — both tabs point at the same "see what's near me" flow — but it sets the
 * tone that groceries is a first-class second half of the product, and the
 * helper line below it changes with the tab, matching the design handoff.
 */
export function HeroTabs({ className }: { className?: string }) {
  const [tab, setTab] = useState<"food" | "groceries">("food");

  return (
    <div className={className}>
      <div className="bg-text/8 border-text/12 rounded-pill gap-xs inline-flex border p-xs">
        <button
          type="button"
          onClick={() => setTab("food")}
          className={cn(
            "rounded-pill px-lg py-sm text-site-chip font-bold transition-colors duration-(--duration-fast)",
            tab === "food"
              ? "bg-accent text-on-accent"
              : "text-cream/70",
          )}
        >
          Food
        </button>
        <button
          type="button"
          onClick={() => setTab("groceries")}
          className={cn(
            "rounded-pill px-lg py-sm text-site-chip font-bold transition-colors duration-(--duration-fast)",
            tab === "groceries"
              ? "bg-accent text-on-accent"
              : "text-cream/70",
          )}
        >
          Groceries
        </button>
      </div>
      <p className="text-site-label text-cream/50 mt-md">{notes[tab]}</p>
    </div>
  );
}
