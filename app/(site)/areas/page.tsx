import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";
import { PageBody, PageIntro } from "@/components/site/PageIntro";
import { areasComingNext } from "@/lib/fixtures";
import { listAreaNames } from "@/lib/shop/areas";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Areas we cover — Karrigo",
  description: "The neighbourhoods Karrigo delivers to, and the ones coming next.",
};

export const revalidate = 300;

const TONES = [
  "bg-accent text-on-accent",
  "bg-knob text-on-accent",
  "border-[1.5px] border-text/28 text-text",
  "bg-accent-warm text-on-accent",
] as const;

export default async function AreasPage() {
  const areas = await listAreaNames();

  return (
    <PageBody>
      <PageIntro eyebrow="Where we deliver" title={`${areas.length} areas of Makurdi, and growing`}>
        We open a new area only when we have enough riders to serve it properly, rather than taking
        orders we cannot deliver.
      </PageIntro>

      <ul className="gap-sm mt-xxl rise rise-3 flex flex-wrap">
        {areas.map((name, i) => (
          <li
            key={name}
            className={cn("rounded-pill px-xl py-md text-site-title md:text-h1 font-bold", TONES[i % TONES.length])}
          >
            {name}
          </li>
        ))}
      </ul>

      <section className="bg-bg rounded-panel-sm p-xl md:p-pad-card mt-xxl">
        <h2 className="text-site-title">Coming next</h2>
        <ul className="text-site-answer text-text-secondary mt-md gap-xs flex flex-col">
          {areasComingNext.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
        <p className="text-site-answer text-text-secondary mt-lg max-w-[56ch]">
          Not on either list? Give us a landmark when you order and we will tell you straight away
          whether we reach you.
        </p>
      </section>

      <div className="mt-xxl">
        <ButtonLink href="/kitchens" variant="dark" size="site">
          See what&rsquo;s near me
        </ButtonLink>
      </div>
    </PageBody>
  );
}
