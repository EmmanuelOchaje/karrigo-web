"use client";

import { useOrderState } from "@/lib/order/store";

/** The hero phone's "deliver to" line: whatever the visitor has typed into the
 *  hero form, or the design's sample landmark until they type something. */
export function DeliveryLabel({ fallback }: { fallback: string }) {
  const { landmark, address } = useOrderState();
  return <span className="truncate">{landmark.trim() || address.trim() || fallback}</span>;
}
