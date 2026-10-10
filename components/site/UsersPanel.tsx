import { CountUp } from "@/components/site/CountUp";
import { Eyebrow } from "@/components/site/Eyebrow";
import { growthStats } from "@/lib/fixtures";

/**
 * Social proof, in two numbers. Lime is a fill here with near-black type on
 * it, never lime type on a light ground. The counters run from 0 on scroll.
 */
export function UsersPanel({
  users,
  downloads,
}: {
  users?: number;
  downloads?: number | null;
}) {
  const stats =
    users === undefined
      ? [...growthStats]
      : [
          { key: "users", label: "People ordering on Karrigo", value: users, gain: null },
          ...(downloads == null
            ? []
            : [{ key: "downloads", label: "App downloads", value: downloads, gain: null }]),
        ];

  return (
    <div className="bg-accent text-on-accent rounded-panel-lg p-xl md:p-pad-card relative mx-auto max-w-[1240px] overflow-hidden">
      <div
        aria-hidden
        className="bg-accent-warm/22 pointer-events-none absolute top-[-54px] right-[-54px] size-[174px] rounded-full"
      />
      <div
        aria-hidden
        className="border-on-accent/20 pointer-events-none absolute bottom-[-94px] left-[30%] size-[214px] rounded-full border-[1.5px]"
      />

      <Eyebrow className="relative">Growing every day</Eyebrow>

      <div className="gap-xl md:gap-xxl relative mt-lg grid sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.key} className="min-w-0">
            <CountUp
              value={stat.value}
              className="text-hero-small md:text-section block"
            />
            <p className="text-display md:text-panel-small mt-sm text-balance">
              {stat.label}
            </p>
            {stat.gain && (
              <span className="bg-on-accent text-accent rounded-pill px-md py-xs text-site-chip mt-sm inline-block">
                {stat.gain}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
