import type { Metadata } from "next";
import { KitchensBrowser } from "@/components/order/KitchensBrowser";
import { listKitchens } from "@/lib/shop/catalog";
import { getCustomer } from "@/lib/shop/session";

export const metadata: Metadata = {
  title: "Order food in Makurdi · Karrigo",
  description: "Browse kitchens in Makurdi, see live menus and prices, and have a Karrigo rider bring your food to your landmark.",
};

export default async function KitchensPage() {
  const [kitchens, customer] = await Promise.all([listKitchens(), getCustomer()]);
  return <KitchensBrowser kitchens={kitchens} firstName={customer?.name.split(" ")[0] || null} />;
}
