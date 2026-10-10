"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  registerKitchenForBusiness,
  registerStoreForBusiness,
} from "@/app/(order)/partners/actions";
import { cn } from "@/lib/cn";
import type { PartnerSideToAdd } from "@/lib/partners/register-side";
import { FormError, SubmitButton, field, fieldLabel } from "./parts";

const COPY = {
  kitchen: {
    nameLabel: "Kitchen name",
    namePlaceholder: "Terkimbi's Kitchen",
    nameError: "What is your kitchen called?",
    areaError: "Pick the area your kitchen is in.",
    submit: "Register my kitchen",
    working: "Registering your kitchen…",
  },
  store: {
    nameLabel: "Store name",
    namePlaceholder: "Mama Ngozi Groceries",
    nameError: "What is your store called?",
    areaError: "Pick the area your store is in.",
    submit: "Register my store",
    working: "Registering your store…",
  },
} as const;

/** Register the missing side on an existing partner business. The owner is
 * already verified and signed in, so this asks only for the new side's name
 * and area. */
export function AddOtherSide({
  side,
  areas,
  isOwner,
}: {
  side: PartnerSideToAdd;
  areas: { id: string; name: string }[];
  isOwner: boolean;
}) {
  const copy = COPY[side];
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [areaId, setAreaId] = useState("");
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();
  const noAreas = areas.length === 0;

  if (!isOwner) {
    return (
      <div className="bg-bg rounded-panel-sm p-xl md:p-xxl">
        <p className="text-site-body text-text-secondary">
          Only your business owner can register it as a {side}. Ask them to log in and finish this step.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="bg-bg rounded-panel-sm p-xl md:p-xxl gap-md flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        if (businessName.trim().length < 2) return setError(copy.nameError);
        if (!areaId) return setError(copy.areaError);

        startTransition(async () => {
          const result =
            side === "kitchen"
              ? await registerKitchenForBusiness({ kitchenName: businessName, areaId, cuisine })
              : await registerStoreForBusiness({ storeName: businessName, areaId });
          if (!result.ok) return setError(result.error);
          setError("");
          router.refresh();
        });
      }}
    >
      <p className="text-site-body text-text-secondary">
        This uses the owner account you already set up. Any saved payout details carry over; the new {side} has its own
        location, verification photos and approval.
      </p>
      <label className={fieldLabel}>
        {copy.nameLabel}
        <input
          value={businessName}
          onChange={(event) => {
            setBusinessName(event.target.value);
            setError("");
          }}
          placeholder={copy.namePlaceholder}
          className={field}
        />
      </label>
      <div className={cn("gap-md grid", side === "kitchen" && "sm:grid-cols-2")}>
        {side === "kitchen" && (
          <label className={fieldLabel}>
            What you cook
            <input
              value={cuisine}
              onChange={(event) => {
                setCuisine(event.target.value);
                setError("");
              }}
              placeholder="Swallow & soups"
              className={field}
            />
          </label>
        )}
        <label className={fieldLabel}>
          Area
          <select
            value={areaId}
            onChange={(event) => {
              setAreaId(event.target.value);
              setError("");
            }}
            disabled={noAreas}
            className={cn(field, "appearance-none")}
          >
            <option value="">Pick your area</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {noAreas && (
        <p role="alert" className="text-danger-text text-site-label font-semibold">
          We couldn&rsquo;t load the areas — reload the page to try again.
        </p>
      )}
      <FormError>{error}</FormError>
      <SubmitButton busy={busy} disabled={noAreas} idle={copy.submit} working={copy.working} />
    </form>
  );
}
