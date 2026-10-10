"use client";

import { useEffect, useState } from "react";

import type { Schemas } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { readPublicTracking } from "@/app/(order)/track/[token]/actions";

type Tracking = Schemas["PublicTrackingResponseDto"];
type Status = Tracking["status"];

const STEPS = [
  { label: "Placed", statuses: ["PLACED", "AWAITING_PAYMENT"] },
  { label: "Accepted", statuses: ["ACCEPTED"] },
  { label: "Preparing", statuses: ["PREPARING", "READY"] },
  { label: "On the way", statuses: ["PICKED_UP", "DELIVERING"] },
  { label: "Delivered", statuses: ["DELIVERED"] },
] satisfies { label: string; statuses: Status[] }[];

const TERMINAL: Status[] = ["DELIVERED", "CANCELLED", "REFUNDED"];

function timeLabel(value: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  }).format(new Date(value));
}

export function PublicTracking({ token, initial }: { token: string; initial: Tracking }) {
  const [tracking, setTracking] = useState(initial);
  const over = TERMINAL.includes(tracking.status);

  useEffect(() => {
    if (over) return;
    const timer = window.setInterval(async () => {
      const result = await readPublicTracking(token);
      if (result.ok) setTracking(result.tracking);
    }, 25_000);
    return () => window.clearInterval(timer);
  }, [over, token]);

  const cancelled = tracking.status === "CANCELLED" || tracking.status === "REFUNDED";
  const stage = Math.max(
    0,
    STEPS.findIndex((step) => (step.statuses as Status[]).includes(tracking.status)),
  );
  const onRoad = tracking.rider?.lat != null && tracking.rider.lng != null;

  return (
    <main className="bg-bg text-text min-h-dvh px-lg py-xxl">
      <section className="bg-surface rounded-panel-lg mx-auto max-w-[680px] p-xxl md:p-pad-card">
        <p className="text-label text-text-secondary font-bold tracking-[0.06em] uppercase">
          Order {tracking.code}
        </p>
        <h1 className="text-panel-small mt-sm">
          {cancelled
            ? "This order was cancelled"
            : tracking.status === "DELIVERED"
              ? "Delivered. Enjoy!"
              : STEPS[stage].label}
        </h1>
        <p className="text-site-body text-text-secondary mt-md">
          Placed {timeLabel(tracking.placedAt)}
          {tracking.etaMinutes != null ? ` · About ${tracking.etaMinutes} min away` : ""}
        </p>

        {!cancelled && (
          <ol className="mt-xxl gap-lg flex flex-col">
            {STEPS.map((step, index) => (
              <li
                key={step.label}
                className={cn(
                  "text-site-body gap-md flex items-center font-semibold",
                  index <= stage ? "text-text" : "text-text-secondary",
                )}
              >
                <span
                  className={cn(
                    "size-[12px] shrink-0 rounded-full",
                    index <= stage ? "bg-accent" : "bg-text/18",
                  )}
                />
                {step.label}
              </li>
            ))}
          </ol>
        )}

        <div className="border-text/10 mt-xxl border-t pt-xl">
          <h2 className="text-site-question">Your order</h2>
          <ul className="mt-md gap-sm flex flex-col">
            {tracking.kitchens.map((kitchen) => (
              <li key={kitchen.name} className="text-site-body flex justify-between gap-md">
                <span>{kitchen.name}</span>
                <span className="text-text-secondary">{kitchen.status.replaceAll("_", " ").toLowerCase()}</span>
              </li>
            ))}
          </ul>
        </div>

        {tracking.rider && (
          <div className="bg-text/5 rounded-step mt-xl px-lg py-md">
            <p className="text-site-question">{tracking.rider.firstName ?? "Your rider"}</p>
            <p className="text-label text-text-secondary mt-[3px]">
              {onRoad ? "On the road with your order" : "Assigned to your order"}
            </p>
          </div>
        )}

        {tracking.deliveredAt && (
          <p className="text-site-body text-text-secondary mt-xl">
            Delivered {timeLabel(tracking.deliveredAt)}
          </p>
        )}
      </section>
    </main>
  );
}
