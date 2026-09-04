import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * A plain GET form — no client JS. The address resolves to an area server-side
 * on /kitchens. Landmarks are valid input; never require a map pin.
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
  return (
    <form
      action={action}
      method="get"
      className={cn(
        "bg-surface border-border rounded-pill gap-sm flex items-center border p-xs pl-lg",
        className,
      )}
    >
      <label htmlFor={name} className="sr-only">
        {placeholder}
      </label>
      <input
        id={name}
        name={name}
        required
        autoComplete="street-address"
        placeholder={placeholder}
        className="text-body-med text-text placeholder:text-text-tertiary min-w-0 flex-1 bg-transparent outline-none"
      />
      <Button type="submit" size="sm" variant="accent">
        {submitLabel}
      </Button>
    </form>
  );
}
