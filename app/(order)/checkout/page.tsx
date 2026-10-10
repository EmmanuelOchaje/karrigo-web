import type { Metadata } from "next";
import { Checkout } from "@/components/order/Checkout";
import { listAreaNames } from "@/lib/shop/areas";
import { getCustomer } from "@/lib/shop/session";

export const metadata: Metadata = { title: "Checkout · Karrigo", robots: { index: false } };

export default async function CheckoutPage() {
  const [customer, areas] = await Promise.all([getCustomer(), listAreaNames()]);
  return <Checkout customer={customer} areas={areas} />;
}
