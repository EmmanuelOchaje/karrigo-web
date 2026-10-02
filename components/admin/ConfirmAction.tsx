"use client";

import { useState, useTransition } from "react";

import { cn } from "@/lib/cn";
import { say } from "@/lib/admin/store";

type Result = { ok: true; message: string } | { ok: false; error: string };

/**
 * One button behind every consequential ops action. It never acts on the
 * first click: it says, in plain words, what is about to happen, and asks for
 * a reason when the person on the other end will be shown one.
 */
export function ConfirmAction({
  label,
  title,
  text,
  confirm,
  tone = "dark",
  note,
  size = "md",
  run,
}: {
  label: string;
  title: string;
  text?: string;
  /** The confirm button's label — "Suspend", "Hide review". */
  confirm: string;
  tone?: "go" | "bad" | "dark" | "line";
  /** Ask for a reason. `required` blocks the confirm until one is typed. */
  note?: { placeholder: string; required?: boolean };
  size?: "sm" | "md";
  run: (note: string) => Promise<Result>;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, startTransition] = useTransition();
  const blocked = !!note?.required && !reason.trim();

  const button = cn(
    "rounded-pill font-bold whitespace-nowrap disabled:opacity-40",
    size === "sm" ? "h-8 px-3.5 text-[12px]" : "h-10 px-[18px] text-[13px]",
    tone === "go" && "bg-accent text-on-accent",
    tone === "dark" && "bg-text text-ops-surface",
    tone === "bad" && "border-danger/30 text-danger border",
    tone === "line" && "border-text/16 text-text border font-semibold",
  );

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={button}>
        {label}
      </button>
    );
  }

  return (
    <div
      data-anim="drop"
      className={cn(
        "flex w-full flex-col gap-2.5 rounded-[15px] p-3.5",
        tone === "bad" ? "bg-danger-bg" : tone === "go" ? "bg-accent/14" : "bg-text/6",
      )}
    >
      <span className="text-text text-[13.5px] font-semibold">{title}</span>
      {text && <span className="text-text/80 text-[12.5px]/[1.5]">{text}</span>}
      {note && (
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          placeholder={note.placeholder}
          className="border-text/16 bg-ops-surface text-text placeholder:text-text/45 rounded-xl border px-3 py-2 text-[12.5px] outline-none"
        />
      )}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={blocked || busy}
          onClick={() =>
            startTransition(async () => {
              const result = await run(reason.trim());
              say(result.ok ? result.message : result.error);
              if (result.ok) {
                setOpen(false);
                setReason("");
              }
            })
          }
          className={cn(
            "h-9 rounded-pill px-lg text-[12.5px] font-bold disabled:opacity-40",
            tone === "bad" ? "bg-danger text-ops-surface" : tone === "go" ? "bg-accent text-on-accent" : "bg-text text-ops-surface",
          )}
        >
          {busy ? "Working…" : confirm}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="border-text/16 text-text h-9 rounded-pill border px-lg text-[12.5px] font-semibold"
        >
          Back
        </button>
      </div>
    </div>
  );
}
