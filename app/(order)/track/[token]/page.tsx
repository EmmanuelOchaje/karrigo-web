import type { Metadata } from "next";

import { PublicTracking } from "@/components/order/PublicTracking";
import { ButtonLink } from "@/components/ui/Button";
import { readPublicTracking } from "./actions";

export const metadata: Metadata = { title: "Track a delivery · Karrigo" };

export default async function PublicTrackPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await readPublicTracking(token);

  if (!result.ok) {
    return (
      <main className="bg-bg text-text grid min-h-dvh place-items-center px-lg py-xxl">
        <section className="bg-surface rounded-panel-lg max-w-[560px] p-xxl text-center md:p-pad-card">
          <h1 className="text-panel-small">This tracking link has expired or isn&rsquo;t right</h1>
          <p className="text-site-body text-text-secondary mt-md">
            Ask the person who placed the order for a fresh link, or open your own order history.
          </p>
          <ButtonLink href="/kitchens" variant="accent" size="site" className="mt-xl">
            Browse kitchens
          </ButtonLink>
        </section>
      </main>
    );
  }

  return <PublicTracking token={token} initial={result.tracking} />;
}
