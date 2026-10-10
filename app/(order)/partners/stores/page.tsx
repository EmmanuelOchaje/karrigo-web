import type { Metadata } from "next";

import { AddOtherSide } from "@/components/partners/AddOtherSide";
import { StoreApply } from "@/components/partners/StoreApply";
import { StoreSetup } from "@/components/partners/StoreSetup";
import { Eyebrow } from "@/components/site/Eyebrow";
import { getPartner, getStoreApplication } from "@/lib/partners/data";
import { listAreas } from "@/lib/shop/areas";

export const metadata: Metadata = { title: "Sell on Karrigo" };

/** Store sign-up, adding a store to an existing partner business, and the
 * store's setup status all live at the plural route. */
export default async function StorePartnerPage() {
  const [partner, areas] = await Promise.all([getPartner(), listAreas()]);
  const store = partner?.storeId ? await getStoreApplication() : null;
  const addingStore = partner !== null && partner.storeId === null;

  return (
    <div className="mx-auto max-w-[760px]">
      <Eyebrow className="rise">Sell with Karrigo</Eyebrow>
      <h1 className="text-section-small md:text-section rise rise-1 mt-md mb-xl text-balance">
        {addingStore ? "Register your business as a store" : store ? store.name : "Register your store"}
      </h1>
      {store ? (
        <StoreSetup store={store} />
      ) : addingStore ? (
        <AddOtherSide side="store" areas={areas} isOwner={partner?.isOwner ?? false} />
      ) : (
        <>
          <p className="text-site-body text-text-secondary mb-xl max-w-[52ch]">
            Tell us about your store and where it is. Then you can add its location, payout account and verification
            photos before our team reviews it.
          </p>
          <StoreApply areas={areas} />
        </>
      )}
    </div>
  );
}
