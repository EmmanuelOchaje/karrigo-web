import type { StoreApplication } from "./types";
import { VERIFICATION_PHOTOS_REQUIRED } from "@/lib/kitchen/types";

type ChecklistItem = { label: string; href: string };

export function storeSetupProgress(
  store: StoreApplication,
  photoCount: number,
): { left: number; photosDone: boolean; items: ChecklistItem[] } {
  const locationDone = !store.missing.includes("LOCATION");
  const feeDone = !store.missing.includes("RIDER_FEE");
  const payoutDone = Boolean(store.bankAccountName);
  const photosDone = photoCount >= VERIFICATION_PHOTOS_REQUIRED;
  const steps = [locationDone, feeDone, payoutDone, photosDone];

  return {
    left: steps.filter((done) => !done).length,
    photosDone,
    items: [
      ...(locationDone ? [] : [{ label: "Set your store's location", href: "#location" }]),
      ...(feeDone ? [] : [{ label: "Set the rider base delivery fee", href: "#rider-fee" }]),
      ...(payoutDone ? [] : [{ label: "Add the business payout account", href: "#payout" }]),
      ...(photosDone
        ? []
        : [{ label: `Store photos: ${photoCount} of ${VERIFICATION_PHOTOS_REQUIRED}`, href: "#photos" }]),
    ],
  };
}
