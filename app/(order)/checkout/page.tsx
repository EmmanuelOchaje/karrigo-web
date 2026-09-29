import type { Metadata } from "next";
import { Checkout } from "@/components/order/Checkout";

export const metadata: Metadata = { title: "Checkout · Karrigo" };

export default function CheckoutPage() {
  return <Checkout />;
}
