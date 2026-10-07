import type { Metadata } from "next";

import { Eyebrow } from "@/components/site/Eyebrow";
import { KitchenApply } from "@/components/partners/KitchenApply";
import { KitchenSetup } from "@/components/partners/KitchenSetup";
import { getKitchenApplication, listBanks } from "@/lib/partners/data";
import { listAreaNames } from "@/lib/shop/areas";

export const metadata: Metadata = { title: "Cook with Karrigo" };

/** One address for the whole application: the sign-up form until a kitchen is
 *  signed in, and its setup steps and status from then on. */
export default async function KitchenPartnerPage() {
  const [kitchen, areas] = await Promise.all([getKitchenApplication(), listAreaNames()]);

  return (
    <div className="mx-auto max-w-[760px]">
      <Eyebrow className="rise">Cook with Karrigo</Eyebrow>
      <h1 className="text-section-small md:text-section rise rise-1 mt-md mb-xl text-balance">
        {kitchen ? kitchen.name : "List your kitchen"}
      </h1>
      {kitchen ? (
        <KitchenSetup kitchen={kitchen} banks={await listBanks()} areas={areas} />
      ) : (
        <>
          <p className="text-site-body text-text-secondary mb-xl max-w-[52ch]">
            You&rsquo;ll tell us where you are, where to pay you, and what you cook — then
            our team approves your kitchen before it goes live.
          </p>
          <KitchenApply areas={areas} />
        </>
      )}
    </div>
  );
}
