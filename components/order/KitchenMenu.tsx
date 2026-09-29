"use client";

import Image from "next/image";
import Link from "next/link";
import { Screen } from "@/components/ui/Screen";
import { ButtonLink } from "@/components/ui/Button";
import type { Kitchen } from "@/lib/fixtures";
import { formatKobo } from "@/lib/money";
import { addDish, priceCart, removeDish, useOrderState } from "@/lib/order/store";
import { cn } from "@/lib/cn";
import { QtyStepper } from "./QtyStepper";

const stagger = ["rise-1", "rise-2", "rise-3", "rise-4", "rise-5", "rise-6"];

export function KitchenMenu({ kitchen }: { kitchen: Kitchen }) {
  const { cart } = useOrderState();
  const priced = priceCart(cart);
  const inThisKitchen = cart?.kitchenSlug === kitchen.slug;
  const closed = Boolean(kitchen.closedUntil);

  return (
    <div className="gap-xl mx-auto flex max-w-[1240px] flex-wrap items-start">
      <div className="gap-lg flex min-w-0 flex-[2_1_520px] flex-col">
        <Link
          href="/kitchens"
          className="bg-bg hover:bg-surface-raised rounded-pill text-site-label self-start px-lg py-sm font-bold transition-colors duration-(--duration-fast)"
        >
          ← All kitchens
        </Link>

        <Screen
          mode="dark"
          className="rounded-panel-md grid overflow-hidden sm:grid-cols-2"
        >
          <div className="p-xxl md:p-pad-card flex flex-col justify-center">
            <h1 className="text-panel-small md:text-panel text-cream text-balance">
              {kitchen.name}
            </h1>
            <p className="text-site-body text-cream/62 mt-sm">
              {kitchen.cuisine} · {kitchen.area}
            </p>
            <div className="gap-xs text-site-chip text-cream mt-lg flex flex-wrap">
              <span className="bg-text/10 rounded-pill px-md py-xs">{kitchen.distanceKm} km</span>
              <span className="bg-text/10 rounded-pill px-md py-xs">
                {kitchen.etaMinutes[0]}–{kitchen.etaMinutes[1]} min
              </span>
              <span className="bg-accent/16 text-accent-text rounded-pill px-md py-xs">
                {kitchen.deliveryFeeKobo === 0
                  ? "Free delivery"
                  : `${formatKobo(kitchen.deliveryFeeKobo)} delivery`}
              </span>
            </div>
          </div>
          <div className="relative min-h-[220px]">
            <Image
              src={kitchen.image}
              alt={`${kitchen.cuisine} from ${kitchen.name}`}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 420px"
              className="object-cover"
            />
          </div>
        </Screen>

        {closed && (
          <p className="bg-danger-bg text-danger-text rounded-panel-xs text-site-label px-lg py-md font-semibold">
            {kitchen.name} is closed. {kitchen.closedUntil} — you can look, but not order yet.
          </p>
        )}

        <div className="bg-bg rounded-panel-sm px-lg py-sm md:px-xl">
          {kitchen.menu.map((dish, i) => {
            const qty = inThisKitchen ? (cart?.lines[dish.id] ?? 0) : 0;
            return (
              <div
                key={dish.id}
                className={cn(
                  "border-surface-raised gap-lg rise flex items-center border-b px-xs py-lg last:border-b-0",
                  stagger[i],
                )}
              >
                <div className={cn("min-w-0 flex-1", dish.soldOut && "opacity-50")}>
                  <div className="text-site-question">{dish.name}</div>
                  <div className="text-site-label text-text-secondary mt-xs">{dish.description}</div>
                  <div className="text-site-body mt-sm font-bold">{formatKobo(dish.priceKobo)}</div>
                </div>

                {dish.soldOut ? (
                  <span className="text-site-label text-text-secondary max-w-[16ch] text-right font-semibold">
                    {kitchen.name} has run out of this today
                  </span>
                ) : closed ? null : qty === 0 ? (
                  <button
                    type="button"
                    onClick={() => addDish(kitchen, dish.id)}
                    className="bg-accent text-on-accent rounded-pill text-nav-link shrink-0 px-xl py-md font-bold transition-transform duration-(--duration-fast) hover:-translate-y-0.5 active:scale-95"
                  >
                    Add
                  </button>
                ) : (
                  <QtyStepper
                    qty={qty}
                    name={dish.name}
                    onAdd={() => addDish(kitchen, dish.id)}
                    onRemove={() => removeDish(dish.id)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <aside className="bg-bg rounded-panel-sm p-xl sticky top-[96px] min-w-0 flex-[1_1_300px]">
        <h2 className="text-h1 font-extrabold">Your order</h2>

        {!priced || priced.lines.length === 0 ? (
          <p className="text-site-label text-text-secondary mt-md">
            Nothing yet. Tap Add on a dish to start.
          </p>
        ) : (
          <>
            {!inThisKitchen && (
              <p className="bg-danger-bg text-danger-text rounded-field text-site-label mt-md px-md py-sm font-semibold">
                This cart is from {priced.kitchen.name}. Adding here starts a new cart.
              </p>
            )}
            <div className="gap-sm mt-md flex flex-col">
              {priced.lines.map((line) => (
                <div key={line.dish.id} className="gap-sm text-site-label flex font-semibold">
                  <span className="text-accent-text shrink-0">{line.qty}×</span>
                  <span className="min-w-0 flex-1">{line.dish.name}</span>
                  <span className="shrink-0">{formatKobo(line.lineKobo)}</span>
                </div>
              ))}
            </div>
            <div className="border-surface-raised text-site-body mt-lg flex justify-between border-t pt-md font-bold">
              <span>Subtotal</span>
              <span>{formatKobo(priced.subtotalKobo)}</span>
            </div>
            <ButtonLink
              href="/checkout"
              variant="dark"
              size="site"
              full
              className="mt-lg"
            >
              Go to checkout
            </ButtonLink>
          </>
        )}
      </aside>
    </div>
  );
}
