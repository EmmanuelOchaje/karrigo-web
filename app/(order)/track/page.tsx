import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TrackOrder } from "@/components/order/TrackOrder";
import { fetchOrder } from "@/app/(order)/actions";
import { getCustomer } from "@/lib/shop/session";
import { SITE_URL } from "@/lib/app-links";

export const metadata: Metadata = { title: "Track your order · Karrigo" };

/** The order is loaded here, on the server, so the page opens already
 *  showing it; the component then keeps it current. Tracking needs the
 *  account that placed the order — a no-login public link is not available
 *  from the backend yet. */
export default async function TrackPage({ searchParams }: PageProps<"/track">) {
  const { order: raw } = await searchParams;
  const id = typeof raw === "string" ? raw : "";

  if (!(await getCustomer())) {
    redirect(`/login?next=${encodeURIComponent(`/track?order=${id}`)}`);
  }
  if (!id) return <TrackOrder initial={null} error="Open the tracking link from your order confirmation." siteUrl={SITE_URL} />;

  const result = await fetchOrder(id);
  return result.ok
    ? <TrackOrder initial={result.order} error={null} siteUrl={SITE_URL} />
    : <TrackOrder initial={null} error={result.error} siteUrl={SITE_URL} />;
}
