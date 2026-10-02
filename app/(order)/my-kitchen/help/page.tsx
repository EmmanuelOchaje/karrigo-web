import type { Metadata } from "next";

import { AccountForms, ProblemForm } from "@/components/kitchen/Help";
import { panel } from "@/components/kitchen/parts";
import { getStaffProfile, listTickets, requireKitchen } from "@/lib/kitchen/data";
import type { Ticket } from "@/lib/kitchen/types";

export const metadata: Metadata = { title: "Help · Your kitchen · Karrigo" };

const date = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", day: "numeric", month: "short" });

const STATUS: Record<Ticket["status"], string> = {
  OPEN: "Waiting for Karrigo",
  IN_PROGRESS: "Karrigo is on it",
  RESOLVED: "Sorted",
  CLOSED: "Closed",
};

export default async function KitchenHelpPage() {
  const kitchen = await requireKitchen();
  const [profile, tickets] = await Promise.all([getStaffProfile(), listTickets().catch(() => null)]);

  return (
    <div className="gap-lg flex flex-col">
      <ProblemForm />

      <section className={panel}>
        <h2 className="text-h1 font-extrabold">What you&rsquo;ve told us</h2>
        {tickets === null ? (
          <p className="text-site-body text-text-secondary mt-sm">
            We couldn&rsquo;t load your reports just now. Refresh the page to try again.
          </p>
        ) : tickets.length === 0 ? (
          <p className="text-site-body text-text-secondary mt-sm">Nothing yet. Problems you report show up here with where they stand.</p>
        ) : (
          <ul className="mt-sm">
            {tickets.map((t) => (
              <li key={t.id} className="border-surface-raised border-b py-md last:border-b-0">
                <p className="text-site-question break-words">{t.subject}</p>
                <p className="text-site-label text-text-secondary mt-xs">
                  {STATUS[t.status]} · {date.format(new Date(t.createdAt))}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <AccountForms name={profile.name} email={profile.email} phone={profile.phone} kitchenName={kitchen.name} />
    </div>
  );
}
