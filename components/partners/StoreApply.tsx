"use client";

import { PartnerApply, PartnerLogin } from "./PartnerApply";

/** The store onboarding: the shared partner form, set up for a store. */
export function StoreApply({ areas }: { areas: { id: string; name: string }[] }) {
  return <PartnerApply side="store" areas={areas} />;
}

export function StoreLogin() {
  return <PartnerLogin side="store" />;
}
