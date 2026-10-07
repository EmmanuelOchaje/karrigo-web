import type { Metadata } from "next";
import { StoreCard } from "@/components/site/StoreCard";
import { Eyebrow } from "@/components/site/Eyebrow";
import { stores } from "@/lib/fixtures";

export const metadata: Metadata = { title: "Stores near you · Karrigo" };

/**
 * Preview only — the grocery ordering flow (cart, review, checkout) isn't
 * built yet, so this page shows what's coming rather than taking orders.
 * See design_handoff_karrigo/README.md for the product decisions it has to
 * match once that flow is built.
 */
export default function StoresPage() {
  return (
    <div className="mx-auto max-w-[1240px]">
      <Eyebrow className="rise">Open right now</Eyebrow>
      <h1 className="text-section-small md:text-section rise rise-1 mt-md mb-md text-balance">
        Stores near you
      </h1>
      <p className="text-site-body text-text-secondary rise rise-2 mb-xxl max-w-[52ch]">
        Groceries ordering is coming soon. Here&rsquo;s a preview of the
        stores we&rsquo;re bringing onto Karrigo.
      </p>
      <div className="gap-xl rise rise-3 grid sm:grid-cols-2 lg:grid-cols-4">
        {stores.map((store) => (
          <StoreCard key={store.slug} store={store} />
        ))}
      </div>
    </div>
  );
}
