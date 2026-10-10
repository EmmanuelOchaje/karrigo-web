import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { StoreLogin } from "@/components/partners/StoreApply";
import { getPartner } from "@/lib/partners/data";

export const metadata: Metadata = { title: "Store log in · Karrigo" };

export default async function StoreLoginPage() {
  // One login covers both sides: already signed in goes straight to the store
  // page, which shows the setup or offers to register the store.
  if (await getPartner()) redirect("/partners/store");
  return <StoreLogin />;
}
