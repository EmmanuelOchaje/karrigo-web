"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/ui/Screen";
import { Button, ButtonLink } from "@/components/ui/Button";
import { formatKobo } from "@/lib/money";
import { say } from "@/lib/order/store";
import { cancelOrder, fetchOrder, payAgain, type TrackedOrder } from "@/app/(order)/actions";
import { cn } from "@/lib/cn";

type Status = TrackedOrder["status"];

/** The five steps a customer cares about, and which backend statuses they
 *  cover. An order is "placed" until the kitchen accepts it. */
const stages = [
  { label: "Order placed", status: "Waiting for the kitchen to accept", covers: ["PLACED"] },
  { label: "Order accepted", status: "The kitchen has your order", covers: ["ACCEPTED"] },
  { label: "Cooking", status: "Your food is on the fire", covers: ["PREPARING", "READY"] },
  { label: "On the way", status: "Your rider is heading to you", covers: ["PICKED_UP", "DELIVERING"] },
  { label: "Delivered", status: "Enjoy your meal", covers: ["DELIVERED"] },
] satisfies { label: string; status: string; covers: Status[] }[];

const payLabel = { card: "Paid by card", transfer: "Bank transfer", cash: "Cash on delivery" };

/** How often to ask, in ms. Fast while things are moving, off when it ends. */
const POLL_MS = 8000;

function isOver(status: Status) {
  return status === "DELIVERED" || status === "CANCELLED" || status === "REFUNDED";
}

export function TrackOrder({ initial, error }: { initial: TrackedOrder | null; error: string | null }) {
  const router = useRouter();
  const [order, setOrder] = useState(initial);
  const [problem, setProblem] = useState(error);
  const [busy, startTransition] = useTransition();
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const id = order?.id;
  const over = order ? isOver(order.status) : true;
  // A card order whose payment has not been confirmed yet: Paystack calls the
  // backend a moment after the customer returns, so keep checking.
  const awaitingPayment = order?.payment === "pending";

  useEffect(() => {
    if (!id || (over && !awaitingPayment)) return;
    const poll = setInterval(async () => {
      const result = await fetchOrder(id);
      if (result.ok) {
        setOrder(result.order);
        setProblem(null);
      }
      // A failed poll is ignored: the last good answer stays on screen.
    }, POLL_MS);
    return () => clearInterval(poll);
  }, [id, over, awaitingPayment]);

  if (!order) {
    return (
      <div className="bg-bg rounded-panel-sm mx-auto max-w-[640px] p-xxl text-center">
        <p className="text-site-title">We can&rsquo;t show that order</p>
        <p className="text-site-body text-text-secondary mt-sm">
          {problem ?? "Check the link, or log in with the number you ordered with."}
        </p>
        <ButtonLink href="/kitchens" variant="accent" size="site" className="mt-xl">
          Browse kitchens
        </ButtonLink>
      </div>
    );
  }

  const cancelled = order.status === "CANCELLED" || order.status === "REFUNDED";
  const stage = Math.max(0, stages.findIndex((s) => (s.covers as Status[]).includes(order.status)));
  const delivered = order.status === "DELIVERED";
  const canCancel = order.status === "PLACED";

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
            Order {order.code} · {order.kitchen}
          </p>
          <h1 className="text-panel-small md:text-panel text-cream mt-sm">
            {cancelled
              ? order.status === "REFUNDED"
                ? "Cancelled and refunded"
                : "This order was cancelled"
              : delivered
                ? "Delivered. Enjoy!"
                : awaitingPayment
                  ? "Confirming your payment…"
                  : stages[stage].label}
          </h1>
          <p className="text-panel-body text-cream/65 mt-md">
            {cancelled
              ? order.payment === "paid" || order.payment === "refunded"
                ? "If you paid online, the money goes back to you."
                : "You weren't charged."
              : awaitingPayment
                ? "Paystack is telling us your payment went through. This page updates by itself."
                : `${stages[stage].status} · to ${order.to}`}
          </p>

          {!cancelled && (
            <>
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
            </>
          )}

          {order.rider && !over && (
            <div className="bg-text/7 rounded-step mt-xxl gap-md rise flex flex-wrap items-center py-md pr-md pl-lg">
              <span className="bg-accent text-on-accent text-h3 grid size-[46px] shrink-0 place-items-center rounded-full font-extrabold">
                {order.rider.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
              <div className="min-w-[120px] flex-1">
                <div className="text-site-question text-cream">{order.rider.name}</div>
                <div className="text-label text-cream/55 mt-[3px]">Your rider</div>
              </div>
              {order.rider.phone && (
                <a
                  href={`tel:${order.rider.phone}`}
                  className="bg-accent text-on-accent rounded-pill text-nav-link px-xl py-md font-bold active:scale-95"
                >
                  Call
                </a>
              )}
            </div>
          )}

          {problem && <p className="text-site-label text-cream/70 mt-lg">{problem}</p>}

          <div className="mt-xl gap-sm flex flex-wrap">
            {order.payment === "failed" || (order.payment === "pending" && order.pay !== "cash" && order.status === "PLACED") ? (
              <Button
                type="button"
                variant="accent"
                size="site"
                disabled={busy}
                onClick={() =>
                  startTransition(async () => {
                    const result = await payAgain(order.id);
                    if (result.ok) window.location.href = result.payUrl;
                    else say(result.error);
                  })
                }
              >
                {order.payment === "failed" ? "Try paying again" : "Pay now"}
              </Button>
            ) : null}

            {over ? (
              <Button type="button" variant="accent" size="site" onClick={() => router.push("/kitchens")}>
                Order something else
              </Button>
            ) : (
              <button
                type="button"
                className="bg-accent/14 text-accent-text rounded-pill text-nav-link px-xl py-md font-bold"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    say("Link copied — it opens for the account that placed the order");
                  } catch {
                    say("Copy the address bar to open this order again");
                  }
                }}
              >
                Copy order link
              </button>
            )}

            {canCancel &&
              (confirmingCancel ? (
                <>
                  <Button
                    type="button"
                    variant="muted"
                    size="site"
                    disabled={busy}
                    onClick={() =>
                      startTransition(async () => {
                        const result = await cancelOrder(order.id);
                        if (!result.ok) {
                          setConfirmingCancel(false);
                          return say(result.error);
                        }
                        const next = await fetchOrder(order.id);
                        if (next.ok) setOrder(next.order);
                        say("Order cancelled");
                      })
                    }
                  >
                    {busy ? "Cancelling…" : "Yes, cancel it"}
                  </Button>
                  <button type="button" onClick={() => setConfirmingCancel(false)} className="text-cream/70 text-nav-link px-lg font-bold">
                    Keep my order
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingCancel(true)}
                  className="text-cream/70 rounded-pill text-nav-link px-lg py-md font-bold"
                >
                  Cancel order
                </button>
              ))}
          </div>
        </div>
      </Screen>

      <aside className="bg-bg rounded-panel-sm p-xl min-w-0 flex-[1_1_300px]">
        <h2 className="text-h1 font-extrabold">Receipt</h2>
        <div className="gap-sm mt-md flex flex-col">
          {order.items.map((item, i) => (
            <div key={`${item.name}-${i}`} className="gap-sm text-site-label flex font-semibold">
              <span className="text-accent-text shrink-0">{item.qty}×</span>
              <span className="min-w-0 flex-1">{item.name}</span>
              <span className="shrink-0">{formatKobo(item.lineKobo)}</span>
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
          {order.discountKobo > 0 && (
            <div className="text-accent-text flex justify-between">
              <dt>Promo</dt>
              <dd>−{formatKobo(order.discountKobo)}</dd>
            </div>
          )}
          {order.creditKobo > 0 && (
            <div className="text-accent-text flex justify-between">
              <dt>Karrigo credit</dt>
              <dd>−{formatKobo(order.creditKobo)}</dd>
            </div>
          )}
          <div className="text-h1 text-text mt-xs flex justify-between font-extrabold">
            <dt>Total</dt>
            <dd>{formatKobo(order.totalKobo)}</dd>
          </div>
          <div className="text-label mt-xs">
            {order.payment === "paid"
              ? "Paid by " + (order.pay === "transfer" ? "bank transfer" : "card")
              : order.payment === "pending"
                ? "Payment not confirmed yet"
                : order.payment === "failed"
                  ? "Payment didn't go through"
                  : order.payment === "refunded"
                    ? "Refunded"
                    : payLabel[order.pay]}
          </div>
        </dl>
        <ButtonLink href="/kitchens" variant="muted" size="site" full className="mt-lg">
          Back to kitchens
        </ButtonLink>
      </aside>
    </div>
  );
}
