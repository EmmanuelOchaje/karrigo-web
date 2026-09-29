"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/ui/Screen";
import { Button, ButtonLink } from "@/components/ui/Button";
import { formatKobo } from "@/lib/money";
import { clearOrder, say, useHydrated, useOrderState } from "@/lib/order/store";
import { cn } from "@/lib/cn";

const stages = [
  { label: "Order accepted", status: "The kitchen has your order" },
  { label: "Cooking", status: "Your food is on the fire" },
  { label: "Picked up", status: "Your rider has left the kitchen" },
  { label: "On the way", status: "Your rider is heading to you" },
  { label: "Delivered", status: "Enjoy your meal" },
];

/** Until the dispatch backend exists, the order walks through its stages on
 *  a timer so the page can be seen in every state. */
const DEMO_STAGE_MS = 6000;
const ETA_MS = 35 * 60 * 1000;

const payLabel = { card: "Paid by card", transfer: "Bank transfer", cash: "Cash on delivery" };

export function TrackOrder() {
  const router = useRouter();
  const id = useSearchParams().get("order") ?? "";
  const hydrated = useHydrated();
  const { order } = useOrderState();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  if (!hydrated) {
    return <div aria-busy="true" className="bg-bg/60 rounded-panel-lg mx-auto h-[420px] max-w-[1240px] animate-pulse" />;
  }

  if (!order || order.id !== id) {
    return (
      <div className="bg-bg rounded-panel-sm mx-auto max-w-[640px] p-xxl text-center">
        <p className="text-site-title">We can&rsquo;t find order {id} on this phone</p>
        <p className="text-site-body text-text-secondary mt-sm">
          Tracking links open on the phone the order was placed from, for now.
        </p>
        <ButtonLink href="/kitchens" variant="accent" size="site" className="mt-xl">
          Browse kitchens
        </ButtonLink>
      </div>
    );
  }

  const stage = Math.min(4, Math.floor((now - order.placedAt) / DEMO_STAGE_MS));
  const delivered = stage === 4;
  const eta = new Date(order.placedAt + ETA_MS).toLocaleTimeString("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="gap-xl mx-auto flex max-w-[1240px] flex-wrap items-start">
      <Screen
        mode="dark"
        className="rounded-panel-lg p-xxl md:p-pad-card relative min-w-0 flex-[2_1_480px] overflow-hidden"
      >
        <div
          aria-hidden
          className="border-accent/18 pointer-events-none absolute top-[-160px] right-[-120px] size-[440px] rounded-full border-[1.5px]"
        />
        <div className="relative">
          <p className="text-label text-cream/50 font-bold tracking-[0.06em] uppercase">
            Order {order.id} · {order.kitchenName}
          </p>
          <h1 className="text-panel-small md:text-panel text-cream mt-sm">
            {delivered ? "Delivered. Enjoy!" : `Arriving about ${eta}`}
          </h1>
          <p className="text-panel-body text-cream/65 mt-md">
            {stages[stage].status} · to {order.to}
          </p>

          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={stage}
            aria-label="Delivery progress"
            className="bg-text/10 rounded-pill mt-xxl h-[8px] overflow-hidden"
          >
            <div
              className="bg-accent rounded-pill h-full transition-[width] duration-(--duration-slow)"
              style={{ width: `${Math.max(6, stage * 25)}%` }}
            />
          </div>

          <ol className="mt-xxl gap-lg flex flex-col">
            {stages.map((s, i) => (
              <li
                key={s.label}
                className={cn(
                  "text-site-body gap-md flex items-center font-semibold transition-colors duration-(--duration-slow)",
                  i <= stage ? "text-cream" : "text-cream/40",
                )}
              >
                <span
                  className={cn(
                    "size-[12px] shrink-0 rounded-full",
                    i < stage && "bg-accent",
                    i === stage && "bg-accent-warm",
                    i === stage && !delivered && "route-pulse",
                    i > stage && "bg-text/18",
                  )}
                />
                {s.label}
              </li>
            ))}
          </ol>

          {stage >= 2 && (
            <div className="bg-text/7 rounded-step mt-xxl gap-md rise flex flex-wrap items-center py-md pr-md pl-lg">
              <span className="bg-accent text-on-accent text-h3 grid size-[46px] shrink-0 place-items-center rounded-full font-extrabold">
                DT
              </span>
              <div className="min-w-[120px] flex-1">
                <div className="text-site-question text-cream">Doosuur Terhemba</div>
                <div className="text-label text-cream/55 mt-[3px]">Your rider · ★ 4.9 · Red Bajaj</div>
              </div>
              <a
                href="tel:+2348035550142"
                className="bg-accent text-on-accent rounded-pill text-nav-link px-xl py-md font-bold active:scale-95"
              >
                Call
              </a>
            </div>
          )}

          <div className="mt-xl gap-sm flex flex-wrap">
            {delivered ? (
              <Button
                type="button"
                variant="accent"
                size="site"
                onClick={() => {
                  clearOrder();
                  router.push("/kitchens");
                }}
              >
                Order something else
              </Button>
            ) : (
              <button
                type="button"
                className="bg-accent/14 text-accent-text rounded-pill text-nav-link px-xl py-md font-bold"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    say("Tracking link copied — send it on WhatsApp");
                  } catch {
                    say("Copy the address bar to share this order");
                  }
                }}
              >
                Share tracking link
              </button>
            )}
          </div>
        </div>
      </Screen>

      <aside className="bg-bg rounded-panel-sm p-xl min-w-0 flex-[1_1_300px]">
        <h2 className="text-h1 font-extrabold">Receipt</h2>
        <div className="gap-sm mt-md flex flex-col">
          {order.items.map((item) => (
            <div key={item.name} className="gap-sm text-site-label flex font-semibold">
              <span className="text-accent-text shrink-0">{item.qty}×</span>
              <span className="min-w-0 flex-1">{item.name}</span>
              <span className="shrink-0">{formatKobo(item.priceKobo)}</span>
            </div>
          ))}
        </div>
        <dl className="border-surface-raised text-site-label text-text-secondary mt-lg gap-sm flex flex-col border-t pt-md font-semibold">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatKobo(order.subtotalKobo)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd>{order.feeKobo ? formatKobo(order.feeKobo) : "Free"}</dd>
          </div>
          <div className="text-h1 text-text mt-xs flex justify-between font-extrabold">
            <dt>Total</dt>
            <dd>{formatKobo(order.totalKobo)}</dd>
          </div>
          <div className="text-label mt-xs">{payLabel[order.pay]}</div>
        </dl>
        <ButtonLink href="/kitchens" variant="muted" size="site" full className="mt-lg">
          Back to kitchens
        </ButtonLink>
      </aside>
    </div>
  );
}
