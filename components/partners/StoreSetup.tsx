import type { StoreApplication } from "@/lib/partners/types";
import { StatusBanner } from "./parts";

/** Task 5's route boundary. Task 6 expands this into the store's full setup
 * checklist; keeping the component here lets the page branch correctly now. */
export function StoreSetup({ store }: { store: StoreApplication }) {
  return (
    <StatusBanner
      tone={store.status === "ACTIVE" ? "live" : store.status === "SUSPENDED" ? "stopped" : "waiting"}
      title={
        store.status === "ACTIVE"
          ? `${store.name} is approved`
          : store.status === "SUSPENDED"
            ? `${store.name} isn't live`
            : `${store.name} is registered`
      }
      text={
        store.status === "ACTIVE"
          ? "Your store is approved. Product listings and store orders come next."
          : store.status === "SUSPENDED"
            ? "Karrigo has suspended this store. The business owner can review the note and appeal from this page."
            : "Finish the store setup below so our team can review it."
      }
      note={store.note}
    />
  );
}
