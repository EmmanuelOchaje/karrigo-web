"use client";

import { useState, useTransition } from "react";

import { createArea, renameArea, setAreaActive } from "@/app/(admin)/admin/moderation-actions";
import { ConfirmAction } from "@/components/admin/ConfirmAction";
import { EmptyState, StatusChip } from "@/components/admin/ui";
import type { Schemas } from "@/lib/api/types";
import { say } from "@/lib/admin/store";

const input =
  "border-text/16 bg-ops-surface text-text placeholder:text-text/45 h-10 min-w-0 rounded-xl border px-3 text-[13px] outline-none";

export function AreasBoard({ areas, footer }: { areas: Schemas["AdminAreaResponseDto"][]; footer?: React.ReactNode }) {
  const [name, setName] = useState("");
  const [busy, startTransition] = useTransition();

  return (
    <section className="bg-ops-surface min-w-0 rounded-[15px]">
      <form
        className="border-text/6 flex flex-wrap items-center gap-2 border-b px-lg py-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            const result = await createArea({ name });
            say(result.ok ? result.message : result.error);
            if (result.ok) setName("");
          });
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New area, e.g. Gboko Road"
          aria-label="New area name"
          className={`${input} flex-[1_1_220px]`}
        />
        <button
          type="submit"
          disabled={busy || name.trim().length < 2}
          className="bg-text text-ops-surface h-10 rounded-pill px-[18px] text-[13px] font-bold disabled:opacity-40"
        >
          {busy ? "Adding…" : "Add area"}
        </button>
      </form>

      {areas.length === 0 ? (
        <EmptyState
          title="No areas yet"
          text="Until you add some, checkout and kitchen sign-up use the built-in Makurdi list."
        />
      ) : (
        areas.map((area) => <AreaRow key={area.id} area={area} />)
      )}
      {footer}
    </section>
  );
}

function AreaRow({ area }: { area: Schemas["AdminAreaResponseDto"] }) {
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(area.name);
  const [busy, startTransition] = useTransition();

  return (
    <div className="border-text/6 flex flex-wrap items-center justify-between gap-3 border-b px-lg py-3.5">
      <div className="flex min-w-0 flex-[1_1_240px] items-center gap-2">
        {renaming ? (
          <form
            className="flex min-w-0 flex-1 items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              startTransition(async () => {
                const result = await renameArea(area.id, name);
                say(result.ok ? result.message : result.error);
                if (result.ok) setRenaming(false);
              });
            }}
          >
            <input value={name} onChange={(e) => setName(e.target.value)} aria-label="Area name" className={`${input} flex-1`} />
            <button type="submit" disabled={busy} className="text-accent-text text-[12.5px] font-semibold disabled:opacity-50">
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setName(area.name);
                setRenaming(false);
              }}
              className="text-text/62 text-[12.5px] font-semibold"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <span className="text-text truncate text-[14px] font-semibold">{area.name}</span>
            {!area.isActive && <StatusChip tone="muted">Archived</StatusChip>}
            <button type="button" onClick={() => setRenaming(true)} className="text-accent-text text-[12.5px] font-semibold">
              Rename
            </button>
          </>
        )}
      </div>
      <div className="flex justify-end">
        {area.isActive ? (
          <ConfirmAction
            size="sm"
            tone="line"
            label="Archive"
            title={`Archive ${area.name}?`}
            text="Customers and new kitchens no longer see it in the list. Existing addresses keep it."
            confirm="Archive area"
            run={setAreaActive.bind(null, area.id, false)}
          />
        ) : (
          <ConfirmAction
            size="sm"
            tone="go"
            label="Restore"
            title={`Put ${area.name} back on the list?`}
            confirm="Restore area"
            run={setAreaActive.bind(null, area.id, true)}
          />
        )}
      </div>
    </div>
  );
}
