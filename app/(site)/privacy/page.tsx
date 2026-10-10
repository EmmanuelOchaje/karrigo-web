import type { Metadata } from "next";
import Link from "next/link";

import { LegalSections, type LegalSection } from "@/components/site/LegalSections";
import { PageBody, PageIntro } from "@/components/site/PageIntro";

export const metadata: Metadata = {
  title: "Privacy — Karrigo",
  description: "What Karrigo collects, why, and the choices you have.",
};

const UPDATED = "9 October 2026";

const SECTIONS: LegalSection[] = [
  {
    id: "collect",
    title: "What we collect",
    body: [
      "Your name and phone number, and your email if you give one. The delivery addresses and landmarks you enter, and your location only when you choose to share it. Your orders and what you paid. If you use the app, a device token so we can send you order notifications.",
      "If you sign up as a kitchen, store or rider, we also collect the documents, photos and bank details needed to approve you and pay you.",
    ],
  },
  {
    id: "why",
    title: "Why we use it",
    body: [
      "To take and deliver your order, show it to the kitchen, store and rider who need it, take payment, send you codes and updates, keep Karrigo safe, and answer you when you contact us. We do not sell your personal information.",
    ],
  },
  {
    id: "sharing",
    title: "Who sees it",
    body: [
      "The kitchen or store sees your name, order and delivery details. The rider sees where to go and how to reach you. Paystack processes card and transfer payments. Our messaging provider delivers the one-time codes sent to your phone. These providers handle your data only to do their job for us.",
      "We may share information when the law requires it.",
    ],
  },
  {
    id: "keep",
    title: "How long we keep it",
    body: [
      "For as long as your account is active, and afterwards for as long as we need it to resolve disputes, meet legal and accounting duties and keep the service safe.",
    ],
  },
  {
    id: "rights",
    title: "Your choices",
    body: [
      "Under the Nigeria Data Protection Act you can ask what we hold about you, ask us to correct it, ask us to delete it where the law allows, and object to how we use it. You can turn off location and notification permissions in your phone or browser at any time.",
    ],
  },
  {
    id: "security",
    title: "Keeping it safe",
    body: [
      "Sign-in details are stored as secure tokens, payments go through Paystack, and access to customer data inside Karrigo is limited to the people who need it. No system is perfectly safe, so tell us straight away if you think your account has been used by someone else.",
    ],
  },
  {
    id: "changes",
    title: "Changes",
    body: ["If we change how we use your information, we will update this page and the date above."],
  },
];

export default function PrivacyPage() {
  return (
    <PageBody width="760px">
      <PageIntro eyebrow={`Last updated ${UPDATED}`} title="Privacy policy">
        What Karrigo collects, why we collect it, and the choices you have.
      </PageIntro>
      <LegalSections sections={SECTIONS} />
      <p className="text-site-answer text-text-secondary mt-xxl">
        To ask about your data, use the <Link href="/contact" className="text-accent-text underline">Contact page</Link>.
      </p>
    </PageBody>
  );
}
