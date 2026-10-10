"use client";

import { PartnerApply, PartnerLogin } from "./PartnerApply";

/** The kitchen onboarding: the shared partner form, set up for a kitchen. */
export function KitchenApply({ areas }: { areas: { id: string; name: string }[] }) {
  return <PartnerApply side="kitchen" areas={areas} />;
}

export function KitchenLogin() {
  return <PartnerLogin side="kitchen" />;
}
