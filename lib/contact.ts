/**
 * How people reach Karrigo. One place, so the contact page, the legal pages
 * and the store sign-up page never disagree. Anything left null is simply not
 * shown: never put a number or address here that is not monitored.
 */
export const CONTACT = {
  /** International format without the plus, e.g. "2348031234567". */
  whatsapp: null as string | null,
  email: null as string | null,
  hours: null as string | null,
};

export const whatsappLink = (number: string, text?: string) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
