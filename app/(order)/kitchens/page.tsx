import type { Metadata } from "next";
import { KitchensBrowser } from "@/components/order/KitchensBrowser";

export const metadata: Metadata = { title: "Kitchens in Makurdi · Karrigo" };

export default async function KitchensPage({ searchParams }: PageProps<"/kitchens">) {
  const { address } = await searchParams;
  return <KitchensBrowser address={typeof address === "string" ? address : undefined} />;
}
