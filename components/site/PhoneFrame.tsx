import { Screen } from "@/components/ui/Screen";
import { cn } from "@/lib/cn";

/**
 * A device mockup for the marketing pages only. Drawn at the true 402×874 of
 * the device and scaled down by whatever transform the caller applies, so the
 * interface inside keeps real type sizes and real proportions — a screen
 * redrawn small always reads as a diagram of an app rather than an app.
 *
 * The bezel, status bar and home indicator are furniture: they are not part of
 * the product design and must never appear inside the app itself.
 */
export function PhoneFrame({
  mode,
  className,
  children,
}: {
  mode: "light" | "dark";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-device h-[874px] w-[402px]",
        // Three rings, not a border: the bezel, a hairline of reflected light
        // on it, and the shadow the pair casts on the panel behind.
        "shadow-[0_0_0_9px_var(--bezel),0_0_0_10.5px_rgba(255,255,255,0.22),0_46px_80px_-34px_rgba(0,0,0,0.95)]",
        className,
      )}
    >
      <Screen
        mode={mode}
        className="rounded-device relative flex h-full flex-col overflow-hidden"
      >
        {/* The dynamic island. Furniture, like the bezel — it is what makes the
            mockup read as a phone rather than as a bordered screenshot. */}
        <span className="bg-bezel rounded-pill absolute top-[12px] left-1/2 h-[34px] w-[124px] -translate-x-1/2" />

        <div className="px-xl text-label flex h-[54px] shrink-0 items-end justify-between pb-xs font-semibold">
          <span>9:41</span>
          <span className="tracking-[0.1em]">▮▮▮ ▰</span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">{children}</div>

        <div className="bg-border-strong rounded-pill mx-auto mb-sm h-[5px] w-[140px] shrink-0" />
      </Screen>
    </div>
  );
}
