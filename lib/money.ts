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
