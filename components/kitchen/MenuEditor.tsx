"use client";

import Image from "next/image";
import { useOptimistic, useState, useTransition } from "react";

import {
  addDish,
  addSection,
  removeDish,
  removeSection,
  saveDish,
  saveSection,
  setSoldOut,
  uploadDishPhoto,
} from "@/app/(order)/my-kitchen/actions";
import { FormError, PhotoUpload, SubmitButton, field, fieldLabel } from "@/components/partners/parts";
import { cn } from "@/lib/cn";
import { formatKobo } from "@/lib/money";
import type { Dish, MenuSection } from "@/lib/kitchen/types";
import { Switch, panel, type Result } from "./parts";

const quiet = "text-accent-text text-site-label font-bold disabled:opacity-50";

/**
 * The whole menu on one page: sections, the dishes in them, and a switch on
 * every dish for the moment the egusi finishes. Editing happens in place —
 * a kitchen changing a price mid-service should not have to leave the list.
 */
export function MenuEditor({ kitchenName, sections }: { kitchenName: string; sections: MenuSection[] }) {
  const options = sections.map((s) => ({ id: s.id, label: s.label }));

  return (
    <div className="gap-lg flex flex-col">
      {sections.length === 0 && (
        <div className={panel}>
          <p className="text-site-title">{kitchenName} has no menu yet</p>
          <p className="text-site-body text-text-secondary mt-xs">
            Start with a section — Swallow, Rice, Drinks — then add the dishes that go in it.
          </p>
        </div>
      )}

      {sections.map((s) => (
        <Section key={s.id} section={s} options={options} />
      ))}

      <NewSection first={sections.length === 0} />
    </div>
  );
}

function Section({ section, options }: { section: MenuSection; options: { id: string; label: string }[] }) {
  const [renaming, setRenaming] = useState(false);
  const [adding, setAdding] = useState(section.dishes.length === 0);
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();

  return (
    <section className={panel}>
      <div className="gap-md flex flex-wrap items-baseline justify-between">
        <div className="min-w-0">
          <h2 className="text-h1 font-extrabold">{section.label}</h2>
          {section.note && <p className="text-site-label text-text-secondary mt-xs">{section.note}</p>}
        </div>
        <div className="gap-lg flex shrink-0">
          <button type="button" onClick={() => setRenaming((v) => !v)} className={quiet}>
            {renaming ? "Close" : "Rename"}
          </button>
          {section.dishes.length === 0 && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                startTransition(async () => {
                  const result = await removeSection(section.id);
                  if (!result.ok) setError(result.error);
                })
              }
              className="text-text-secondary text-site-label font-semibold disabled:opacity-50"
            >
              {busy ? "Removing…" : "Remove section"}
            </button>
          )}
        </div>
      </div>
      <FormError>{error}</FormError>

      {renaming && (
        <SectionForm
          label={section.label}
          note={section.note}
          idle="Save section"
          save={(input) => saveSection(section.id, input)}
          done={() => setRenaming(false)}
        />
      )}

      {section.dishes.length > 0 && (
        <ul className="mt-md">
          {section.dishes.map((d) => (
            <DishRow key={d.id} dish={d} options={options} />
          ))}
        </ul>
      )}

      {adding ? (
        <div className="bg-surface-raised/50 rounded-field mt-lg p-lg">
          <DishForm
            sectionId={section.id}
            options={options}
            idle="Add dish"
            working="Adding…"
            save={addDish}
            // Stay open: a kitchen setting up its menu adds dishes in a run.
            done={() => {}}
            clearOnSave
          />
          {section.dishes.length > 0 && (
            <button type="button" onClick={() => setAdding(false)} className="text-text-secondary text-site-label mt-md font-semibold">
              Done adding
            </button>
          )}
        </div>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className={cn(quiet, "mt-lg")}>
          + Add a dish to {section.label}
        </button>
      )}
    </section>
  );
}

function DishRow({ dish, options }: { dish: Dish; options: { id: string; label: string }[] }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [soldOut, setOptimistic] = useOptimistic(dish.soldOut);
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();

  return (
    <li className="border-surface-raised border-b py-md last:border-b-0">
      <div className="gap-md flex items-center">
        <div className="bg-surface-raised rounded-field relative size-[56px] shrink-0 overflow-hidden">
          {dish.imageUrl && <Image src={dish.imageUrl} alt="" fill sizes="56px" className="object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn("text-site-question truncate", soldOut && "text-text-secondary line-through")}>{dish.name}</p>
          <p className="text-site-label text-text-secondary">
            {formatKobo(dish.priceKobo)}
            {soldOut && <span className="text-danger-text font-semibold"> · Sold out</span>}
          </p>
          <button type="button" onClick={() => { setEditing((v) => !v); setConfirming(false); }} className={cn(quiet, "mt-xs")}>
            {editing ? "Close" : "Edit"}
          </button>
        </div>
        <div className="gap-xs flex shrink-0 flex-col items-center">
          <Switch
            checked={!soldOut}
            disabled={busy}
            label={soldOut ? `Put ${dish.name} back on the menu` : `Mark ${dish.name} sold out`}
            onChange={(available) => {
              setError("");
              startTransition(async () => {
                setOptimistic(!available);
                const result = await setSoldOut(dish.id, !available);
                if (!result.ok) setError(result.error);
              });
            }}
          />
          <span className="text-site-chip text-text-secondary">{soldOut ? "Sold out" : "Available"}</span>
        </div>
      </div>
      <FormError>{error}</FormError>

      {editing && (
        <div className="bg-surface-raised/50 rounded-field gap-lg mt-md flex flex-col p-lg">
          <DishForm
            dish={dish}
            sectionId={dish.sectionId}
            options={options}
            idle="Save dish"
            working="Saving…"
            save={(input) => saveDish(dish.id, input)}
            done={() => setEditing(false)}
          />
          <PhotoUpload
            label="Photo"
            done={!!dish.imageUrl}
            doneLabel="Photo added"
            fields={{ id: dish.id }}
            upload={uploadDishPhoto}
          />
          {confirming ? (
            <div className="gap-md flex flex-wrap items-center">
              <span className="text-danger-text text-site-label font-bold">Remove {dish.name} from your menu?</span>
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  startTransition(async () => {
                    const result = await removeDish(dish.id);
                    if (!result.ok) {
                      setError(result.error);
                      setConfirming(false);
                    }
                  })
                }
                className="bg-danger text-bg rounded-pill text-site-label px-lg py-sm font-bold disabled:opacity-50"
              >
                {busy ? "Removing…" : "Yes, remove"}
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="text-text-secondary text-site-label font-semibold">
                Keep it
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="text-text-secondary hover:text-danger-text text-site-label self-start font-semibold">
              Remove this dish
            </button>
          )}
        </div>
      )}
    </li>
  );
}

function DishForm({
  dish,
  sectionId,
  options,
  idle,
  working,
  save,
  done,
  clearOnSave = false,
}: {
  dish?: Dish;
  sectionId: string;
  options: { id: string; label: string }[];
  idle: string;
  working: string;
  save: (input: { sectionId: string; name: string; description: string; priceNaira: number }) => Promise<Result>;
  done: () => void;
  clearOnSave?: boolean;
}) {
  const [name, setName] = useState(dish?.name ?? "");
  const [price, setPrice] = useState(dish ? String(Math.round(dish.priceKobo / 100)) : "");
  const [description, setDescription] = useState(dish?.description ?? "");
  const [section, setSection] = useState(sectionId);
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();

  return (
    <form
      className="gap-md flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await save({ sectionId: section, name, description, priceNaira: Number(price) });
          if (!result.ok) return setError(result.error);
          setError("");
          if (clearOnSave) {
            setName("");
            setPrice("");
            setDescription("");
          }
          done();
        });
      }}
    >
      <div className="gap-md grid sm:grid-cols-[2fr_1fr]">
        <label className={fieldLabel}>
          Dish
          <input value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="Pounded yam & egusi" className={field} />
        </label>
        <label className={fieldLabel}>
          Price, ₦
          <input value={price} onChange={(e) => { setPrice(e.target.value.replace(/\D/g, "")); setError(""); }} inputMode="numeric" placeholder="2800" className={field} />
        </label>
      </div>
      <label className={fieldLabel}>
        What comes with it (optional)
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="With assorted meat" className={field} />
      </label>
      {dish && options.length > 1 && (
        <label className={fieldLabel}>
          Section
          <select value={section} onChange={(e) => setSection(e.target.value)} className={cn(field, "appearance-none")}>
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      )}
      <FormError>{error}</FormError>
      <SubmitButton busy={busy} idle={idle} working={working} />
    </form>
  );
}

function SectionForm({
  label: savedLabel = "",
  note: savedNote = "",
  idle,
  save,
  done,
}: {
  label?: string;
  note?: string;
  idle: string;
  save: (input: { label: string; note: string }) => Promise<Result>;
  done: () => void;
}) {
  const [label, setLabel] = useState(savedLabel);
  const [note, setNote] = useState(savedNote);
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();

  return (
    <form
      className="gap-md mt-lg flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await save({ label, note });
          if (!result.ok) return setError(result.error);
          setError("");
          if (!savedLabel) {
            setLabel("");
            setNote("");
          }
          done();
        });
      }}
    >
      <div className="gap-md grid sm:grid-cols-2">
        <label className={fieldLabel}>
          Section name
          <input value={label} onChange={(e) => { setLabel(e.target.value); setError(""); }} placeholder="Swallow" className={field} />
        </label>
        <label className={fieldLabel}>
          Note (optional)
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Served with your choice of soup" className={field} />
        </label>
      </div>
      <FormError>{error}</FormError>
      <SubmitButton busy={busy} idle={idle} working="Saving…" />
    </form>
  );
}

function NewSection({ first }: { first: boolean }) {
  const [open, setOpen] = useState(first);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={cn(quiet, "self-start")}>
        + Add a section
      </button>
    );
  }
  return (
    <section className={panel}>
      <h2 className="text-h1 font-extrabold">{first ? "Your first section" : "New section"}</h2>
      <SectionForm idle="Add section" save={addSection} done={() => setOpen(false)} />
    </section>
  );
}
