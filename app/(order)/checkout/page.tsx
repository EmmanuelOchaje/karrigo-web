import type { Metadata } from "next";
import { Checkout } from "@/components/order/Checkout";
import { getCustomer } from "@/lib/shop/session";

export const metadata: Metadata = { title: "Checkout · Karrigo" };

export default async function CheckoutPage() {
  return <Checkout customer={await getCustomer()} />;
}
