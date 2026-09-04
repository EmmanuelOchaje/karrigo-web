import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { AddressForm } from "@/components/site/AddressForm";
import { KitchenCard } from "@/components/site/KitchenCard";
import { Screen } from "@/components/ui/Screen";
import { ButtonLink } from "@/components/ui/Button";
import { kitchens, heroStats, steps } from "@/lib/fixtures";

export default function HomePage() {
  const openKitchens = kitchens.filter((k) => !k.closedUntil).slice(0, 3);

  return (
    <>
      <SiteNav mode="dark" />

      {/* Hero — dark, one action above the fold: type where you are. */}
      <Screen mode="dark">
        <div className="px-screen-x gap-xxl mx-auto grid max-w-[1100px] items-center py-xxl md:grid-cols-[1.05fr_.95fr]">
          <div>
            <h1 className="text-[2.35rem] leading-[1.02] font-semibold tracking-[-0.05em]">
              Makurdi eats.
              <br />
              <span className="text-accent-text">We deliver.</span>
            </h1>

            <p className="text-body text-text-secondary mt-md max-w-[44ch]">
              Order from kitchens around you and follow your rider from the pot to
              your gate.
            </p>

            <AddressForm className="mt-xl max-w-[26rem]" />

            <p className="text-caption text-text-tertiary mt-sm">
              No street address? A landmark works — our riders know Makurdi.
            </p>

            <dl className="border-border mt-xl gap-xl flex flex-wrap border-t pt-lg">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-h2 text-accent-text">{stat.value}</dt>
                  <dd className="text-caption text-text-secondary">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* The product itself, not a stock mockup. */}
          <div className="justify-self-center md:justify-self-end">
            <div className="border-surface-raised w-[220px] overflow-hidden rounded-[28px] border-[6px]">
              <Screen mode="light">
                <div className="border-border px-md border-b py-sm">
                  <div className="text-caption gap-xs flex items-center font-semibold">
                    <span className="bg-accent text-on-accent grid size-[18px] place-items-center rounded-[6px] text-[8px]">
                      ⌖
                    </span>
                    Behind BSU main gate
                  </div>
                </div>
                <div className="px-md py-sm">
                  {kitchens.slice(0, 4).map((kitchen) => (
                    <div
                      key={kitchen.slug}
                      className="border-border gap-sm flex items-center border-b py-sm last:border-b-0"
                    >
                      <div className="bg-surface grid size-[32px] place-items-center rounded-[8px] text-sm">
                        {kitchen.emoji}
                      </div>
                      <div>
                        <div className="text-micro font-semibold">{kitchen.name}</div>
                        <div className="text-micro text-text-secondary">
                          {kitchen.distanceKm} km · {kitchen.etaMinutes[0]}–
                          {kitchen.etaMinutes[1]} min
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Screen>
            </div>
          </div>
        </div>
      </Screen>

      {/* Real kitchens, real prices, on the marketing page. */}
      <section className="px-screen-x mx-auto w-full max-w-[1100px] py-xxl">
        <p className="text-label text-text-tertiary tracking-[0.12em] uppercase">
          Open right now
        </p>
        <h2 className="text-h1 mt-xs">Kitchens in Makurdi</h2>

        <div className="gap-md mt-lg grid sm:grid-cols-2 md:grid-cols-3">
          {openKitchens.map((kitchen) => (
            <KitchenCard key={kitchen.slug} kitchen={kitchen} />
          ))}
        </div>

        <ButtonLink href="/kitchens" variant="outline" className="mt-lg">
          See all kitchens
        </ButtonLink>
      </section>

      <section className="bg-surface">
        <div className="px-screen-x mx-auto max-w-[1100px] py-xxl">
          <p className="text-label text-text-tertiary tracking-[0.12em] uppercase">
            How it works
          </p>
          <h2 className="text-h1 mt-xs">Four steps, no app needed</h2>

          <ol className="gap-lg mt-lg grid sm:grid-cols-2 md:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="bg-accent text-on-accent grid size-[26px] place-items-center rounded-[8px] text-sm font-bold">
                  {index + 1}
                </span>
                <h3 className="text-h3 mt-sm">{step.title}</h3>
                <p className="text-caption text-text-secondary mt-xs">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Two audiences, one band. Concrete terms, not "join our platform". */}
      <section className="grid md:grid-cols-2">
        <Screen mode="dark" className="px-screen-x py-xxl">
          <div className="mx-auto max-w-[34rem] md:ml-auto md:mr-0 md:max-w-[26rem]">
            <h2 className="text-h1">Put your kitchen on M-Kart</h2>
            <p className="text-body text-text-secondary mt-sm">
              You cook. We handle orders, riders and money.
            </p>
            <ul className="mt-md gap-sm flex flex-col">
              {[
                "15% commission, nothing else — no setup fee, no monthly charge",
                "Paid every Friday, straight to your account",
                "We photograph your menu for free",
                "Mark a dish finished yourself, any time",
                "Live within a week of signing",
              ].map((item) => (
                <li key={item} className="text-body-med gap-sm flex">
                  <span aria-hidden className="text-accent-text font-bold">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <ButtonLink href="/partners" variant="accent" full className="mt-lg">
              List your kitchen
            </ButtonLink>
          </div>
        </Screen>

        <div className="bg-accent text-on-accent px-screen-x py-xxl">
          <div className="mx-auto max-w-[34rem] md:mr-auto md:ml-0 md:max-w-[26rem]">
            <h2 className="text-h1">Ride with M-Kart</h2>
            <p className="text-body mt-sm opacity-80">
              Know Makurdi roads? Start earning this week.
            </p>
            <ul className="mt-md gap-sm flex flex-col">
              {[
                "Paid per trip, every Friday",
                "Keep 100% of your tips",
                "Choose your own hours",
                "Bring a bike, a rider's card and a phone",
                "Fuel guarantee during your first two weeks",
              ].map((item) => (
                <li key={item} className="text-body-med gap-sm flex">
                  <span aria-hidden className="font-bold">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <ButtonLink
              href="/partners#riders"
              variant="dark"
              full
              className="mt-lg"
            >
              Apply to ride
            </ButtonLink>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
