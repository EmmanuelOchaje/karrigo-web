import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { KitchenLogin } from "@/components/partners/KitchenApply";
import { getKitchenApplication } from "@/lib/partners/data";

export const metadata: Metadata = { title: "Kitchen log in · Karrigo" };

export default async function KitchenLoginPage() {
  if (await getKitchenApplication()) redirect("/my-kitchen");
  return <KitchenLogin />;
}
