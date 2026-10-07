"use client";

import { useState } from "react";
import { addressAt } from "@/app/(order)/actions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { say, setDelivery, useOrderState } from "@/lib/order/store";

/**
 * A plain GET form, so it still works before the page's JavaScript arrives.
 * Once it has, every keystroke is saved as the delivery landmark — the hero
 * phone shows it at once, and checkout already has it, however the visitor
 * leaves this page. A saved landmark comes back pre-filled. Landmarks are
 * valid input; never require a map pin.
 */
export function AddressForm({
  action = "/kitchens",
  name = "address",
  placeholder = "Enter your address or a landmark",
  submitLabel = "Find food",
  className,
}: {
  action?: string;
  name?: string;
  placeholder?: string;
  submitLabel?: string;
  className?: string;
}) {
  const { landmark } = useOrderState();
  const [locating, setLocating] = useState(false);

  // Reverse-geocodes through the same backend endpoint checkout uses
  // (`addressAt` → /addresses/reverse-geocode), so a tap here fills the
  // field with real text rather than raw coordinates — no separate pin-drop
  // flow, and it still degrades to typing when location isn't available.
  function useMyLocation() {
    if (!("geolocation" in navigator)) {
      say("This browser can't share its location. Type it instead.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const result = await addressAt(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
        if (result.ok && result.address) {
          setDelivery({ landmark: result.address });
          say("Using your location");
        } else {
          say(result.ok ? "Couldn't name that spot — type it instead." : result.error);
        }
      },
      () => {
        setLocating(false);
        say("No problem — type your landmark instead");
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  return (
    // Always light, whatever it is sitting on: on the dark hero panel the
    // form is the one white thing, and that is what makes it the way in.
    <form
      action={action}
      method="get"
      data-theme="light"
      className={cn(
        "bg-bg rounded-pill gap-sm flex items-center p-xs xl:p-sm shadow-[0_20px_44px_-20px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      <label htmlFor={name} className="sr-only">
        {placeholder}
      </label>
      <span
        aria-hidden
        className="grid w-[36px] flex-none place-items-center"
      >
        <span className="border-text-tertiary block size-[13px] -rotate-45 rounded-[50%_50%_50%_2px] border-2" />
      </span>
      <input
        id={name}
        name={name}
        required
        autoComplete="street-address"
        placeholder={placeholder}
        value={landmark}
        onChange={(e) => setDelivery({ landmark: e.target.value })}
        className="text-body xl:text-site-body text-text placeholder:text-text-secondary min-w-0 flex-1 truncate bg-transparent outline-none"
      />
      <button
        type="button"
        onClick={useMyLocation}
        disabled={locating}
        aria-label="Use my current location"
        title="Use my current location"
        className="text-text-secondary hover:text-text hover:bg-surface grid size-9 flex-none place-items-center rounded-full transition-colors duration-(--duration-fast) disabled:opacity-50"
      >
        {locating ? (
          <span className="border-text-tertiary border-t-text size-[16px] animate-spin rounded-full border-2" />
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden className="size-[18px]">
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <path
              d="M12 2v3M12 19v3M2 12h3M19 12h3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        )}
      </button>
      {/* The hero stacks below xl, so the form spans the full column there:
          a compact button keeps it from reading as a slab on tablet and phone. */}
      <Button type="submit" size="siteCompact" variant="accent">
        {submitLabel}
      </Button>
    </form>
  );
}
