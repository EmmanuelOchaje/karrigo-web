import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { FaqList } from "@/components/site/FaqList";
import { PageBody, PageIntro } from "@/components/site/PageIntro";

export const metadata: Metadata = {
  title: "Help — Karrigo",
  description: "Answers about ordering, paying, delivery and landmarks.",
};

const TOPICS = [
  { href: "/orders", title: "Where is my order?", body: "Open your orders and follow the rider." },
  { href: "#payment", title: "Paying", body: "Card, bank transfer or cash to the rider." },
  { href: "/areas", title: "Do you reach me?", body: "See every area we deliver to." },
  { href: "/contact", title: "Talk to a person", body: "Message us and we will sort it out." },
] as const;

export default function HelpPage() {
  return (
    <PageBody>
      <PageIntro eyebrow="Help" title="How can we help?">
        The quick answers are below. If yours is not here, message us and a person will reply.
      </PageIntro>

      <ul className="gap-lg mt-xxl rise rise-3 grid sm:grid-cols-2 lg:grid-cols-4">
        {TOPICS.map((topic) => (
          <li key={topic.title}>
            <Link
              href={topic.href}
              className="bg-bg rounded-panel-sm p-xl block h-full transition-[transform,box-shadow] duration-(--duration-normal) hover:-translate-y-1 hover:shadow-card"
            >
              <span className="text-site-title block">{topic.title}</span>
              <span className="text-site-label text-text-secondary mt-xs block">{topic.body}</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="text-section-small md:text-section mt-section-sm mb-xxl md:mt-section">Questions we get a lot</h2>
      <FaqList />

      <section id="payment" className="bg-bg rounded-panel-sm p-xl md:p-pad-card mt-xxl scroll-mt-xxl">
        <h2 className="text-site-title">Paying for your order</h2>
        <p className="text-site-answer text-text-secondary mt-md max-w-[56ch]">
          You can pay by card or bank transfer when you order, or with cash to the rider when the food
          reaches you. Card and transfer payments are handled by Paystack, so your card details never
          touch Karrigo.
        </p>
      </section>

      <section className="bg-accent text-on-accent rounded-panel-lg p-xxl md:p-pad-card mt-xxl text-center">
        <h2 className="text-panel-small md:text-card-title text-balance">Still stuck?</h2>
        <p className="mt-md mx-auto max-w-[40ch] text-pretty">Tell us what happened and we will fix it.</p>
        <ButtonLink href="/contact" variant="onAccent" size="site" className="mt-xl">
          Contact us
        </ButtonLink>
      </section>
    </PageBody>
  );
}
