import { Screen } from "@/components/ui/Screen";
import { cn } from "@/lib/cn";

/**
 * A device mockup for the marketing pages only. The bezel, status bar and home
 * indicator are furniture — they are not part of the product design and must
 * never appear inside the app itself.
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
        "bg-bezel w-[212px] shrink-0 rounded-[34px] p-[7px] shadow-[0_24px_50px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <Screen
        mode={mode}
        className="flex h-[448px] flex-col overflow-hidden rounded-[27px]"
      >
        <div className="text-micro px-md flex items-center justify-between pt-sm font-semibold">
          <span>9:41</span>
          <span className="tracking-[0.1em]">▮▮▮ ▰</span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">{children}</div>

        <div className="bg-border-strong rounded-pill mx-auto mb-sm h-[3.5px] w-[74px]" />
      </Screen>
    </div>
  );
}
