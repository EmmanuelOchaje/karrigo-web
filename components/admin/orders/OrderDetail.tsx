"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import {
  elapsedLabel,
  isActive,
  lineTotal,
  orderTimeline,
  orderTotals,
  placedAt,
} from "@/lib/admin/derive";
import { NEARBY_RIDERS } from "@/lib/admin/fixtures";
import { assignRider, cancelOrder, giveLateCredit } from "@/lib/admin/store";
import { PAYMENT_LABEL, type Order } from "@/lib/admin/types";
import { Eyebrow } from "@/components/admin/ui";

/**
 * One order, in full, with the three things ops can do about it: put a rider
 * on it, apologise with credit, or cancel and refund.
 *
 * The panel is light in both themes — `data-theme="light"` rather than
 * hardcoded hex, so every token inside resolves to its light value. It is a
 * document: a receipt and a timeline someone reads closely, often while on
 * the phone to a customer, and it stays legible when the room is bright.
 */
export function OrderDetail({
  order,
  credited,
}: {
  order: Order;
  credited: boolean;
}) {
  const [picking, setPicking] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const totals = orderTotals(order, credited);
  const timeline = orderTimeline(order);
  const actionable = isActive(order);

  return (
    <div
      data-theme="light"
      className="bg-ops-surface text-text overflow-hidden rounded-[15px]"
    >
      <header className="border-text/8 border-b px-[22px] pt-[22px] pb-lg">
        <div className="flex items-center justify-between gap-2.5">
          <span className="text-[22px]/none font-extrabold tracking-[-0.03em]">
            {order.id}
          </span>
          <span className="text-text/62 text-[12.5px] font-medium">
            Placed {placedAt(order)} · {elapsedLabel(order)} ago
          </span>
        </div>
        <p className="text-text/80 mt-2 text-[13.5px]/[1.5]">
          {order.landmark}, <strong className="text-text font-semibold">{order.area}</strong>
        </p>
      </header>

      <div className="bg-text/8 border-text/8 grid grid-cols-3 gap-px border-b">
        <Fact label="Customer" value={order.customerName} sub={order.customerPhone} />
        <Fact label="Kitchen" value={order.kitchen} />
        <Fact label="Rider" value={order.riderName ?? "Unassigned"} />
      </div>

      <ol className="border-text/8 flex flex-col border-b px-[22px] py-lg">
        {timeline.map((step) => (
          <li
            key={step.label}
            className="grid h-[30px] grid-cols-[14px_minmax(0,1fr)_auto] items-center gap-3"
          >
            <span
              aria-hidden
              className={cn(
                "border-text size-3 rounded-full border-2",
                step.reached
                  ? step.current
                    ? "bg-accent"
                    : "bg-text"
                  : "bg-ops-surface opacity-30",
              )}
            />
            <span
              className={cn(
                "text-[13px]",
                step.reached
                  ? step.current
                    ? "text-text font-bold"
                    : "text-text font-medium"
                  : "text-text/45 font-medium",
              )}
            >
              {step.label}
            </span>
            <span
              className={cn(
                "text-[12.5px] font-semibold",
                step.reached ? "text-text" : "text-text/45",
              )}
            >
              {step.time}
            </span>
          </li>
        ))}
      </ol>

      <div className="border-text/8 flex flex-col gap-[7px] border-b px-[22px] py-3.5 text-[13px]">
        {order.items.map((item) => (
          <div key={item.name} className="flex justify-between gap-2.5">
            <span>
              <span className="text-text/62">{item.qty}×</span> {item.name}
            </span>
            <span>{lineTotal(item)}</span>
          </div>
        ))}
        <div className="text-text/62 flex justify-between">
          <span>Delivery</span>
          <span>{totals.fee}</span>
        </div>
        {totals.credit && (
          <div className="text-accent-text flex justify-between font-semibold">
            <span>Late-order credit</span>
            <span>{totals.credit}</span>
          </div>
        )}
        <div className="border-text/16 mt-1 flex items-baseline justify-between border-t border-dashed pt-2.5">
          <span className="font-semibold">{PAYMENT_LABEL[order.payment]}</span>
          <span className="text-[18px] font-extrabold">{totals.total}</span>
        </div>
      </div>

      {actionable && (
        <div className="flex flex-col gap-2.5 px-[22px] pt-lg pb-xl">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setPicking((open) => !open);
                setConfirming(false);
              }}
              className="bg-text text-ops-surface h-10 rounded-pill px-[18px] text-[13px] font-bold"
            >
              {order.riderName ? "Reassign rider" : "Assign rider"}
            </button>
            {credited ? (
              <span className="bg-accent/22 text-accent-text inline-flex h-10 items-center rounded-pill px-lg text-[13px] font-bold">
                ✓ ₦500 credit sent
              </span>
            ) : (
              <button
                type="button"
                onClick={() =>
                  giveLateCredit(order.id, order.customerName.split(" ")[0])
                }
                className="bg-accent text-on-accent h-10 rounded-pill px-[18px] text-[13px] font-bold"
              >
                Give ₦500 credit
              </button>
            )}
          </div>

          {picking && (
            <div className="border-text/12 overflow-hidden rounded-[15px] border">
              {NEARBY_RIDERS.map((rider) => (
                <button
                  key={rider.name}
                  type="button"
                  onClick={() => {
                    assignRider(order.id, rider.name);
                    setPicking(false);
                  }}
                  className="border-text/8 hover:bg-text/4 flex w-full items-center justify-between gap-2.5 border-b px-3.5 py-2.5 text-left last:border-b-0"
                >
                  <span className="flex flex-col gap-0.5">
                    <span className="text-text text-[13px] font-semibold">
                      {rider.name}
                    </span>
                    <span className="text-text/62 text-[11.5px]">
                      Waiting · {rider.area}
                    </span>
                  </span>
                  <span className="text-accent-text text-[12px] font-semibold">
                    {rider.distance}
                  </span>
                </button>
              ))}
            </div>
          )}

          {confirming ? (
            <div className="bg-danger-bg flex flex-col gap-2.5 rounded-[15px] p-3.5">
              <span className="text-text text-[13.5px] font-semibold">
                Cancel {order.id}?
              </span>
              <span className="text-text/80 text-[12.5px]/[1.5]">
                {order.payment === "cash"
                  ? "Nothing was paid yet — the order is cancelled and the kitchen is told."
                  : `${totals.total} goes back by ${PAYMENT_LABEL[
                      order.payment
                    ].toLowerCase()} within 24 h.`}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    cancelOrder(order.id, totals.total);
                    setConfirming(false);
                  }}
                  className="bg-danger text-ops-surface h-9 rounded-pill px-lg text-[12.5px] font-bold"
                >
                  Cancel and refund
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="border-text/16 text-text h-9 rounded-pill border px-lg text-[12.5px] font-semibold"
                >
                  Keep order
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setConfirming(true);
                setPicking(false);
              }}
              className="text-danger h-9 self-start px-1 text-[13px] font-semibold"
            >
              Cancel and refund
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Fact({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-ops-surface flex min-w-0 flex-col gap-[3px] px-3.5 py-3">
      <Eyebrow className="text-[10.5px]">{label}</Eyebrow>
      <span className="truncate text-[13px] font-semibold">{value}</span>
      {sub && <span className="text-text/62 text-[11.5px]">{sub}</span>}
    </div>
  );
}
