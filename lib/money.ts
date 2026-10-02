/** Money is kobo, always integers. ₦2,800 is 280000. */

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 280000 -> "₦2,800". Kobo below a naira is rounded away for display only. */
export function formatKobo(kobo: number): string {
  return naira.format(Math.round(kobo / 100));
}

/** 280000 -> "−₦2,800", for discounts and refunds. */
export function formatKoboNegative(kobo: number): string {
  return `−${formatKobo(kobo)}`;
}

/** karrigo-be speaks whole naira (`feeNaira`, `totalNaira`); this app keeps
 *  kobo. Convert at the edge, once, so nothing inside ever holds a naira. */
export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

/** The reverse, for a request body. */
export function koboToNaira(kobo: number): number {
  return Math.round(kobo) / 100;
}
