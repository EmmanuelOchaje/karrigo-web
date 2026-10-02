"use client";

import { useState, useTransition } from "react";

import { saveHours, saveProfile } from "@/app/(order)/my-kitchen/actions";
import { FormError, SubmitButton, field, fieldLabel } from "@/components/partners/parts";
import { cn } from "@/lib/cn";
import type { DayHours } from "@/lib/kitchen/types";
import { Saved, Switch, panel } from "./parts";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
/** Shown Monday first, the way a working week is planned. */
const WEEK = [1, 2, 3, 4, 5, 6, 0];

const timeField =
  "border-field-border focus:border-field-border-active rounded-field text-site-body bg-bg min-w-0 flex-1 border-[1.5px] px-md py-sm font-medium outline-none disabled:opacity-40";

/** The week's opening hours. The backend takes all seven days at once, so
 *  this saves as one form rather than a row at a time. */
export function HoursForm({ days: saved, everSaved }: { days: DayHours[]; everSaved: boolean }) {
  const [days, setDays] = useState(saved);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [busy, startTransition] = useTransition();

  function change(day: number, patch: Partial<DayHours>) {
    setDays((all) => all.map((d) => (d.day === day ? { ...d, ...patch } : d)));
    setError("");
    setDone("");
  }

  return (
    <form
      className={cn(panel, "gap-md flex flex-col")}
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await saveHours(days);
          if (!result.ok) return setError(result.error);
          setError("");
          setDone("Hours saved.");
        });
      }}
    >
      <div>
        <h2 className="text-h1 font-extrabold">Opening hours</h2>
        <p className="text-site-label text-text-secondary mt-xs">
          {everSaved
            ? "The hours customers see on your page."
            : "You haven't set your hours yet. These are a starting point — change them and save."}
        </p>
      </div>

      <ul>
        {WEEK.map((index) => {
          const d = days.find((x) => x.day === index)!;
          return (
            <li key={d.day} className="border-surface-raised gap-md flex flex-wrap items-center border-b py-md last:border-b-0">
              <div className="gap-md flex w-[150px] shrink-0 items-center">
                <Switch
                  checked={!d.closed}
                  label={d.closed ? `Open on ${DAY_NAMES[d.day]}` : `Close on ${DAY_NAMES[d.day]}`}
                  onChange={(open) => change(d.day, { closed: !open })}
                />
                <span className="text-site-question">{DAY_NAMES[d.day]}</span>
              </div>
              {d.closed ? (
                <span className="text-site-label text-text-secondary">Closed all day</span>
              ) : (
                <div className="gap-sm flex min-w-[220px] flex-1 items-center">
                  <input
                    type="time"
                    value={d.open}
                    aria-label={`${DAY_NAMES[d.day]} opening time`}
                    onChange={(e) => change(d.day, { open: e.target.value })}
                    className={timeField}
                  />
                  <span className="text-site-label text-text-secondary">to</span>
                  <input
                    type="time"
                    value={d.close}
                    aria-label={`${DAY_NAMES[d.day]} closing time`}
                    onChange={(e) => change(d.day, { close: e.target.value })}
                    className={timeField}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <FormError>{error}</FormError>
      <Saved>{done}</Saved>
      <SubmitButton busy={busy} idle="Save hours" working="Saving…" />
    </form>
  );
}

export function ProfileForm({ name: savedName, cuisine: savedCuisine, feeKobo }: { name: string; cuisine: string; feeKobo: number }) {
  const [name, setName] = useState(savedName);
  const [cuisine, setCuisine] = useState(savedCuisine);
  const [fee, setFee] = useState(String(Math.round(feeKobo / 100)));
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [busy, startTransition] = useTransition();

  const touch = () => {
    setError("");
    setDone("");
  };

  return (
    <form
      className={cn(panel, "gap-md flex flex-col")}
      onSubmit={(e) => {
        e.preventDefault();
        if (fee === "") return setError("Enter a delivery fee, or 0.");
        startTransition(async () => {
          const result = await saveProfile({ name, cuisine, feeNaira: Number(fee) });
          if (!result.ok) return setError(result.error);
          setError("");
          setDone("Details saved.");
        });
      }}
    >
      <h2 className="text-h1 font-extrabold">Kitchen details</h2>
      <label className={fieldLabel}>
        Kitchen name
        <input value={name} onChange={(e) => { setName(e.target.value); touch(); }} className={field} />
      </label>
      <label className={fieldLabel}>
        What you cook
        <input value={cuisine} onChange={(e) => { setCuisine(e.target.value); touch(); }} placeholder="Swallow, soups & grills" className={field} />
      </label>
      <label className={fieldLabel}>
        Delivery fee, ₦
        <input value={fee} onChange={(e) => { setFee(e.target.value.replace(/\D/g, "")); touch(); }} inputMode="numeric" placeholder="500" className={field} />
      </label>
      <FormError>{error}</FormError>
      <Saved>{done}</Saved>
      <SubmitButton busy={busy} idle="Save details" working="Saving…" />
    </form>
  );
}
