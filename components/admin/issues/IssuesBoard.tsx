"use client";

import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/cn";
import { TICKETS } from "@/lib/admin/fixtures";
import { setTicketStatus, useOps } from "@/lib/admin/store";
import {
  TICKET_STATUS_LABEL,
  type Ticket,
  type TicketStatus,
} from "@/lib/admin/types";
import { CountTab, EmptyState, StatusChip, type Tone } from "@/components/admin/ui";

const ORDER: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const TONE: Record<TicketStatus, Tone> = {
  OPEN: "warning",
  IN_PROGRESS: "info",
  RESOLVED: "success",
  CLOSED: "muted",
};

/** What can be done from each state, and what the toast says afterwards. */
const MOVES: Record<
  TicketStatus,
  { label: string; to: TicketStatus; said: string; tone: "go" | "dark" | "line" }[]
> = {
  OPEN: [
    {
      label: "Start working on it",
      to: "IN_PROGRESS",
      said: "Moved to in progress",
      tone: "dark",
    },
    { label: "Mark resolved", to: "RESOLVED", said: "Marked resolved", tone: "go" },
  ],
  IN_PROGRESS: [
    { label: "Mark resolved", to: "RESOLVED", said: "Marked resolved", tone: "go" },
    { label: "Back to open", to: "OPEN", said: "Moved back to open", tone: "line" },
  ],
  RESOLVED: [
    { label: "Close ticket", to: "CLOSED", said: "Ticket closed", tone: "dark" },
    { label: "Reopen", to: "OPEN", said: "Ticket reopened", tone: "line" },
  ],
  CLOSED: [
    { label: "Reopen", to: "OPEN", said: "Ticket reopened", tone: "line" },
  ],
};

/**
 * Complaints from customers, riders and kitchens, from inside the app and
 * from WhatsApp. WhatsApp is most of it in practice, which is why a thread
 * carries a button that opens the actual conversation rather than a reply box
 * we would have to build and nobody would use.
 */
export function IssuesBoard() {
  const ops = useOps();
  const tickets: Ticket[] = TICKETS.map((ticket) => ({
    ...ticket,
    status: ops.ticketStatus[ticket.id] ?? ticket.status,
  }));

  const [tab, setTab] = useState<TicketStatus>("OPEN");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const list = tickets.filter((ticket) => ticket.status === tab);
  const selected =
    list.find((ticket) => ticket.id === selectedId) ?? list[0] ?? null;

  return (
    <div className="flex flex-wrap items-start gap-3.5">
      <section className="bg-ops-surface min-w-0 flex-[3_1_440px] rounded-[15px]">
        <div className="border-text/6 flex flex-wrap gap-2 border-b px-lg py-3.5">
          {ORDER.map((status) => (
            <CountTab
              key={status}
              label={TICKET_STATUS_LABEL[status]}
              count={tickets.filter((t) => t.status === status).length}
              selected={tab === status}
              onClick={() => {
                setTab(status);
                setSelectedId(null);
              }}
            />
          ))}
        </div>

        {list.length === 0 ? (
          <EmptyState
            title={`Nothing ${TICKET_STATUS_LABEL[tab].toLowerCase()}`}
            text="Messages from customers, riders and kitchens arrive here."
          />
        ) : (
          list.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => setSelectedId(ticket.id)}
              className={cn(
                "border-text/6 hover:bg-text/4 flex w-full items-start justify-between gap-3 border-b px-lg py-3.5 text-left",
                selected?.id === ticket.id && "bg-accent/8",
              )}
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-text truncate text-[13.5px] font-semibold">
                  {ticket.subject}
                </span>
                <span className="text-text/55 truncate text-[12px] font-light">
                  {ticket.fromName} · {ticket.fromType.toLowerCase()}
                  {ticket.orderId ? ` · ${ticket.orderId}` : ""}
                </span>
              </span>
              <span className="flex flex-none flex-col items-end gap-1.5">
                <StatusChip tone={ticket.channel === "WHATSAPP" ? "success" : "muted"}>
                  {ticket.channel === "WHATSAPP" ? "WhatsApp" : "In app"}
                </StatusChip>
                <span className="text-text/55 text-[11.5px] font-light">
                  {ticket.age}
                </span>
              </span>
            </button>
          ))
        )}
      </section>

      <aside className="sticky top-5 min-w-0 max-w-full flex-[2_1_360px]">
        {selected ? (
          <TicketDetail ticket={selected} onMoved={() => setSelectedId(null)} />
        ) : (
          <div
            data-theme="light"
            className="bg-ops-surface text-text/62 rounded-[15px] px-lg py-[60px] text-center text-[14px]"
          >
            Pick a ticket to read it.
          </div>
        )}
      </aside>
    </div>
  );
}

function TicketDetail({
  ticket,
  onMoved,
}: {
  ticket: Ticket;
  onMoved: () => void;
}) {
  return (
    <div
      data-theme="light"
      className="bg-ops-surface text-text overflow-hidden rounded-[15px]"
    >
      <header className="border-text/8 flex items-start justify-between gap-3 border-b px-[22px] py-lg">
        <div className="min-w-0">
          <h2 className="text-[18px]/[1.2] font-extrabold tracking-[-0.02em] text-pretty">
            {ticket.subject}
          </h2>
          <p className="text-text/62 mt-2 text-[12.5px]">
            {ticket.fromName} · {ticket.fromType.toLowerCase()} ·{" "}
            {ticket.channel === "WHATSAPP" ? "WhatsApp" : "In the app"} ·{" "}
            {ticket.age}
          </p>
        </div>
        <StatusChip tone={TONE[ticket.status]}>
          {TICKET_STATUS_LABEL[ticket.status]}
        </StatusChip>
      </header>

      <p className="border-text/8 text-text/85 border-b px-[22px] py-lg text-[13.5px]/[1.6]">
        {ticket.body}
      </p>

      <div className="flex flex-wrap gap-2 px-[22px] py-lg">
        {ticket.orderId && (
          <Link
            href={`/orders?order=${ticket.orderId}`}
            className="border-text/16 text-text flex h-10 items-center rounded-pill border px-lg text-[13px] font-semibold"
          >
            Open {ticket.orderId}
          </Link>
        )}
        {ticket.channel === "WHATSAPP" && (
          <a
            href={`https://wa.me/${ticket.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-success-bg text-success flex h-10 items-center rounded-pill px-lg text-[13px] font-bold"
          >
            Reply on WhatsApp
          </a>
        )}
      </div>

      <div className="border-text/8 flex flex-wrap gap-2 border-t px-[22px] py-lg">
        {MOVES[ticket.status].map((move) => (
          <button
            key={move.label}
            type="button"
            onClick={() => {
              setTicketStatus(ticket.id, move.to, move.said);
              onMoved();
            }}
            className={cn(
              "h-10 rounded-pill px-[18px] text-[13px] font-bold",
              move.tone === "go"
                ? "bg-accent text-on-accent"
                : move.tone === "dark"
                  ? "bg-text text-ops-surface"
                  : "border-text/16 text-text border font-semibold",
            )}
          >
            {move.label}
          </button>
        ))}
      </div>
    </div>
  );
}
