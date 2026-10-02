import type { Metadata } from "next";

import { MenuEditor } from "@/components/kitchen/MenuEditor";
import { requireKitchen } from "@/lib/kitchen/data";

export const metadata: Metadata = { title: "Menu · Your kitchen · Karrigo" };

export default async function KitchenMenuPage() {
  const kitchen = await requireKitchen();
  return <MenuEditor kitchenName={kitchen.name} sections={kitchen.sections} />;
}
