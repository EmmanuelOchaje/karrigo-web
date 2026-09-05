import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { AddressForm } from "@/components/site/AddressForm";
import { KitchenCard } from "@/components/site/KitchenCard";
import { HeroPhones } from "@/components/site/HeroPhones";
import { FaqList } from "@/components/site/FaqList";
import { RiderIllustration } from "@/components/site/RiderIllustration";
import { RestaurantPhone, RiderPhone } from "@/components/site/AudiencePhones";
import { DeliveryLocation } from "@/components/site/illustrations/DeliveryLocation";
import { OrderStatus } from "@/components/site/illustrations/OrderStatus";
import { MobilePayments } from "@/components/site/illustrations/MobilePayments";
import { Screen } from "@/components/ui/Screen";
import { ButtonLink } from "@/components/ui/Button";
import {
  kitchens,
  heroStats,
  steps,
  benefitCards,
  riderSteps,
} from "@/lib/fixtures";

export default function HomePage() {
  const openKitchens = kitchens.filter((k) => !k.closedUntil).slice(0, 3);

  return (
    <>
      <SiteNav mode="dark" />

      {/* Hero — dark, one action above the fold: type where you are. */}
      <Screen mode="dark">
        <div className="px-screen-x gap-xxl mx-auto grid min-h-[90svh] max-w-[1100px] items-center py-xxl md:py-section md:grid-cols-[1.05fr_.95fr]">
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
          <div className="justify-self-center">
            <HeroPhones />
          </div>
        </div>
      </Screen>

      {/* Real kitchens, real prices, on the marketing page. */}
      <section className="px-screen-x mx-auto w-full max-w-[1100px] py-xxl md:py-section">
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
        <div className="px-screen-x mx-auto max-w-[1100px] py-xxl md:py-section">
          <p className="text-eyebrow text-text-tertiary uppercase">How it works</p>
          <h2 className="text-section-small md:text-section mt-xs">
            Four steps, no app needed
          </h2>

          <ol className="border-border-strong mt-xl ml-xs border-l">
            {steps.map((step, index) => (
              <li key={step.title} className="pl-xl relative pb-xxl last:pb-0">
                <span className="bg-accent absolute top-[7px] -left-[5.5px] size-[10px] rounded-full" />
                <span className="bg-surface-raised text-accent-text text-label rounded-pill px-sm py-xs inline-block">
                  Step {index + 1}
                </span>
                <h3 className="text-h1 mt-sm">{step.title}</h3>
                <p className="text-site-body text-text-secondary mt-xs max-w-[58ch]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why us — three cards, each ending in its own illustration. */}
      <section className="px-screen-x mx-auto w-full max-w-[1100px] py-xxl md:py-section">
        <p className="text-eyebrow text-text-tertiary uppercase">Why M-Kart</p>
        <h2 className="text-section-small md:text-section mt-xs">
          Built for how Makurdi actually orders
        </h2>

        <div className="gap-md mt-lg grid md:grid-cols-3">
          {benefitCards.map((card) => {
            const Illustration = {
              "delivery-location": DeliveryLocation,
              "order-status": OrderStatus,
              "mobile-payments": MobilePayments,
            }[card.illustration];

            return (
              <article
                key={card.title}
                className="border-border-strong rounded-card flex flex-col overflow-hidden border"
              >
                <div className="bg-surface p-md grid place-items-center">
                  <Illustration className="h-[210px] w-auto" />
                </div>

                <div className="p-lg flex-1">
                  <h3 className="text-h1">{card.title}</h3>
                  <p className="text-site-body text-text-secondary mt-sm">
                    {card.body}
                  </p>
                  <Link
                    href={card.href}
                    className="text-label text-text mt-md gap-xs inline-flex items-center tracking-[0.12em] uppercase"
                  >
                    See more <span aria-hidden>&rarr;</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Riders — cards on the left, the illustration on the right. */}
      <section className="px-screen-x mx-auto w-full max-w-[1100px] py-xxl md:py-section">
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

      {/* Restaurants — the offer beside the screen the kitchen actually sees. */}
      <Screen mode="dark">
        <div className="px-screen-x gap-xxl mx-auto grid max-w-[1100px] items-center py-xxl md:py-section md:grid-cols-2">
          <div>
            <p className="text-eyebrow text-text-tertiary uppercase">
              For restaurants
            </p>
            <h2 className="text-section-small md:text-section mt-xs">
              Put your kitchen on M-Kart
            </h2>
            <p className="text-lede text-text-secondary mt-sm max-w-[46ch]">
              You cook. We handle orders, riders and money.
            </p>
            <ul className="mt-lg gap-sm flex flex-col">
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
            <ButtonLink href="/partners" variant="accent" className="mt-lg">
              List your kitchen
            </ButtonLink>
          </div>

          <div className="justify-self-center">
            <RestaurantPhone />
          </div>
        </div>
      </Screen>

      {/* Riders — same shape, mirrored, so the two audiences do not read as one block. */}
      <section id="riders">
        <div className="px-screen-x gap-xxl mx-auto grid max-w-[1100px] items-center py-xxl md:py-section md:grid-cols-2">
          <div className="order-2 justify-self-center md:order-1">
            <RiderPhone />
          </div>

          <div className="order-1 md:order-2">
            <p className="text-eyebrow text-text-tertiary uppercase">For riders</p>
            <h2 className="text-section-small md:text-section mt-xs">
              Ride with M-Kart
            </h2>
            <p className="text-lede text-text-secondary mt-sm max-w-[46ch]">
              Know Makurdi roads? Start earning this week.
            </p>
            <ul className="mt-lg gap-sm flex flex-col">
              {[
                "Paid per trip, every Friday",
                "Keep 100% of your tips",
                "Choose your own hours",
                "Bring a bike, a rider's card and a phone",
                "Fuel guarantee during your first two weeks",
              ].map((item) => (
                <li key={item} className="text-site-body gap-sm flex">
                  <span aria-hidden className="text-accent-text font-bold">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <ButtonLink href="/partners#riders" variant="dark" className="mt-lg">
              Apply to ride
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="px-screen-x mx-auto max-w-[1100px] py-xxl md:py-section">
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
