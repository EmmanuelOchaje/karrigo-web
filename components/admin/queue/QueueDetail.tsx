"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import { formatKobo } from "@/lib/money";
import {
  QUEUE_STATUS_LABEL,
  balanceFields,
  payoutKobo,
  type QueueItem,
  type QueueKind,
  type QueueStatus,
} from "@/lib/admin/queue";
import type { AdminRole } from "@/lib/admin/types";
import { Eyebrow, StatusChip, type Tone } from "@/components/admin/ui";

type Decision = "approve" | "reject" | "suspend" | "payout";

const TONE: Record<QueueStatus, Tone> = {
  PENDING: "warning",
  ACTIVE: "success",
  APPROVED: "success",
  SUSPENDED: "danger",
  REJECTED: "danger",
};

/**
 * One application, and the decision about it.
 *
 * Every decision goes through a confirm step that says what will happen in
 * plain words — who can order from them straight away, what the rider will
 * see, how much money leaves and that it cannot be undone. Rejecting and
 * suspending require a reason, because the applicant is shown it and "you
 * were rejected" with no reason is how we lose a kitchen that only needed to
 * re-photograph a licence.
 */
export function QueueDetail({
  kind,
  item,
  role,
  onDecide,
  onPayout,
}: {
  kind: QueueKind;
  item: QueueItem;
  role: AdminRole;
  onDecide: (
    item: QueueItem,
    status: QueueStatus,
    note: string,
    message: string,
  ) => void;
  onPayout: () => void;
}) {
  const [pending, setPending] = useState<Decision | null>(null);
  const [note, setNote] = useState("");
  const [viewing, setViewing] = useState<string | null>(null);

  const isKitchen = kind === "kitchens";
  const noun = isKitchen ? "kitchen" : "rider";
  const net = payoutKobo(item);

  function reset() {
    setPending(null);
    setNote("");
  }

  const confirm = pending ? describe(pending) : null;

  function describe(decision: Decision) {
    switch (decision) {
      case "approve":
        return {
          title:
            item.status === "SUSPENDED"
              ? `Put ${item.title} back live?`
              : `Approve ${item.title}?`,
          text: isKitchen
            ? `Customers in ${item.fields[3].value} can order from them straight away.`
            : "They can go online and receive trip offers.",
          button:
            isKitchen && item.status === "SUSPENDED" ? "Reactivate" : "Approve",
          tone: "go" as const,
          requiresNote: false,
          run: () =>
            onDecide(
              item,
              isKitchen ? "ACTIVE" : "APPROVED",
              note.trim(),
              `${item.title} ${isKitchen ? "is live" : "approved"}`,
            ),
        };
      case "reject":
        return {
          title: `Reject ${item.title}?`,
          text: isKitchen
            ? "The kitchen is marked suspended. Add a note so they know what to fix."
            : "The rider sees this note in the app and can re-upload.",
          button: "Reject",
          tone: "bad" as const,
          requiresNote: !isKitchen,
          run: () =>
            onDecide(
              item,
              isKitchen ? "SUSPENDED" : "REJECTED",
              note.trim(),
              `${item.title} rejected`,
            ),
        };
      case "suspend":
        return {
          title: `Suspend ${item.title}?`,
          text: "They disappear from the customer app until reactivated. Open orders still complete.",
          button: "Suspend",
          tone: "bad" as const,
          requiresNote: true,
          run: () =>
            onDecide(item, "SUSPENDED", note.trim(), `${item.title} suspended`),
        };
      case "payout":
        return {
          title: `Send ${formatKobo(net)} to ${item.title}?`,
          text: isKitchen
            ? "Settles every unpaid completed order in one Paystack transfer. This can't be undone."
            : `${formatKobo(item.unpaidKobo)} trip pay minus ${formatKobo(
                item.cashHeldKobo,
              )} cash already held. One Paystack transfer, can't be undone.`,
          button: `Send ${formatKobo(net)}`,
          tone: "dark" as const,
          requiresNote: false,
          run: () => {
            onPayout();
            reset();
          },
        };
    }
  }

  const actions: { label: string; decision: Decision; tone: "go" | "bad" | "dark" }[] =
    [];
  if (item.status === "PENDING") {
    actions.push({
      label: isKitchen ? "Approve and go live" : "Approve rider",
      decision: "approve",
      tone: "go",
    });
    actions.push({
      label: isKitchen ? "Reject" : "Reject with note",
      decision: "reject",
      tone: "bad",
    });
  }
  if (item.status === "ACTIVE" || item.status === "APPROVED") {
    // Only a super admin moves money. The server action checks this too —
    // hiding the button is the courtesy, not the control.
    if (net > 0 && role === "SUPER_ADMIN") {
      actions.push({
        label: `Pay out ${formatKobo(net)}`,
        decision: "payout",
        tone: "dark",
      });
    }
    if (isKitchen) {
      actions.push({ label: "Suspend kitchen", decision: "suspend", tone: "bad" });
    }
  }
  if (item.status === "SUSPENDED") {
    actions.push({ label: "Reactivate kitchen", decision: "approve", tone: "go" });
  }

  const fields = [...item.fields, ...balanceFields(kind, item)];
  const blocked = !!confirm?.requiresNote && !note.trim();

  return (
    <div
      data-theme="light"
      className="bg-ops-surface text-text overflow-hidden rounded-[15px]"
    >
      <header className="border-text/8 flex items-start justify-between gap-3 border-b px-[22px] py-lg">
        <div className="min-w-0">
          <h2 className="truncate text-[20px]/none font-extrabold tracking-[-0.03em]">
            {item.title}
          </h2>
          <p className="text-text/62 mt-2 text-[12.5px]">{item.sub}</p>
        </div>
        <StatusChip tone={TONE[item.status]}>
          {QUEUE_STATUS_LABEL[item.status]}
        </StatusChip>
      </header>

      {item.note && (
        <p className="bg-danger-bg text-text/85 border-text/8 border-b px-[22px] py-3 text-[12.5px]/[1.5]">
          {item.note}
        </p>
      )}

      <dl className="border-text/8 grid grid-cols-2 gap-x-3 gap-y-3.5 border-b px-[22px] py-lg">
        {fields.map((field) => (
          <div key={field.key} className="flex min-w-0 flex-col gap-1">
            <Eyebrow className="text-[10.5px]">{field.key}</Eyebrow>
            <dd className="truncate text-[13px] font-semibold">{field.value}</dd>
          </div>
        ))}
      </dl>

      <ul className="border-text/8 flex flex-col gap-2.5 border-b px-[22px] py-lg">
        {item.checks.map((check) => (
          <li key={check.label} className="flex items-center gap-2.5">
            <span
              className={cn(
                "grid size-5 flex-none place-items-center rounded-full text-[12px] font-bold",
                check.ok
                  ? "bg-success-bg text-success"
                  : "bg-warning-bg text-warning",
              )}
            >
              {check.ok ? "✓" : "!"}
            </span>
            <span className="flex-1 text-[13px]">{check.label}</span>
            {check.document && check.ok && (
              <button
                type="button"
                onClick={() => setViewing(`${check.label} · ${item.title}`)}
                className="text-accent-text text-[12px] font-semibold"
              >
                View
              </button>
            )}
          </li>
        ))}
      </ul>

      {confirm ? (
        <div className="flex flex-col gap-2.5 px-[22px] py-lg">
          <div
            className={cn(
              "flex flex-col gap-2.5 rounded-[15px] p-3.5",
              confirm.tone === "bad"
                ? "bg-danger-bg"
                : confirm.tone === "go"
                  ? "bg-accent/14"
                  : "bg-text/6",
            )}
          >
            <span className="text-[13.5px] font-semibold">{confirm.title}</span>
            <span className="text-text/80 text-[12.5px]/[1.5]">{confirm.text}</span>
            {(pending === "reject" || pending === "suspend") && (
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={2}
                placeholder={
                  confirm.requiresNote
                    ? `Reason (required) · the ${noun} sees this`
                    : "Reason (optional)"
                }
                className="border-text/16 bg-ops-surface text-text placeholder:text-text/45 rounded-xl border px-3 py-2 text-[12.5px] outline-none"
              />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={blocked}
                onClick={confirm.run}
                className={cn(
                  "h-9 rounded-pill px-lg text-[12.5px] font-bold disabled:opacity-40",
                  confirm.tone === "bad"
                    ? "bg-danger text-ops-surface"
                    : confirm.tone === "go"
                      ? "bg-accent text-on-accent"
                      : "bg-text text-ops-surface",
                )}
              >
                {confirm.button}
              </button>
              <button
                type="button"
                onClick={reset}
                className="border-text/16 text-text h-9 rounded-pill border px-lg text-[12.5px] font-semibold"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      ) : (
        actions.length > 0 && (
          <div className="flex flex-wrap gap-2 px-[22px] py-lg">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => {
                  setPending(action.decision);
                  setNote("");
                }}
                className={cn(
                  "h-10 rounded-pill px-[18px] text-[13px] font-bold",
                  action.tone === "go"
                    ? "bg-accent text-on-accent"
                    : action.tone === "dark"
                      ? "bg-text text-ops-surface"
                      : "border-danger/30 text-danger border",
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        )
      )}

      {viewing && (
        <div
          data-anim="fade"
          className="bg-scrim fixed inset-0 z-50 grid place-items-center p-lg"
          onClick={() => setViewing(null)}
        >
          <div className="bg-ops-surface flex w-[min(520px,100%)] flex-col gap-3 rounded-[20px] p-xl">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[14px] font-semibold">{viewing}</span>
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="text-text/62 text-[13px] font-semibold"
              >
                Close
              </button>
            </div>
            {/* TODO(M9): the uploaded file from Supabase storage, behind a
                short-lived signed URL — these are identity documents. */}
            <div className="bg-text/6 text-text/45 grid h-[280px] place-items-center rounded-[15px] text-[13px]">
              Document preview
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
