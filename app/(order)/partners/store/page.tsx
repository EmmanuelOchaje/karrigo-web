import type { Metadata } from "next";

import { Eyebrow } from "@/components/site/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Sell on Karrigo" };

/**
 * No store onboarding backend yet — this is a holding page, not a form.
 * Applications go through WhatsApp until the grocery side is built, same as
 * the rest of the groceries flow (see design_handoff_karrigo/README.md).
 */
export default function StorePartnerPage() {
  return (
    <div className="mx-auto max-w-[640px]">
      <Eyebrow className="rise">Sell your groceries on Karrigo</Eyebrow>
      <h1 className="text-section-small md:text-section rise rise-1 mt-md mb-xl text-balance">
        Register your store
      </h1>
      <div className="text-site-body text-text-secondary rise rise-2 flex flex-col gap-md mb-xxl max-w-[52ch]">
        <p>New customers nearby, without opening another branch.</p>
        <p>We list your products for you from your price list.</p>
        <p>
          Orders come to a simple app. Your staff pick, pack and hand over to
          our rider.
        </p>
        <p>
          <strong className="text-text font-bold">10% commission</strong> on
          what you sell. No sign-up fee. Weekly payouts to your bank.
        </p>
      </div>
      <p className="text-site-answer text-text-secondary rise rise-3 mb-lg">
        Store sign-up isn&rsquo;t live in the app yet — message us and we&rsquo;ll
        get you set up.
      </p>
      <ButtonLink
        // TODO: swap in the real business WhatsApp/contact once decided.
        href="/contact"
        variant="dark"
        size="site"
        className="rise rise-3"
      >
        Contact us
      </ButtonLink>
    </div>
  );
}
