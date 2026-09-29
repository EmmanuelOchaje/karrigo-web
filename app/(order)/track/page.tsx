import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackOrder } from "@/components/order/TrackOrder";

export const metadata: Metadata = { title: "Track your order · Karrigo" };

/** Static, with the order id in `?order=` read in the browser — the order
 *  lives on this phone until there is a backend, so the server has nothing
 *  to look up. */
export default function TrackPage() {
  return (
    <Suspense fallback={<div aria-busy="true" className="bg-bg/60 rounded-panel-lg mx-auto h-[420px] max-w-[1240px] animate-pulse" />}>
      <TrackOrder />
    </Suspense>
  );
}
