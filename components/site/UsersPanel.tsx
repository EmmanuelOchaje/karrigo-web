import { growthStats } from "@/lib/fixtures";
import { CountUp } from "@/components/site/CountUp";
import { Eyebrow } from "@/components/site/Eyebrow";

/**
 * Social proof, in two numbers. Lime is a fill here with near-black type on
 * it, never lime type on a light ground. The counters run from 0 on scroll.
 */
export function UsersPanel() {
  return (
    <div className="bg-accent text-on-accent rounded-panel-lg p-xxl md:p-pad-panel relative mx-auto max-w-[1240px] overflow-hidden">
      <div
        aria-hidden
        className="bg-accent-warm/22 pointer-events-none absolute top-[-80px] right-[-80px] size-[260px] rounded-full"
      />
      <div
        aria-hidden
        className="border-on-accent/20 pointer-events-none absolute bottom-[-140px] left-[30%] size-[320px] rounded-full border-[1.5px]"
      />

      <Eyebrow className="relative">Growing every day</Eyebrow>

      <div className="gap-xxl md:gap-gap-wide relative mt-xl grid sm:grid-cols-2">
        {growthStats.map((stat) => (
          <div key={stat.key} className="min-w-0">
            <CountUp
              value={stat.value}
              className="text-section md:text-hero block"
            />
            <p className="text-panel-small md:text-card-title mt-md text-balance">
              {stat.label}
            </p>
            <span className="bg-on-accent text-accent rounded-pill px-md py-xs text-site-chip mt-md inline-block">
              {stat.gain}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
