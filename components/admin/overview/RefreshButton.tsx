"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { say } from "@/lib/admin/store";

/** Re-reads every number on the page from the server. */
export function RefreshButton() {
  const router = useRouter();
  const [busy, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() =>
        startTransition(() => {
          router.refresh();
          say("Updated just now");
        })
      }
      className="border-text/16 text-text h-[38px] rounded-pill border px-[18px] text-[13px] font-semibold disabled:opacity-50"
    >
      {busy ? "Refreshing…" : "Refresh"}
    </button>
  );
}
