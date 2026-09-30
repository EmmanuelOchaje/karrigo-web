"use client";

import { formatClock } from "@/lib/admin/derive";
import { SHIFT_NOW } from "@/lib/admin/fixtures";
import { say } from "@/lib/admin/store";

/**
 * TODO(M8): the board streams over Supabase Realtime and this becomes a
 * manual re-sync for a flaky connection. Until then it confirms the time the
 * numbers are from, which is the thing ops actually wants to know when they
 * reach for it.
 */
export function RefreshButton() {
  return (
    <button
      type="button"
      onClick={() => say(`Updated ${formatClock(SHIFT_NOW)}`)}
      className="border-text/16 text-text h-[38px] rounded-pill border px-[18px] text-[13px] font-semibold"
    >
      Refresh
    </button>
  );
}
