import "server-only";

import { ApiError, api, type Schemas } from "@/lib/api/client";
import { nairaToKobo } from "@/lib/money";
import type { Bank, KitchenApplication, RiderApplication } from "./types";

const last4 = (n: string | null | undefined) => (n ? n.slice(-4) : null);

/** The signed-in kitchen's own application, or null when nobody is signed in
 *  as a kitchen. */
export async function getKitchenApplication(): Promise<KitchenApplication | null> {
  try {
    const k = await api<Schemas["KitchenWithMenuResponseDto"]>("/kitchen-console/kitchen", { scope: "kitchen" });
    return {
      name: k.name,
      status: k.status,
      note: k.rejectionNote ?? null,
      area: k.area ?? null,
      landmarkNote: k.landmarkNote ?? null,
      hasLocation: k.lat != null && k.lng != null,
      bankAccountName: k.payoutAccountName ?? null,
      bankAccountLast4: last4(k.payoutAccountNumber),
      imageUrl: k.heroImageUrl ?? null,
      dishes: k.sections.flatMap((s) =>
        s.items.map((i) => ({ id: i.id, name: i.name, priceKobo: nairaToKobo(i.priceNaira) })),
      ),
    };
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) return null;
    throw error;
  }
}

/** The signed-in customer's rider profile, or null if they have not started
 *  one (the backend answers 403: "not a rider"). */
export async function getRiderApplication(): Promise<RiderApplication | null> {
  try {
    const r = await api<Schemas["RiderOwnProfileResponseDto"]>("/riders/me", { scope: "customer" });
    return {
      status: r.verificationStatus,
      note: r.rejectionNote ?? null,
      vehicleType: r.vehicleType ?? null,
      plateNumber: r.plateNumber ?? null,
      documents: { license: !!r.licenseDocUrl, id: !!r.idDocUrl, vehicleReg: !!r.vehicleRegDocUrl },
      guarantor:
        r.guarantorName && r.guarantorPhone
          ? { name: r.guarantorName, phone: r.guarantorPhone, address: r.guarantorAddress ?? "" }
          : null,
      bankAccountName: r.payoutAccountName ?? null,
      bankAccountLast4: last4(r.payoutAccountNumber),
    };
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403 || error.status === 404)) return null;
    throw error;
  }
}

/** Paystack's bank list. It barely changes, so an hour's cache is safe — and
 *  it is not a price. Sorted, and de-duplicated by code. */
export async function listBanks(): Promise<Bank[]> {
  try {
    const banks = await api<Schemas["BankResponseDto"][]>("/payments/banks", { revalidate: 3600 });
    const seen = new Set<string>();
    return banks
      .filter((b) => (seen.has(b.code) ? false : (seen.add(b.code), true)))
      .map((b) => ({ name: b.name, code: b.code }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    // The form says so; an applicant can still do every other step.
    return [];
  }
}
