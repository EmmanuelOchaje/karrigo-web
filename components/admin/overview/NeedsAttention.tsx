"use client";

import Link from "next/link";

import { cn } from "@/lib/cn";
import { ATTENTION, ATTENTION_EFFECTS } from "@/lib/admin/fixtures";
import { resolveAttention, useOps } from "@/lib/admin/store";
import { formatClock } from "@/lib/admin/derive";
import { SHIFT_NOW } from "@/lib/admin/fixtures";

/**
 * The only part of the overview that is a to-do list rather than a readout.
 * Each row states the problem, the context needed to judge it, and the single
 * action that deals with it — so a dispatcher can clear the list without
 * opening anything else.
 *
 * Acting here changes the board: giving credit on a late order and assigning
 * a rider both show up on Live orders straight away.
 */
export function NeedsAttention() {
  const ops = useOps();

  return (
    <section className="bg-ops-surface flex min-w-0 flex-col rounded-[15px] px-xl pt-xl pb-3">
      <div className="mb-md flex items-center justify-between">
        <h2 className="text-text text-[16px] font-semibold">Needs attention</h2>
        <Link
          href="/issues"
          className="text-text/62 text-[12.5px] font-medium hover:text-text"
        >
          All issues
        </Link>
      </div>

      {ATTENTION.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-2.5 py-10 text-center">
          <span className="bg-success-bg grid size-10 place-items-center rounded-full">
            <span className="bg-success size-3 rounded-full" />
          </span>
          <span className="text-text text-[14px] font-semibold">
            Nothing needs you right now
          </span>
          <span className="text-text/62 text-[13px] font-light">
            New problems show up here the moment they happen.
          </span>
        </div>
      ) : (
        <ul className="flex flex-col">
          {ATTENTION.map((item) => {
            const done = !!ops.resolvedAttention[item.id];
            return (
              <li
                key={item.id}
                className={cn(
                  "border-text/7 grid grid-cols-[4px_minmax(0,1fr)_auto] items-center gap-3 border-t py-2.5",
                  done && "opacity-55",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "self-stretch rounded-pill",
                    item.severity === "danger" ? "bg-danger" : "bg-warning",
                  )}
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-text text-[13.5px]/[1.35] font-semibold text-pretty">
                    {item.title}
                  </span>
                  <span className="text-text/62 text-[12px] font-light">
                    {item.meta}
                  </span>
                </div>
                {done ? (
                  <span className="text-success text-[12px] font-medium whitespace-nowrap">
                    ✓ {item.doneLabel} · {formatClock(SHIFT_NOW)}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      resolveAttention(
                        item.id,
                        item.doneLabel,
                        ATTENTION_EFFECTS[item.id],
                      )
                    }
                    className="bg-accent text-on-accent h-8 rounded-pill px-3.5 text-[12px] font-bold whitespace-nowrap"
                  >
                    {item.action}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
