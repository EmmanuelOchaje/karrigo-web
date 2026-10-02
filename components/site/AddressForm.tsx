"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { setDelivery, useOrderState } from "@/lib/order/store";

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
      {/* The hero stacks below xl, so the form spans the full column there:
          a compact button keeps it from reading as a slab on tablet and phone. */}
      <Button type="submit" size="siteCompact" variant="accent">
        {submitLabel}
      </Button>
    </form>
  );
}
