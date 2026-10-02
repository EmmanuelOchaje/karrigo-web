"use client";

import { useState, useTransition } from "react";

import { formatKobo } from "@/lib/money";
import { say } from "@/lib/admin/store";
import { giveCredit } from "@/app/(admin)/admin/order-actions";

/** Store credit for one customer, applied in full at their next checkout. */
export function CreditForm({ customerId, name }: { customerId: string; name: string }) {
  const [naira, setNaira] = useState("500");
  const [note, setNote] = useState("");
  const [busy, startTransition] = useTransition();
  const kobo = Math.round(Number(naira || 0) * 100);

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!kobo) return;
        startTransition(async () => {
          const result = await giveCredit(customerId, kobo, note.trim() || `Goodwill credit for ${name}`);
          say(result.ok ? result.message : result.error);
          if (result.ok) setNote("");
        });
      }}
    >
      <label className="text-text flex items-center gap-1.5 text-[13px] font-semibold">
        ₦
        <input
          value={naira}
          onChange={(e) => setNaira(e.target.value.replace(/\D/g, ""))}
          inputMode="numeric"
          aria-label="Credit in naira"
          className="border-text/16 bg-ops-surface h-9 w-[90px] rounded-xl border px-3 text-[13px] outline-none"
        />
      </label>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Why (saved to the audit log)"
        className="border-text/16 bg-ops-surface text-text placeholder:text-text/45 h-9 min-w-0 flex-1 rounded-xl border px-3 text-[12.5px] outline-none"
      />
      <button
        type="submit"
        disabled={busy || !kobo}
        className="bg-accent text-on-accent h-9 rounded-pill px-lg text-[12.5px] font-bold disabled:opacity-40"
      >
        {busy ? "Sending…" : `Give ${kobo ? formatKobo(kobo) : "credit"}`}
      </button>
    </form>
  );
}
