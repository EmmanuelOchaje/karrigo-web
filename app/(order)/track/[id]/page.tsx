import type { Metadata } from "next";
import { TrackOrder } from "@/components/order/TrackOrder";

export const metadata: Metadata = { title: "Track your order · Karrigo" };

export default async function TrackPage({ params }: PageProps<"/track/[id]">) {
  const { id } = await params;
  return <TrackOrder id={id} />;
}
