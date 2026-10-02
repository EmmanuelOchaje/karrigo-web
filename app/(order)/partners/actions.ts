"use server";

import { revalidatePath } from "next/cache";

import { ApiError, api, type Schemas } from "@/lib/api/client";
import { clearTokens, readRefreshToken, storeTokens } from "@/lib/api/session";
import type { DocumentKind } from "@/lib/partners/types";
import { e164 } from "@/lib/phone";

/**
 * Applying to cook or ride for Karrigo. Both end in the same place — a
 * profile waiting for ops to approve it. The backend does the real checking
 * (it resolves the bank account with Paystack, it gates dishes on a location);
 * this layer turns its answers into sentences an applicant can act on.
 */

type Failure = { ok: false; error: string };
type Done<T = object> = ({ ok: true } & T) | Failure;

function failure(error: unknown): Failure {
  if (error instanceof ApiError) return { ok: false, error: error.message };
  return { ok: false, error: "That didn't go through. Try again." };
}

const KITCHEN_PAGE = "/partners/kitchen";
const RIDER_PAGE = "/partners/rider";

/** What the browser is allowed to send as a photo. Checked here as well as
 *  in the form: the form is a courtesy, this is the rule. */
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PHOTO_MAX_BYTES = 2.5 * 1024 * 1024;

function photoFrom(form: FormData): File | Failure {
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose a photo first." };
  if (!PHOTO_TYPES.includes(file.type)) return { ok: false, error: "Use a JPG or PNG photo." };
  if (file.size > PHOTO_MAX_BYTES) return { ok: false, error: "That photo is too large. Try a smaller one." };
  return file;
}

/* --------------------------------------------------------------- kitchen */

export async function applyKitchen(input: {
  name: string;
  email: string;
  password: string;
  phone: string;
  kitchenName: string;
  cuisine: string;
  area: string;
}): Promise<Done> {
  try {
    const phone = e164(input.phone);
    const result = await api<Schemas["RegisterKitchenResponseDto"]>("/kitchen-auth/register", {
      method: "POST",
      body: {
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        password: input.password,
        kitchenName: input.kitchenName.trim(),
        ...(phone ? { phone } : {}),
        ...(input.cuisine.trim() ? { cuisine: input.cuisine.trim() } : {}),
        ...(input.area ? { area: input.area } : {}),
      },
    });
    await storeTokens("kitchen", result);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { ok: false, error: "That email already has a kitchen account. Log in instead." };
    }
    return failure(error);
  }
}

export async function kitchenLogIn(email: string, password: string): Promise<Done> {
  try {
    const tokens = await api<Schemas["TokenPairResponseDto"]>("/kitchen-auth/login", {
      method: "POST",
      body: { email: email.trim().toLowerCase(), password },
    });
    await storeTokens("kitchen", tokens);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { ok: false, error: "That email and password don't match. Check both and try again." };
    }
    return failure(error);
  }
}

export async function kitchenLogOut(): Promise<void> {
  const refreshToken = await readRefreshToken("kitchen");
  if (refreshToken) {
    await api("/kitchen-auth/logout", { method: "POST", body: { refreshToken } }).catch(() => {});
  }
  await clearTokens("kitchen");
}

export type Place = { label: string; lat: number; lng: number };

export async function searchPlaces(query: string): Promise<Done<{ places: Place[] }>> {
  const q = query.trim();
  if (q.length < 3) return { ok: true, places: [] };
  try {
    const places = await api<Schemas["GeocodeResultResponseDto"][]>("/kitchen-console/geocode", {
      scope: "kitchen",
      // Bias the search to the city: "Wadata market" means the one in Makurdi.
      query: { query: /makurdi/i.test(q) ? q : `${q}, Makurdi` },
    });
    return { ok: true, places: places.slice(0, 5) };
  } catch (error) {
    return failure(error);
  }
}

/** Where the kitchen is. The point is what a customer's distance and the
 *  rider's pickup run from; the landmark is what a person reads. */
export async function saveKitchenLocation(input: {
  lat: number;
  lng: number;
  area: string;
  landmarkNote: string;
}): Promise<Done> {
  if (!Number.isFinite(input.lat) || !Number.isFinite(input.lng)) {
    return { ok: false, error: "Pick your kitchen's spot first." };
  }
  if (!input.area) return { ok: false, error: "Pick the area your kitchen is in." };
  try {
    await api("/kitchen-console/kitchen", {
      method: "PATCH",
      scope: "kitchen",
      body: {
        lat: input.lat,
        lng: input.lng,
        area: input.area,
        ...(input.landmarkNote.trim() ? { landmarkNote: input.landmarkNote.trim() } : {}),
      },
    });
    revalidatePath(KITCHEN_PAGE);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

async function saveBank(
  path: string,
  scope: "kitchen" | "customer",
  page: string,
  bankCode: string,
  accountNumber: string,
): Promise<Done<{ accountName: string | null }>> {
  if (!bankCode) return { ok: false, error: "Pick your bank." };
  if (!/^\d{10}$/.test(accountNumber)) return { ok: false, error: "A bank account number is 10 digits." };
  try {
    const result = await api<{ payoutAccountName?: string | null }>(path, {
      method: "PATCH",
      scope,
      body: { bankCode, accountNumber },
    });
    revalidatePath(page);
    return { ok: true, accountName: result.payoutAccountName ?? null };
  } catch (error) {
    return failure(error);
  }
}

export async function saveKitchenBank(bankCode: string, accountNumber: string) {
  return saveBank("/kitchen-console/kitchen/payout-account", "kitchen", KITCHEN_PAGE, bankCode, accountNumber);
}

export async function uploadKitchenPhoto(form: FormData): Promise<Done> {
  const file = photoFrom(form);
  if (!(file instanceof File)) return file;
  try {
    const body = new FormData();
    body.set("file", file, file.name || "kitchen.jpg");
    await api("/kitchen-console/kitchen/hero-image", { method: "POST", scope: "kitchen", body });
    revalidatePath(KITCHEN_PAGE);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

/** One dish. The first one also creates the section it sits in, so a new
 *  kitchen never has to learn what a "section" is before it can list food. */
export async function addDish(input: { name: string; description: string; priceNaira: number }): Promise<Done> {
  const name = input.name.trim();
  if (name.length < 2) return { ok: false, error: "Give the dish a name." };
  if (!Number.isFinite(input.priceNaira) || input.priceNaira <= 0) return { ok: false, error: "Add a price." };

  try {
    const kitchen = await api<Schemas["KitchenWithMenuResponseDto"]>("/kitchen-console/kitchen", { scope: "kitchen" });
    // The backend refuses dishes until it knows where the kitchen is. Say so
    // here rather than passing on whatever error that produces.
    if (kitchen.lat == null || kitchen.lng == null) {
      return { ok: false, error: "Set your kitchen's location first — then you can add dishes." };
    }

    const sectionId =
      kitchen.sections[0]?.id ??
      (
        await api<Schemas["MenuSectionResponseDto"]>("/kitchen-console/menu/sections", {
          method: "POST",
          scope: "kitchen",
          body: { label: "Menu" },
        })
      ).id;

    await api("/kitchen-console/menu/items", {
      method: "POST",
      scope: "kitchen",
      body: {
        sectionId,
        name,
        priceNaira: input.priceNaira,
        ...(input.description.trim() ? { description: input.description.trim() } : {}),
      },
    });
    revalidatePath(KITCHEN_PAGE);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function removeDish(id: string): Promise<Done> {
  try {
    await api(`/kitchen-console/menu/items/${encodeURIComponent(id)}`, { method: "DELETE", scope: "kitchen" });
    revalidatePath(KITCHEN_PAGE);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

/* ----------------------------------------------------------------- rider */

/**
 * Becoming a rider changes the account's role, and the access token in hand
 * was issued for a customer. Trade it for a fresh one straight away, or the
 * very next step — uploading a licence — is refused as "not a rider".
 */
async function renewCustomerSession(): Promise<void> {
  const refreshToken = await readRefreshToken("customer");
  if (!refreshToken) return;
  try {
    const tokens = await api<Schemas["TokenPairResponseDto"]>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });
    await storeTokens("customer", tokens);
  } catch {
    // Keep the session they have; proxy.ts renews it within 15 minutes.
  }
}

export async function saveVehicle(input: { vehicleType: string; plateNumber: string }): Promise<Done> {
  const body = {
    vehicleType: input.vehicleType.trim(),
    plateNumber: input.plateNumber.trim().toUpperCase(),
  };
  if (!body.vehicleType) return { ok: false, error: "Pick what you ride." };
  if (body.vehicleType !== "Bicycle" && body.plateNumber.length < 4) {
    return { ok: false, error: "Add your plate number." };
  }

  try {
    try {
      await api("/riders/onboard", { method: "POST", scope: "customer", body });
      await renewCustomerSession();
    } catch (error) {
      // Already a rider — this is an edit, not a first application.
      if (!(error instanceof ApiError && error.status === 409)) throw error;
      await api("/riders/me/vehicle", { method: "PATCH", scope: "customer", body });
    }
    revalidatePath(RIDER_PAGE);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

const DOCUMENT_KINDS: DocumentKind[] = ["license", "id", "vehicleReg"];

export async function uploadRiderDocument(form: FormData): Promise<Done> {
  const kind = String(form.get("kind"));
  if (!DOCUMENT_KINDS.includes(kind as DocumentKind)) return { ok: false, error: "Unknown document." };
  const file = photoFrom(form);
  if (!(file instanceof File)) return file;

  try {
    const body = new FormData();
    body.set("kind", kind);
    body.set("file", file, file.name || `${kind}.jpg`);
    await api("/riders/me/documents", { method: "POST", scope: "customer", body });
    revalidatePath(RIDER_PAGE);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function saveGuarantor(input: { name: string; phone: string; address: string }): Promise<Done> {
  const phone = e164(input.phone);
  if (input.name.trim().length < 2) return { ok: false, error: "Add your guarantor's full name." };
  if (!/^\+234\d{10}$/.test(phone)) return { ok: false, error: "Add your guarantor's phone number, like 0803 123 4567." };
  if (input.address.trim().length < 5) return { ok: false, error: "Add where your guarantor lives." };

  try {
    await api("/riders/me/guarantor", {
      method: "PATCH",
      scope: "customer",
      body: { guarantorName: input.name.trim(), guarantorPhone: phone, guarantorAddress: input.address.trim() },
    });
    revalidatePath(RIDER_PAGE);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function saveRiderBank(bankCode: string, accountNumber: string) {
  return saveBank("/riders/me/payout-account", "customer", RIDER_PAGE, bankCode, accountNumber);
}
