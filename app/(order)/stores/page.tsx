import type { Metadata } from "next";
import { KitchensBrowser } from "@/components/order/KitchensBrowser";
import { listKitchens } from "@/lib/shop/catalog";
import { getCustomer } from "@/lib/shop/session";

export const metadata: Metadata = {
  title: "Order groceries in Makurdi · Karrigo",
  description: "Groceries from stores in Makurdi, delivered by a Karrigo rider to your landmark.",
};

export default async function StoresPage() {
  const [stores, customer] = await Promise.all([listKitchens("GROCERY"), getCustomer()]);
  return <KitchensBrowser kitchens={stores} side="GROCERY" firstName={customer?.name.split(" ")[0] || null} />;
}
