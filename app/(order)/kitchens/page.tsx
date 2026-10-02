import type { Metadata } from "next";
import { KitchensBrowser } from "@/components/order/KitchensBrowser";
import { listKitchens } from "@/lib/shop/catalog";
import { getCustomer } from "@/lib/shop/session";

export const metadata: Metadata = { title: "Kitchens in Makurdi · Karrigo" };

export default async function KitchensPage() {
  const [kitchens, customer] = await Promise.all([listKitchens(), getCustomer()]);
  return <KitchensBrowser kitchens={kitchens} firstName={customer?.name.split(" ")[0] || null} />;
}
