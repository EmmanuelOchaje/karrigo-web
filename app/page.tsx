import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { AddressForm } from "@/components/site/AddressForm";
import { KitchenCard } from "@/components/site/KitchenCard";
import { HeroPhones } from "@/components/site/HeroPhones";
import { FaqList } from "@/components/site/FaqList";
import { RiderIllustration } from "@/components/site/RiderIllustration";
import { Screen } from "@/components/ui/Screen";
import { ButtonLink } from "@/components/ui/Button";
import {
  kitchens,
  heroStats,
  steps,
  benefits,
  riderSteps,
} from "@/lib/fixtures";

export default function HomePage() {
  const openKitchens = kitchens.filter((k) => !k.closedUntil).slice(0, 3);

  return (
    <>
      <SiteNav mode="dark" />

      {/* Hero — dark, one action above the fold: type where you are. */}
      <Screen mode="dark">
        <div className="px-screen-x gap-xxl mx-auto grid min-h-[90svh] max-w-[1100px] items-center py-xxl md:grid-cols-[1.05fr_.95fr]">
          <div>
            <h1 className="text-hero-small md:text-hero rise">
              Makurdi eats.
              <br />
              <span className="text-accent-text">We deliver.</span>
            </h1>

            <p className="text-lede text-text-secondary rise rise-1 mt-lg max-w-[44ch]">
              Order from kitchens around you and follow your rider from the pot to
              your gate.
            </p>

            <AddressForm className="rise rise-2 mt-xl max-w-[28rem]" />

            <p className="text-site-label text-text-tertiary rise rise-3 mt-md">
              No street address? A landmark works — our riders know Makurdi.
            </p>

            <dl className="border-border rise rise-4 mt-xl gap-xl flex flex-wrap border-t pt-lg">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-stat text-accent-text">{stat.value}</dt>
                  <dd className="text-site-label text-text-secondary">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* The product itself, not a stock mockup. */}
          <div className="justify-self-center md:justify-self-end">
            <HeroPhones />
          </div>
        </div>
      </Screen>

      {/* Real kitchens, real prices, on the marketing page. */}
      <section className="px-screen-x mx-auto w-full max-w-[1100px] py-xxl">
        <p className="text-eyebrow text-text-tertiary rise uppercase">Open right now</p>
        <h2 className="text-section-small md:text-section rise rise-1 mt-xs">
          Kitchens in Makurdi
        </h2>

        <div className="gap-md rise rise-2 mt-lg grid sm:grid-cols-2 md:grid-cols-3">
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
          <p className="text-eyebrow text-text-tertiary uppercase">How it works</p>
          <h2 className="text-section-small md:text-section mt-xs">
            Four steps, no app needed
          </h2>

          <ol className="gap-lg mt-lg grid sm:grid-cols-2 md:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="bg-accent text-on-accent grid size-[30px] place-items-center rounded-[8px] text-base font-bold">
                  {index + 1}
                </span>
                <h3 className="text-h2 mt-sm">{step.title}</h3>
                <p className="text-site-body text-text-secondary mt-xs">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why us — the reasons that are specific to Makurdi, not generic. */}
      <section className="px-screen-x mx-auto w-full max-w-[1100px] py-xxl">
        <p className="text-eyebrow text-text-tertiary uppercase">Why M-Kart</p>
        <h2 className="text-section-small md:text-section mt-xs">
          Built for how Makurdi actually orders
        </h2>

        <div className="gap-lg mt-lg grid sm:grid-cols-2 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title}>
              <div className="bg-surface grid size-[44px] place-items-center rounded-[12px] text-xl">
                {benefit.icon}
              </div>
              <h3 className="text-h2 mt-sm">{benefit.title}</h3>
              <p className="text-site-body text-text-secondary mt-xs">
                {benefit.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Riders — cards on the left, the illustration on the right. */}
      <section className="px-screen-x mx-auto w-full max-w-[1100px] py-xxl">
        <p className="text-eyebrow text-text-tertiary uppercase">Ride with us</p>
        <h2 className="text-section-small md:text-section mt-xs">
          Earn on your own hours
        </h2>
        <p className="text-lede text-text-secondary mt-sm max-w-[52ch]">
          If you know Makurdi roads, you already have the hard part. Three steps
          to your first delivery.
        </p>

        <div className="gap-lg mt-lg grid md:grid-cols-2">
          <ol className="gap-md flex flex-col">
            {riderSteps.map((step) => (
              <li
                key={step.title}
                className="border-border rounded-card gap-md p-md flex border"
              >
                <span className="bg-surface grid size-[38px] shrink-0 place-items-center rounded-[10px] text-lg">
                  {step.icon}
                </span>
                <div>
                  <h3 className="text-h2">{step.title}</h3>
                  <p className="text-site-body text-text-secondary mt-xs">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="bg-surface rounded-card p-lg grid place-items-center">
            <RiderIllustration className="w-full" />
          </div>
        </div>

        <ButtonLink href="/partners#riders" variant="dark" className="mt-lg">
          Apply to ride
        </ButtonLink>
      </section>

      {/* Two audiences, one band. Concrete terms, not "join our platform". */}
      <section className="grid md:grid-cols-2">
        <Screen mode="dark" className="px-screen-x py-xxl">
          <div className="mx-auto max-w-[34rem] md:ml-auto md:mr-0 md:max-w-[26rem]">
            <h2 className="text-section-small md:text-section">Put your kitchen on M-Kart</h2>
            <p className="text-lede text-text-secondary mt-sm">
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
                <li key={item} className="text-site-body gap-sm flex">
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
            <h2 className="text-section-small md:text-section">Ride with M-Kart</h2>
            <p className="text-lede mt-sm opacity-80">
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
                <li key={item} className="text-site-body gap-sm flex">
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

      <section className="bg-surface">
        <div className="px-screen-x mx-auto max-w-[1100px] py-xxl">
          <p className="text-eyebrow text-text-tertiary uppercase">Questions</p>
          <h2 className="text-section-small md:text-section mt-xs">
            Things people ask us
          </h2>
          <FaqList />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
