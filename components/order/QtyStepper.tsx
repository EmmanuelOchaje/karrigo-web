import { cn } from "@/lib/cn";

/** − qty + . `dark` is the menu row's version; `light` sits in the cart. */
export function QtyStepper({
  qty,
  name,
  onAdd,
  onRemove,
  tone = "dark",
}: {
  qty: number;
  name: string;
  onAdd: () => void;
  onRemove: () => void;
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";
  return (
    <div
      data-theme={dark ? "dark" : undefined}
      className={cn(
        "rounded-pill flex shrink-0 items-center gap-xs p-xs",
        dark ? "bg-bg pop" : "bg-surface-raised",
      )}
    >
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove one ${name}`}
        className={cn(
          "grid place-items-center rounded-full font-bold active:scale-90",
          dark ? "bg-text/10 text-text size-[36px] text-h2" : "bg-knob size-[30px] text-h3",
        )}
      >
        −
      </button>
      <span
        aria-live="polite"
        className={cn(
          "min-w-[24px] text-center font-extrabold",
          dark ? "text-accent-text text-h3" : "text-h3",
        )}
      >
        {qty}
      </span>
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Add one ${name}`}
        className={cn(
          "bg-accent text-on-accent grid place-items-center rounded-full font-bold active:scale-90",
          dark ? "size-[36px] text-h2" : "size-[30px] text-h3",
        )}
      >
        +
      </button>
    </div>
  );
}
