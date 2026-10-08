import type { Metadata } from "next";
import Link from "next/link";

import { HoursForm, ProfileForm, SidesForm } from "@/components/kitchen/Settings";
import { VerificationPhotos } from "@/components/kitchen/VerificationPhotos";
import { panel } from "@/components/kitchen/parts";
import { APPLICATION, getHours, listVerificationPhotos, requireOwner } from "@/lib/kitchen/data";

export const metadata: Metadata = { title: "Hours & details · Your kitchen · Karrigo" };

export default async function KitchenSettingsPage() {
  const kitchen = await requireOwner();
  const [hours, photos] = await Promise.all([getHours(), listVerificationPhotos()]);

  return (
    <div className="gap-lg flex flex-col">
      <SidesForm servesFood={kitchen.servesFood} servesGrocery={kitchen.servesGrocery} />
      <HoursForm days={hours.days} everSaved={hours.saved} />
      <ProfileForm name={kitchen.name} cuisine={kitchen.cuisine} riderBaseFeeKobo={kitchen.riderBaseFeeKobo} />
      <section className={panel}>
        <h2 className="text-h1 font-extrabold mb-md">Kitchen photos</h2>
        <VerificationPhotos photos={photos} canEdit />
      </section>
      <p className="text-site-label text-text-secondary">
        Your location, payout account and cover photo are on your{" "}
        <Link href={APPLICATION} className="text-accent-text font-bold">
          kitchen setup page
        </Link>
        .
      </p>
    </div>
  );
}
