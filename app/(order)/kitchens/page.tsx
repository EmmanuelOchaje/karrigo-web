import type { Metadata } from "next";
import { KitchensBrowser } from "@/components/order/KitchensBrowser";

export const metadata: Metadata = { title: "Kitchens in Makurdi · Karrigo" };

export default function KitchensPage() {
  return <KitchensBrowser />;
}
