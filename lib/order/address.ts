/** Address search results as a person should read them. Safe in client code. */

/** Where Karrigo delivers: 15 km around the centre of Makurdi. */
export const DELIVERY_CENTRE = { lat: 7.7322, lng: 8.5391 };
export const DELIVERY_RADIUS_KM = 15;

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function insideDeliveryArea(point: { lat: number; lng: number }): boolean {
  return distanceKm(point, DELIVERY_CENTRE) <= DELIVERY_RADIUS_KM;
}

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
