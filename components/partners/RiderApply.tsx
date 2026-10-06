"use client";

import { useState, useTransition } from "react";

import {
  requestRiderReview,
  saveGuarantor,
  saveRiderBank,
  saveVehicle,
  uploadRiderDocument,
} from "@/app/(order)/partners/actions";
import type { Bank, DocumentKind, RiderApplication } from "@/lib/partners/types";
import { cn } from "@/lib/cn";
import { BankForm, FormError, PhotoUpload, StatusBanner, Step, SubmitButton, field, fieldLabel } from "./parts";

const VEHICLES = ["Motorcycle", "Tricycle (keke)", "Bicycle", "Car"];

const DOCUMENTS: { kind: DocumentKind; label: string }[] = [
  { kind: "license", label: "Driver's licence" },
  { kind: "id", label: "Government ID (NIN slip, voter's card or passport)" },
  { kind: "vehicleReg", label: "Vehicle papers" },
];

/**
 * A rider's application. `rider` is null until they have told us what they
 * ride — that first step is what creates the rider profile, so the later
 * steps stay closed until it is done.
 */
export function RiderApply({
  rider,
  banks,
  firstName,
}: {
  rider: RiderApplication | null;
  banks: Bank[];
  firstName: string;
}) {
  const docs = rider?.documents;
  const docsDone = !!docs && docs.license && docs.id && docs.vehicleReg;
  const done = [!!rider?.vehicleType, docsDone, !!rider?.guarantor, !!rider?.bankAccountName];
  const left = done.filter((d) => !d).length;
  const started = rider !== null;
  // Approved documents and guarantor are locked by karrigo-be; only ops can
  // reopen them, by sending the application back with a note.
  const approved = rider?.status === "APPROVED";

  return (
    <div className="gap-lg flex flex-col">
      {rider?.status === "APPROVED" ? (
        <StatusBanner
          tone="live"
          title={`You're approved${firstName ? `, ${firstName}` : ""}`}
          text="Open the Karrigo Partner app, go online, and trip offers will start coming in."
        />
      ) : rider?.status === "REJECTED" ? (
        <>
          <StatusBanner
            tone="stopped"
            title="Karrigo needs a few changes"
            text="See what to fix below, then send it again. Adding a new photo puts you back in the queue, and you can't go online until it's approved."
            note={rider.note}
            noteLabel="What to fix"
          />
          <Resubmit ready={docsDone && !!rider.guarantor} />
        </>
      ) : left > 0 ? (
        <StatusBanner
          tone="todo"
          title={`${left} thing${left === 1 ? "" : "s"} left before we can review you`}
          text="Finish the steps below. You can leave and come back — it's saved as you go."
        />
      ) : (
        <StatusBanner
          tone="waiting"
          title="Your application is with our team"
          text="Everything we need is here. We'll review it and reach you on your phone number."
        />
      )}

      <Step
        number={1}
        title="What do you ride?"
        done={done[0]}
        summary={[rider?.vehicleType, rider?.plateNumber].filter(Boolean).join(" · ")}
      >
        <VehicleForm vehicleType={rider?.vehicleType ?? ""} plateNumber={rider?.plateNumber ?? ""} />
      </Step>

      <Step
        number={2}
        title="Your documents"
        done={docsDone}
        summary="Licence, ID and vehicle papers added."
        hint="Clear photos, all four corners showing. Only Karrigo's team sees these."
      >
        {approved ? (
          <ApprovedLock what="documents" />
        ) : started ? (
          DOCUMENTS.map((d) => (
            <PhotoUpload
              key={d.kind}
              label={d.label}
              done={!!docs?.[d.kind]}
              doneLabel="Added"
              camera
              fields={{ kind: d.kind }}
              upload={uploadRiderDocument}
            />
          ))
        ) : (
          <Locked />
        )}
      </Step>

      <Step
        number={3}
        title="Someone who can vouch for you"
        done={done[2]}
        summary={rider?.guarantor ? `${rider.guarantor.name} · ${rider.guarantor.phone}` : undefined}
        hint="A guarantor is someone who knows you and can be reached if we can't reach you. Tell them first — we may call."
      >
        {approved ? (
          <ApprovedLock what="guarantor's details" />
        ) : started ? (
          <GuarantorForm guarantor={rider?.guarantor ?? null} />
        ) : (
          <Locked />
        )}
      </Step>

      <Step
        number={4}
        title="Where should we pay you?"
        done={done[3]}
        summary={`${rider?.bankAccountName} · account ending ${rider?.bankAccountLast4}`}
        hint="Trip pay and tips go here. Tips are yours in full."
      >
        {started ? <BankForm banks={banks} save={saveRiderBank} /> : <Locked />}
      </Step>
    </div>
  );
}

function ApprovedLock({ what }: { what: string }) {
  return (
    <p className="text-site-label text-text-secondary">
      Your {what} were approved and are now locked. If something has changed, contact Karrigo and we&rsquo;ll
      reopen them for you.
    </p>
  );
}

function Locked() {
  return <p className="text-site-label text-text-secondary">Tell us what you ride in step 1 first.</p>;
}

function VehicleForm({ vehicleType, plateNumber }: { vehicleType: string; plateNumber: string }) {
  const [vehicle, setVehicle] = useState(vehicleType);
  const [plate, setPlate] = useState(plateNumber);
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();
  const options = vehicleType && !VEHICLES.includes(vehicleType) ? [vehicleType, ...VEHICLES] : VEHICLES;

  return (
    <form
      className="gap-md flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await saveVehicle({ vehicleType: vehicle, plateNumber: plate });
          setError(result.ok ? "" : result.error);
        });
      }}
    >
      <div className="gap-sm flex flex-wrap" role="radiogroup" aria-label="What you ride">
        {options.map((v) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={vehicle === v}
            onClick={() => { setVehicle(v); setError(""); }}
            data-theme={vehicle === v ? "dark" : undefined}
            className={cn(
              "rounded-pill text-nav-link border-[1.5px] px-lg py-sm font-bold",
              vehicle === v ? "bg-bg text-accent-text border-bg" : "border-border-strong",
            )}
          >
            {v}
          </button>
        ))}
      </div>
      {vehicle !== "Bicycle" && (
        <label className={fieldLabel}>
          Plate number
          <input value={plate} onChange={(e) => { setPlate(e.target.value.toUpperCase()); setError(""); }} placeholder="MKD 123 AB" className={cn(field, "uppercase")} />
        </label>
      )}
      <FormError>{error}</FormError>
      <SubmitButton busy={busy} idle="Save and continue" working="Saving…" />
    </form>
  );
}

function GuarantorForm({ guarantor }: { guarantor: RiderApplication["guarantor"] }) {
  const [name, setName] = useState(guarantor?.name ?? "");
  const [phone, setPhone] = useState(guarantor?.phone ?? "");
  const [address, setAddress] = useState(guarantor?.address ?? "");
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();

  return (
    <form
      className="gap-md flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await saveGuarantor({ name, phone, address });
          setError(result.ok ? "" : result.error);
        });
      }}
    >
      <div className="gap-md grid sm:grid-cols-2">
        <label className={fieldLabel}>
          Their full name
          <input value={name} onChange={(e) => { setName(e.target.value); setError(""); }} className={field} />
        </label>
        <label className={fieldLabel}>
          Their phone number
          <input value={phone} onChange={(e) => { setPhone(e.target.value); setError(""); }} inputMode="tel" placeholder="0803 123 4567" className={field} />
        </label>
      </div>
      <label className={fieldLabel}>
        Where they live
        <input value={address} onChange={(e) => { setAddress(e.target.value); setError(""); }} placeholder="House and street, area" className={field} />
      </label>
      <FormError>{error}</FormError>
      <SubmitButton busy={busy} idle="Save guarantor" working="Saving…" />
    </form>
  );
}

/** Fixed it without a new photo — say, the guarantor — and want ops to look
 *  again. The backend checks the set is complete; this only spares a refusal. */
function Resubmit({ ready }: { ready: boolean }) {
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();

  return (
    <div className="gap-sm flex flex-col">
      <button
        type="button"
        disabled={!ready || busy}
        onClick={() =>
          startTransition(async () => {
            const result = await requestRiderReview();
            setError(result.ok ? "" : result.error);
          })
        }
        className="bg-text text-bg rounded-pill text-site-button self-start px-xl py-md disabled:opacity-50"
      >
        {busy ? "Sending…" : "Resubmit for review"}
      </button>
      {!ready && (
        <p className="text-site-label text-text-secondary">Add your licence, ID, vehicle papers and guarantor first.</p>
      )}
      <FormError>{error}</FormError>
    </div>
  );
}
