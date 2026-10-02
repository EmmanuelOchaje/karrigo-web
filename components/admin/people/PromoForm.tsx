"use client";

import { useState, useTransition } from "react";

import { say } from "@/lib/admin/store";
import { createPromo } from "@/app/(admin)/admin/people-actions";

const input =
  "border-text/16 bg-ops-surface text-text placeholder:text-text/45 h-10 rounded-xl border px-3 text-[13px] outline-none";
const label = "text-text/62 flex flex-col gap-1.5 text-[11.5px] font-semibold";

/** A new promo code. Code, type and value can't be changed afterwards — only
 *  limits and the on/off switch — so this asks for them carefully once. */
export function PromoForm() {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [value, setValue] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [minNaira, setMinNaira] = useState("");
  const [expires, setExpires] = useState("");
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();

  const n = Number(value);
  const invalid =
    !/^[A-Z0-9]{3,20}$/.test(code) || !n || (type === "PERCENT" && (n < 1 || n > 100));

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (invalid) return setError("Use 3–20 letters or numbers, and a discount above zero (at most 100%).");
        setError("");
        startTransition(async () => {
          const result = await createPromo({
            code,
            description,
            discountType: type,
            value: type === "FIXED" ? Math.round(n * 100) : n,
            maxUses: Number(maxUses) || null,
            minSubtotalKobo: Number(minNaira) ? Math.round(Number(minNaira) * 100) : null,
            expiresAt: expires || null,
          });
          if (!result.ok) return setError(result.error);
          say(result.message);
          setCode("");
          setDescription("");
          setValue("");
          setMaxUses("");
          setMinNaira("");
          setExpires("");
        });
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <label className={label}>
          Code
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} placeholder="SALLAH500" className={`${input} uppercase`} />
        </label>
        <label className={label}>
          Discount
          <span className="flex gap-1.5">
            <select value={type} onChange={(e) => setType(e.target.value as "PERCENT" | "FIXED")} className={`${input} w-[72px]`}>
              <option value="PERCENT">%</option>
              <option value="FIXED">₦</option>
            </select>
            <input value={value} onChange={(e) => setValue(e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" placeholder={type === "PERCENT" ? "10" : "500"} className={`${input} min-w-0 flex-1`} />
          </span>
        </label>
        <label className={label}>
          Max uses (optional)
          <input value={maxUses} onChange={(e) => setMaxUses(e.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="Unlimited" className={input} />
        </label>
        <label className={label}>
          Minimum order, ₦ (optional)
          <input value={minNaira} onChange={(e) => setMinNaira(e.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="None" className={input} />
        </label>
        <label className={label}>
          Expires (optional)
          <input type="date" value={expires} onChange={(e) => setExpires(e.target.value)} className={input} />
        </label>
        <label className={label}>
          Note for ops (optional)
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Sallah promo, WhatsApp" className={input} />
        </label>
      </div>
      {error && <p className="text-danger text-[12.5px] font-medium">{error}</p>}
      <button type="submit" disabled={busy} className="bg-accent text-on-accent h-10 self-start rounded-pill px-[18px] text-[13px] font-bold disabled:opacity-40">
        {busy ? "Creating…" : "Create promo code"}
      </button>
    </form>
  );
}
