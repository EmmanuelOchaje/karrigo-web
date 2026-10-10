"use client";

import { durationLabel } from "@/lib/admin/format";
import { isActive, isLate, type LiveOrder } from "@/lib/admin/orders";
import { useNow } from "@/components/admin/useNow";

/** Under this, the clock shows seconds — the 3-minute accept window is the
 *  one an operator watches tick down. Past it, whole minutes are enough. */
const SECONDS_BELOW_MINUTES = 10;

/**
 * How long an order has been going, re-read every second from when it was
 * placed. Finished orders hold their server-rendered figure: nothing about
 * them is still running.
 */
export function useLiveElapsed(order: LiveOrder): {
  label: string;
  late: boolean;
} {
  const now = useNow();
  if (!now || !isActive(order)) {
    return { label: durationLabel(order.elapsedMinutes), late: order.late };
  }

  const seconds = Math.max(
    0,
    Math.floor((now - new Date(order.placedAt).getTime()) / 1000),
  );
  const minutes = Math.floor(seconds / 60);
  const label =
    minutes < SECONDS_BELOW_MINUTES
      ? `${minutes}:${String(seconds % 60).padStart(2, "0")}`
      : durationLabel(minutes);

  return { label, late: isLate(order.status, minutes) };
}
