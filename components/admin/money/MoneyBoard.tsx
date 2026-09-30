"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import { formatKobo } from "@/lib/money";
import { KITCHENS, PUSH_SWEEP, RIDERS } from "@/lib/admin/fixtures";
import {
  applyOrderOverrides,
  markPaidOut,
  refundOrder,
  sweepPushTokens,
  useOps,
} from "@/lib/admin/store";
import { orderTotals, placedAt } from "@/lib/admin/derive";
import { PAYMENT_LABEL, type AdminRole } from "@/lib/admin/types";

/**
 * Everything that moves money. The whole screen is readable by a moderator
 * and actionable only by a super admin — seeing what is owed is part of
 * running a shift; sending it is not.
 *
 * TODO(M9): each button becomes a server action that re-checks the role,
 * creates the Paystack transfer, and writes an audit-log row naming who did
 * it. Nothing here should ever be trusted from the client.
 */
export function MoneyBoard({ role }: { role: AdminRole }) {
  const ops = useOps();
  const canSend = role === "SUPER_ADMIN";

  const due = [
    ...KITCHENS.filter(
      (k) =>
        (ops.kitchenStatus[k.id] ?? k.status) === "ACTIVE" &&
        k.unpaidKobo &&
        !ops.paidOut[k.id],
    ).map((k) => ({
      id: k.id,
      name: k.name,
      meta: `Kitchen · ${k.area}`,
      netKobo: k.unpaidKobo,
      confirm:
        "Settles every unpaid completed order after the 15% commission. One Paystack transfer, can't be undone.",
    })),
    ...RIDERS.filter(
      (r) =>
        (ops.riderStatus[r.id] ?? r.status) === "APPROVED" &&
        // A rider who has collected more cash than they are owed is not due a
        // payout — they owe us the difference. They belong in "Cash to
        // collect" below, not in a list of transfers to send.
        r.unpaidKobo > r.cashHeldKobo &&
        !ops.paidOut[r.id],
    ).map((r) => ({
      id: r.id,
      name: r.name,
      meta: `Rider · ${formatKobo(r.unpaidKobo)} trip pay − ${formatKobo(
        r.cashHeldKobo,
      )} cash held`,
      netKobo: Math.max(0, r.unpaidKobo - r.cashHeldKobo),
      confirm:
        "Trip pay and tips, minus cash they already collected. One Paystack transfer, can't be undone.",
    })),
  ].sort((a, b) => b.netKobo - a.netKobo);

  const total = due.reduce((sum, row) => sum + row.netKobo, 0);

  /** The other direction: cash-on-delivery money sitting in riders' pockets
   *  that is more than we owe them. Someone has to go and collect it. */
  const owing = RIDERS.filter(
    (r) =>
      (ops.riderStatus[r.id] ?? r.status) === "APPROVED" &&
      r.cashHeldKobo > r.unpaidKobo &&
      !ops.paidOut[r.id],
  ).map((r) => ({
    id: r.id,
    name: r.name,
    area: r.area,
    owesKobo: r.cashHeldKobo - r.unpaidKobo,
  }));

  const [asking, setAsking] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-start gap-3.5">
      <section className="bg-ops-surface min-w-0 overflow-hidden rounded-[15px]">
        <div className="flex flex-wrap items-center justify-between gap-3 px-[22px] pt-xl pb-lg">
          <h2 className="text-text text-[16px]/[1.3] font-semibold whitespace-nowrap">
            Due for payout
          </h2>
          <span className="text-text/62 text-[12.5px]/[1.4] font-light">
            {due.length
              ? `${due.length} waiting · ${formatKobo(total)} in total`
              : ""}
          </span>
        </div>

        {!canSend && (
          <p className="bg-text/6 text-text/72 mx-[22px] mb-3.5 rounded-xl px-3.5 py-2.5 text-[12.5px]/[1.45] font-medium">
            Moderators can see what&rsquo;s due. Sending payouts needs a super
            admin.
          </p>
        )}

        {due.length === 0 ? (
          <p className="text-text/62 px-[22px] pt-9 pb-11 text-center text-[13px] font-light">
            Everyone is paid up.
          </p>
        ) : (
          due.map((row) => (
            <div
              key={row.id}
              className="border-text/6 flex flex-col gap-2.5 border-t px-[22px] py-3.5"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3.5">
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-text text-[14.5px] font-semibold">
                    {row.name}
                  </span>
                  <span className="text-text/62 text-[12.5px] font-light">
                    {row.meta}
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-text text-[15px] font-bold whitespace-nowrap">
                    {formatKobo(row.netKobo)}
                  </span>
                  {canSend && asking !== row.id && (
                    <button
                      type="button"
                      onClick={() => setAsking(row.id)}
                      className="bg-accent text-on-accent h-9 rounded-pill px-lg text-[12.5px] font-bold"
                    >
                      Send
                    </button>
                  )}
                </span>
              </div>

              {asking === row.id && (
                <div
                  data-anim="drop"
                  className="bg-ops-surface-raised flex flex-wrap items-center gap-2.5 rounded-xl px-3.5 py-3"
                >
                  <span className="text-text/75 min-w-[200px] flex-1 text-[12.5px]/[1.5]">
                    {row.confirm}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      markPaidOut(row.id, formatKobo(row.netKobo), row.name);
                      setAsking(null);
                    }}
                    className="bg-text text-ops-surface h-9 rounded-pill px-lg text-[12.5px] font-bold"
                  >
                    Send {formatKobo(row.netKobo)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAsking(null)}
                    className="border-text/16 text-text h-9 rounded-pill border px-lg text-[12.5px] font-semibold"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </section>

      <div className="flex min-w-0 flex-col gap-3.5">
        {owing.length > 0 && (
          <section className="bg-ops-surface min-w-0 overflow-hidden rounded-[15px]">
            <div className="flex flex-wrap items-center justify-between gap-3 px-[22px] pt-xl pb-2">
              <h2 className="text-text text-[16px]/[1.3] font-semibold">
                Cash to collect
              </h2>
              <span className="text-text/62 text-[12.5px] font-light">
                Held from cash orders, beyond what they are owed
              </span>
            </div>
            {owing.map((rider) => (
              <div
                key={rider.id}
                className="border-text/6 flex items-center justify-between gap-3.5 border-t px-[22px] py-3.5"
              >
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-text text-[14px] font-semibold">
                    {rider.name}
                  </span>
                  <span className="text-text/62 text-[12.5px] font-light">
                    Rider · {rider.area}
                  </span>
                </span>
                <span className="text-warning text-[15px] font-bold whitespace-nowrap">
                  {formatKobo(rider.owesKobo)}
                </span>
              </div>
            ))}
          </section>
        )}

        <RefundPanel role={role} />

        <section className="bg-ops-surface flex flex-wrap items-center justify-between gap-3.5 rounded-[15px] px-[22px] py-xl">
          <div className="min-w-0 flex-1">
            <h2 className="text-text text-[15px] font-semibold">
              Clean up push tokens
            </h2>
            <p className="text-text/62 mt-1.5 text-[12.5px]/[1.5] font-light">
              {ops.pushSwept
                ? `Last run just now · removed ${PUSH_SWEEP.deadTokens} dead tokens from ${PUSH_SWEEP.devices.toLocaleString("en-NG")} devices`
                : `Removes phones that no longer get notifications · last run ${PUSH_SWEEP.lastRun}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => sweepPushTokens(PUSH_SWEEP.deadTokens)}
            className="border-text/18 text-text h-10 rounded-pill border px-[18px] text-[13px] font-semibold whitespace-nowrap"
          >
            Run now
          </button>
        </section>
      </div>
    </div>
  );
}

/**
 * Refund by order number, because that is what the customer reads out. The
 * panel refuses in three different ways on purpose — not found, cash order,
 * wrong role — and each says what to do instead.
 */
function RefundPanel({ role }: { role: AdminRole }) {
  const ops = useOps();
  const orders = applyOrderOverrides(ops);

  const [query, setQuery] = useState("");
  const [found, setFound] = useState<string | null>(null);
  const [missed, setMissed] = useState(false);
  const [note, setNote] = useState("");
  const [asking, setAsking] = useState(false);

  const order = found ? (orders.find((o) => o.id === found) ?? null) : null;
  const done = !!order && !!ops.refundedOrders[order.id];
  const totals = order ? orderTotals(order, !!ops.creditedOrders[order.id]) : null;

  const line = order
    ? `${totals!.total} back to ${order.customerName.split(" ")[0]} by ${PAYMENT_LABEL[
        order.payment
      ].toLowerCase()} within 24 h`
    : "";

  function look() {
    const wanted = query.trim().toUpperCase();
    const hit = orders.find((o) => o.id === wanted);
    setFound(hit ? hit.id : null);
    setMissed(!hit);
    setAsking(false);
    setNote("");
  }

  return (
    <section
      data-theme="light"
      className="bg-ops-surface text-text flex flex-col gap-3.5 rounded-[15px] p-[22px]"
    >
      <div>
        <h2 className="text-[17px] font-bold tracking-[-0.02em]">
          Refund an order
        </h2>
        <p className="text-text/62 mt-1.5 text-[13px]/[1.5]">
          Enter the order number from the customer&rsquo;s receipt.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setFound(null);
            setMissed(false);
          }}
          onKeyDown={(event) => event.key === "Enter" && look()}
          placeholder="KG-2196"
          aria-label="Order number"
          className="border-text/16 text-text placeholder:text-text/40 h-[46px] min-w-0 flex-1 rounded-pill border px-lg text-[14px] font-semibold uppercase outline-none"
        />
        <button
          type="button"
          onClick={look}
          className="bg-text text-ops-surface h-[46px] rounded-pill px-lg text-[13.5px] font-bold"
        >
          Find
        </button>
      </div>

      {missed && (
        <span className="text-danger text-[13px] font-medium">
          No order {query.trim().toUpperCase()}. Check the number and try again.
        </span>
      )}

      {order && totals && (
        <>
          <div
            data-anim="drop"
            className="bg-text/5 flex flex-col gap-1.5 rounded-[14px] p-3.5 text-[13px]/[1.45]"
          >
            <div className="flex items-baseline justify-between gap-2.5">
              <strong className="min-w-0">
                {order.id} · {order.customerName}
              </strong>
              <span className="font-extrabold">{totals.total}</span>
            </div>
            <span className="text-text/62">
              {order.kitchen} · {order.area} · placed {placedAt(order)}
            </span>
            <span className="text-text/62">{PAYMENT_LABEL[order.payment]}</span>
          </div>

          {done ? (
            <span className="bg-accent/22 text-accent-text grid h-[46px] place-items-center rounded-pill text-[13.5px] font-bold">
              ✓ Refund sent · {line}
            </span>
          ) : order.payment === "cash" ? (
            <span className="text-text/62 text-[13px]/[1.5] font-medium">
              Cash on delivery: nothing was charged online, so there&rsquo;s
              nothing to refund here.
            </span>
          ) : role !== "SUPER_ADMIN" ? (
            <span className="text-text/62 text-[13px]/[1.5] font-medium">
              Refunds need a super admin. Ask one to send it.
            </span>
          ) : (
            <>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={2}
                placeholder="Note for the audit log (optional)"
                className="border-text/16 text-text placeholder:text-text/40 resize-y rounded-xl border px-3 py-2.5 text-[13px]/[1.45] outline-none"
              />
              {asking ? (
                <div
                  data-anim="drop"
                  className="bg-danger-bg flex flex-col gap-2.5 rounded-[14px] px-3.5 py-3"
                >
                  <span className="text-text/85 text-[13px]/[1.5]">
                    {line}. This can&rsquo;t be undone.
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        refundOrder(order.id, totals.total);
                        setAsking(false);
                      }}
                      className="bg-danger text-ops-surface h-9 rounded-pill px-lg text-[12.5px] font-bold"
                    >
                      Refund {totals.total}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAsking(false)}
                      className="border-text/16 text-text h-9 rounded-pill border px-lg text-[12.5px] font-semibold"
                    >
                      Back
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAsking(true)}
                  className={cn(
                    "border-danger/30 text-danger h-[46px] rounded-pill border",
                    "text-[13.5px] font-bold",
                  )}
                >
                  Refund {totals.total}
                </button>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
