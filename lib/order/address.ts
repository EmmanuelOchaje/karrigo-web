/** Address search results as a person should read them. Safe in client code. */

const PLUS_CODE = /^[23456789CFGHJMPQRVWX]{2,8}\+[23456789CFGHJMPQRVWX]{2,3}$/i;
const POSTCODE = /^\d{5,6}$/;
const NOISE = /^(benue( state)?|nigeria|lga)$/i;

/**
 * The geocoder's raw label carries plus codes, postcodes and
 * "Benue, Nigeria". Keep only the place and its area:
 * "Plot 5, Gwer Rd, Makurdi".
 */
export function cleanAddressLabel(raw: string): string {
  const seen = new Set<string>();
  const parts = raw
    .split(",")
    .map((p) => p.trim().replace(/^[23456789CFGHJMPQRVWX]{2,8}\+[23456789CFGHJMPQRVWX]{2,3}\s+/i, ""))
    .map((p) => p.replace(/\s+\d{5,6}$/, ""))
    .filter((p) => p && !PLUS_CODE.test(p) && !POSTCODE.test(p) && !NOISE.test(p))
    .filter((p) => {
      const key = p.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  return parts.slice(0, 3).join(", ");
}
