import type { Metadata } from "next";

import { LegalSections, type LegalSection } from "@/components/site/LegalSections";
import { PageBody, PageIntro } from "@/components/site/PageIntro";

export const metadata: Metadata = {
  title: "Terms — Karrigo",
  description: "The terms for ordering, delivering and selling on Karrigo.",
};

const UPDATED = "9 October 2026";

const SECTIONS: LegalSection[] = [
  {
    id: "who",
    title: "Who we are",
    body: [
      "Karrigo connects people in Makurdi, Benue State, Nigeria with local kitchens and stores, and with riders who bring the order to them. By using the website or the app you agree to these terms.",
      "Kitchens and stores are independent businesses. They cook, pack and price what they sell; Karrigo takes the order, collects payment and arranges delivery.",
    ],
  },
  {
    id: "ordering",
    title: "Ordering",
    body: [
      "An order is placed from one kitchen or store at a time. Prices, delivery fees and availability are shown live before you pay, and the total you see at checkout is what you are charged.",
      "A kitchen or store has three minutes to accept your order. If it does not, the order is cancelled and you are refunded. A store may remove an item it has run out of before accepting; you are charged only for what is actually sent.",
      "Stores can set a minimum order. If your cart is below it, we show you how much more to add.",
    ],
  },
  {
    id: "payment",
    title: "Payment",
    body: [
      "You can pay by card or bank transfer, or with cash to the rider on delivery where the kitchen or store allows it. Card and transfer payments are processed by Paystack. We never see or store your full card details.",
      "Prices are in naira and include the delivery fee shown at checkout.",
    ],
  },
  {
    id: "delivery",
    title: "Delivery and landmarks",
    body: [
      "Give us an address or a landmark and the area. Riders find you the way a friend would, so please keep your phone on and answer when the rider calls.",
      "Delivery times are estimates. Distance, the kitchen and the weather all change them.",
    ],
  },
  {
    id: "problems",
    title: "When something goes wrong",
    body: [
      "If an order does not arrive, arrives wrong, or is not what you ordered, tell us as soon as you can through the Contact page and we will look into it. We will tell you what we found and what we will do about it.",
    ],
  },
  {
    id: "accounts",
    title: "Your account and fair use",
    body: [
      "Keep your sign-in details to yourself and give us true information. Do not misuse the service, place orders you do not intend to accept, or abuse riders, kitchens, stores or our team.",
      "We may suspend an account that breaks these rules.",
    ],
  },
  {
    id: "partners",
    title: "Kitchens, stores and riders",
    body: [
      "Kitchens and stores are approved by our team before they go live. Riders and partners agree to the partner terms that apply to them when they sign up, including the commission and payout arrangements shown at that time.",
    ],
  },
  {
    id: "liability",
    title: "Our responsibility",
    body: [
      "We take care in running Karrigo, but we cannot promise it will always be available or error free. To the extent the law allows, Karrigo is not responsible for losses we could not reasonably have foreseen. Nothing here limits any right you have under Nigerian law.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: [
      "We may update these terms as Karrigo grows. The date at the top of this page changes when we do, and continuing to use Karrigo after that means you accept the update.",
      "These terms are governed by the laws of the Federal Republic of Nigeria.",
    ],
  },
];

export default function TermsPage() {
  return (
    <PageBody width="760px">
      <PageIntro eyebrow={`Last updated ${UPDATED}`} title="Terms of use">
        The rules for ordering, delivering and selling on Karrigo, in plain words.
      </PageIntro>
      <LegalSections sections={SECTIONS} />
    </PageBody>
  );
}
