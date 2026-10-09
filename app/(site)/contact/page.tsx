import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { PageBody, PageIntro } from "@/components/site/PageIntro";
import { CONTACT, whatsappLink } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact — Karrigo",
  description: "How to reach the Karrigo team.",
};

const ROUTES = [
  { title: "Cook with Karrigo", body: "List your kitchen and start taking orders.", href: "/partners/kitchen" },
  { title: "Sell your groceries", body: "Register your store.", href: "/partners/store" },
  { title: "Ride with us", body: "Apply to deliver for Karrigo.", href: "/partners/rider" },
] as const;

export default function ContactPage() {
  const { whatsapp, email, hours } = CONTACT;
  const reachable = Boolean(whatsapp || email);

  return (
    <PageBody width="760px">
      <PageIntro eyebrow="Contact" title="Talk to a person">
        Something wrong with an order, a question about the app, or you want to work with us — start here.
      </PageIntro>

      <section id="contact" className="bg-bg rounded-panel-sm p-xl md:p-pad-card mt-xxl rise rise-3">
        {reachable ? (
          <div className="gap-lg flex flex-col">
            {whatsapp && (
              <div>
                <p className="text-site-label text-text-secondary">WhatsApp</p>
                <p className="text-site-title mt-xs">+{whatsapp}</p>
                <ButtonLink
                  href={whatsappLink(whatsapp, "Hello Karrigo, ")}
                  variant="dark"
                  size="site"
                  className="mt-md"
                >
                  Message us on WhatsApp
                </ButtonLink>
              </div>
            )}
            {email && (
              <div>
                <p className="text-site-label text-text-secondary">Email</p>
                <a href={`mailto:${email}`} className="text-site-title text-accent-text mt-xs inline-block underline">
                  {email}
                </a>
              </div>
            )}
            {hours && <p className="text-site-answer text-text-secondary">{hours}</p>}
          </div>
        ) : (
          <p className="text-site-answer text-text-secondary max-w-[52ch]">
            For an order that is under way, open it from your orders and follow the rider. For anything
            else, our contact details are on their way to this page.
          </p>
        )}
        <p className="text-site-label text-text-secondary mt-lg">Karrigo · Makurdi, Benue State, Nigeria</p>
      </section>

      <h2 className="text-site-title mt-section-sm mb-lg md:mt-section">Want to work with us?</h2>
      <ul className="gap-lg grid sm:grid-cols-3">
        {ROUTES.map((route) => (
          <li key={route.href}>
            <Link
              href={route.href}
              className="bg-bg rounded-panel-sm p-xl block h-full transition-[transform,box-shadow] duration-(--duration-normal) hover:-translate-y-1 hover:shadow-card"
            >
              <span className="text-site-title block">{route.title}</span>
              <span className="text-site-label text-text-secondary mt-xs block">{route.body}</span>
            </Link>
          </li>
        ))}
      </ul>
    </PageBody>
  );
}
