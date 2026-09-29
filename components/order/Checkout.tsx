"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { formatKobo } from "@/lib/money";
import { deliverySchema, firstIssue, type PaymentMethod } from "@/lib/order/schema";
import {
  addDish,
  placeOrder,
  priceCart,
  removeDish,
  setDelivery,
  useOrderState,
} from "@/lib/order/store";
import { cn } from "@/lib/cn";
import { QtyStepper } from "./QtyStepper";

const payOptions: { id: PaymentMethod; label: string; sub: string }[] = [
  { id: "card", label: "Card", sub: "Pay now with Paystack" },
  { id: "transfer", label: "Bank transfer", sub: "We show account details next" },
  { id: "cash", label: "Cash on delivery", sub: "Pay your rider at the gate" },
];

const field =
  "border-border-strong focus:border-text rounded-field text-site-body bg-bg border-[1.5px] px-lg py-md font-medium outline-none transition-colors duration-(--duration-fast)";
const fieldLabel = "text-label flex flex-col gap-sm font-bold";

export function Checkout() {
  const router = useRouter();
  const { user, cart, landmark, address } = useOrderState();
  const [note, setNote] = useState("");
  const [pay, setPay] = useState<PaymentMethod>("card");
  const [error, setError] = useState("");

  // Revalidated on every render: a dish that sold out while it sat in the
  // cart drops out of the total and is named above the button.
  const priced = priceCart(cart);

  if (!priced || priced.lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1240px]">
        <h1 className="text-section-small md:text-section mt-sm mb-xl">Checkout</h1>
        <div className="bg-bg rounded-panel-sm px-xl py-[48px] text-center">
          <p className="text-site-title">Your cart is empty</p>
          <p className="text-site-body text-text-secondary mt-sm mb-xl">
            Pick a kitchen and add a few dishes.
          </p>
          <ButtonLink href="/kitchens" variant="accent" size="site">
            Browse kitchens
          </ButtonLink>
        </div>
      </div>
    );
  }

  const { kitchen } = priced;

  function place() {
    if (!user) {
      router.push("/login?next=/checkout");
      return;
    }
    if (!priced) return;
    if (priced.shortfallKobo > 0) {
      setError(
        `${kitchen.name} takes orders from ${formatKobo(kitchen.minOrderKobo)}. Add ${formatKobo(priced.shortfallKobo)} more.`,
      );
      return;
    }
    const parsed = deliverySchema.safeParse({ landmark, address, note, pay });
    if (!parsed.success) {
      setError(firstIssue(parsed.error));
      return;
    }
    const id = placeOrder({
      kitchenSlug: kitchen.slug,
      kitchenName: kitchen.name,
      items: priced.lines.map((l) => ({ name: l.dish.name, qty: l.qty, priceKobo: l.lineKobo })),
      subtotalKobo: priced.subtotalKobo,
      feeKobo: priced.feeKobo,
      totalKobo: priced.totalKobo,
      pay: parsed.data.pay,
      to: parsed.data.landmark || parsed.data.address,
    });
    router.push(`/track/${id}`);
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      <h1 className="text-section-small md:text-section mt-sm mb-xl">Checkout</h1>

      <div className="gap-xl flex flex-wrap items-start">
        <div className="gap-lg flex min-w-0 flex-[2_1_480px] flex-col">
          <section className="bg-bg rounded-panel-sm p-xl md:p-xxl gap-md flex flex-col">
            <h2 className="text-h1 font-extrabold">Where should we bring it?</h2>
            <label className={fieldLabel}>
              Landmark
              <input
                value={landmark}
                onChange={(e) => {
                  setDelivery({ landmark: e.target.value });
                  setError("");
                }}
                placeholder="Behind BSU main gate, blue gate"
                className={field}
              />
            </label>
            <label className={fieldLabel}>
              Street address (optional)
              <input
                value={address}
                onChange={(e) => {
                  setDelivery({ address: e.target.value });
                  setError("");
                }}
                placeholder="12 Old Otukpo Road, High Level"
                autoComplete="street-address"
                className={field}
              />
            </label>
            <label className={fieldLabel}>
              Note for kitchen or rider
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                maxLength={200}
                placeholder="Less pepper, call when you reach the junction"
                className={cn(field, "resize-y")}
              />
            </label>
          </section>

          <section className="bg-bg rounded-panel-sm p-xl md:p-xxl">
            <h2 className="text-h1 font-extrabold">Payment</h2>
            <div className="gap-sm mt-md grid sm:grid-cols-3" role="radiogroup" aria-label="Payment method">
              {payOptions.map((option) => {
                const on = pay === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPay(option.id)}
                    data-theme={on ? "dark" : undefined}
                    className={cn(
                      "rounded-slot bg-bg border-[1.5px] px-lg py-lg text-left transition-colors duration-(--duration-fast) active:scale-[0.98]",
                      on ? "border-bg" : "border-border-strong",
                    )}
                  >
                    <div className={cn("text-site-question", on && "text-accent-text")}>
                      {option.label}
                    </div>
                    <div className={cn("text-site-chip mt-xs font-medium", on ? "text-cream/60" : "text-text-secondary")}>
                      {option.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="bg-bg rounded-panel-sm p-xl sticky top-[96px] min-w-0 flex-[1_1_320px]">
          <div className="gap-sm flex items-baseline justify-between">
            <h2 className="text-h1 font-extrabold">{kitchen.name}</h2>
            <Link href={`/k/${kitchen.slug}`} className="text-accent-text text-site-label font-bold whitespace-nowrap">
              Add more
            </Link>
          </div>

          {priced.unavailable.length > 0 && (
            <p className="bg-danger-bg text-danger-text rounded-field text-site-label mt-md px-md py-sm font-semibold">
              {kitchen.name} has run out of {priced.unavailable.join(", ")}. We took it out of your order.
            </p>
          )}

          <div className="gap-md mt-md flex flex-col">
            {priced.lines.map((line) => (
              <div key={line.dish.id} className="gap-sm flex items-center">
                <div className="text-site-label min-w-0 flex-1 font-semibold">
                  {line.dish.name}
                  <div className="text-text-secondary mt-[2px] font-bold">{formatKobo(line.lineKobo)}</div>
                </div>
                <QtyStepper
                  tone="light"
                  qty={line.qty}
                  name={line.dish.name}
                  onAdd={() => addDish(kitchen, line.dish.id)}
                  onRemove={() => removeDish(line.dish.id)}
                />
              </div>
            ))}
          </div>

          <dl className="border-surface-raised text-site-label text-text-secondary mt-lg gap-sm flex flex-col border-t pt-md font-semibold">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatKobo(priced.subtotalKobo)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{priced.feeKobo ? formatKobo(priced.feeKobo) : "Free"}</dd>
            </div>
            <div className="text-h1 text-text mt-xs flex justify-between font-extrabold">
              <dt>Total</dt>
              <dd>{formatKobo(priced.totalKobo)}</dd>
            </div>
          </dl>

          {priced.shortfallKobo > 0 && !error && (
            <p className="text-site-label text-text-secondary mt-md">
              {kitchen.name} takes orders from {formatKobo(kitchen.minOrderKobo)} — add{" "}
              {formatKobo(priced.shortfallKobo)} more.
            </p>
          )}
          {error && (
            <p role="alert" className="text-danger-text text-site-label shake mt-md font-semibold">
              {error}
            </p>
          )}

          <Button
            type="button"
            onClick={place}
            variant="dark"
            size="site"
            full
            className="mt-lg"
            disabled={Boolean(user) && priced.shortfallKobo > 0}
          >
            {user ? `Place order · ${formatKobo(priced.totalKobo)}` : "Log in to place order"}
          </Button>
        </aside>
      </div>
    </div>
  );
}
