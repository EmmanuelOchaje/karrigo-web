import { Screen } from "@/components/ui/Screen";
import { areasLive } from "@/lib/fixtures";
import { cn } from "@/lib/cn";

const tones = {
  accent: "bg-accent text-on-accent",
  white: "bg-knob text-on-accent",
  outline: "border-[1.5px] border-text/28 text-text",
  warm: "bg-accent-warm text-on-accent",
} as const;

/**
 * The coverage promise as one big number and the areas themselves, scattered
 * as pills. Replaces the old live-tracking panel: the hero phones already show
 * tracking, and "do you reach me?" is the question people arrive with.
 */
export function AreasPanel() {
  return (
    <Screen
      mode="dark"
      className="rounded-panel-lg p-xxl md:p-pad-panel gap-xxl md:gap-gap-wide relative mx-auto grid max-w-[1240px] items-center overflow-hidden lg:grid-cols-2"
    >
      <div
        aria-hidden
        className="border-accent-warm/30 pointer-events-none absolute right-[-140px] bottom-[-200px] size-[480px] rounded-full border-[1.5px]"
      />

      <div className="gap-lg relative flex min-w-0 items-end">
        <div
          aria-hidden
          className="text-accent-text text-big-number-small lg:text-big-number"
        >
          {areasLive.length}
        </div>
        <div className="min-w-0 pb-xs">
          <h2 className="text-panel-small md:text-card-title text-balance">
            <span className="sr-only">{areasLive.length} </span>
            areas of Makurdi, one flat fee
          </h2>
          <p className="text-site-body text-text/66 mt-md max-w-[30ch] text-pretty">
            ₦500 delivery anywhere we cover. About 29 minutes on average.
          </p>
        </div>
      </div>

      <div className="gap-sm relative flex min-w-0 flex-wrap">
        {areasLive.map((area) => (
          <span
            key={area.name}
            className={cn(
              "rounded-pill px-xl py-md text-site-title md:text-h1 font-bold",
              tones[area.tone],
            )}
            style={{ rotate: `${area.tilt}deg` }}
          >
            {area.name}
          </span>
        ))}
        <p className="text-site-answer text-text/60 mt-sm w-full">
          Not on the list? Drop your landmark and we&rsquo;ll tell you when we
          reach you.
        </p>
      </div>
    </Screen>
  );
}
