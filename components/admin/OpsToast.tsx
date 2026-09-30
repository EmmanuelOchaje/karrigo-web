"use client";

import { useOps } from "@/lib/admin/store";

/** Confirmation of the last thing ops did. Announced politely so a screen
 *  reader hears "Rider assigned" without losing the user's place. */
export function OpsToast() {
  const { toast } = useOps();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-xxl z-50 flex justify-center px-lg"
    >
      {toast && (
        <div
          key={toast}
          data-anim="toast"
          className="bg-text text-bg rounded-pill px-xl py-3 text-[13.5px] font-semibold shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)]"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
