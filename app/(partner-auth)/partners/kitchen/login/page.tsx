import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { KitchenLogin } from "@/components/partners/KitchenApply";
import { getPartner } from "@/lib/partners/data";

export const metadata: Metadata = { title: "Kitchen log in · Karrigo" };

export default async function KitchenLoginPage() {
  // One login covers both sides. With a kitchen it opens the console; a
  // store-only owner goes to the kitchen page to register one.
  const partner = await getPartner();
  if (partner) redirect(partner.kitchenId ? "/my-kitchen" : "/partners/kitchen");
  return <KitchenLogin />;
}
