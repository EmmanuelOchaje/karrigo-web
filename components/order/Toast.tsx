"use client";

import { useOrderState } from "@/lib/order/store";

export function Toast() {
  const { toast } = useOrderState();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-xxl z-50 flex justify-center px-screen-x">
      {toast && (
        <div
          data-theme="dark"
          className="bg-bg text-cream rounded-pill text-site-label toast-in px-xl py-md text-center font-semibold shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)]"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
