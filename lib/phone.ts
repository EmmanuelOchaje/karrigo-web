/** 0803 123 4567 -> +2348031234567, the form karrigo-be stores. Returns ""
 *  for an empty input so an optional phone can be left out. */
export function e164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("234") ? `+${digits}` : `+234${digits.replace(/^0/, "")}`;
}
