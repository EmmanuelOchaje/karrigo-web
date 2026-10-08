"use server";

import { revalidatePath } from "next/cache";

import { ApiError, api, type Schemas } from "@/lib/api/client";
import { clearTokens, readRefreshToken, storeTokens } from "@/lib/api/session";
import type { DocumentKind } from "@/lib/partners/types";
import type { KitchenOtpRequested } from "@/lib/api/extra";
import { e164 } from "@/lib/phone";

/**
 * Applying to cook or ride for Karrigo. Both end in the same place — a
 * profile waiting for ops to approve it. The backend does the real checking
 * (it resolves the bank account with Paystack, it gates dishes on a location);
 * this layer turns its answers into sentences an applicant can act on.
 */

type Failure = { ok: false; error: string; /** Seconds until a rate-limited request may be repeated. */ retryAfter?: number };
type Done<T = object> = ({ ok: true } & T) | Failure;

function failure(error: unknown): Failure {
  if (error instanceof ApiError && error.status === 409 && error.body.code === "DOCUMENTS_LOCKED") {
    return {
      ok: false,
      error: "You're approved, so your documents and guarantor are locked. Contact Karrigo if something needs changing.",
    };
  }
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

/** Step one of applying: text a code to the number the kitchen will use. */
export async function requestKitchenOtp(phone: string): Promise<Done<{ resendCooldownSeconds: number }>> {
  try {
    const result = await api<KitchenOtpRequested>("/kitchen-auth/otp/request", {
      method: "POST",
      body: { phone: e164(phone) },
    });
    return { ok: true, resendCooldownSeconds: result.resendCooldownSeconds };
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { ok: false, error: "That number already has a kitchen account. Log in instead." };
    }
    if (error instanceof ApiError && error.status === 429) {
      const retryAfter = typeof error.body.retryAfterSeconds === "number" ? error.body.retryAfterSeconds : undefined;
      return {
        ok: false,
        error: retryAfter
          ? `Too many codes requested. Try again in ${waitText(retryAfter)}.`
          : error.message,
        retryAfter,
      };
    }
    return failure(error);
  }
}

function waitText(seconds: number): string {
  if (seconds < 90) return `${seconds} seconds`;
  if (seconds < 5400) return `${Math.ceil(seconds / 60)} minutes`;
  return `${Math.ceil(seconds / 3600)} hours`;
}

export async function applyKitchen(input: {
  name: string;
  email: string;
  password: string;
  phone: string;
  otpCode: string;
  kitchenName: string;
  cuisine: string;
  areaId: string;
}): Promise<Done> {
  try {
    const result = await api<Schemas["RegisterKitchenResponseDto"]>("/kitchen-auth/register", {
      method: "POST",
      body: {
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        password: input.password,
        phone: e164(input.phone),
        otpCode: input.otpCode,
        kitchenName: input.kitchenName.trim(),
        areaId: input.areaId,
        ...(input.cuisine.trim() ? { cuisine: input.cuisine.trim() } : {}),
      },
    });
    await storeTokens("kitchen", result);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        const left = error.body.attemptsRemaining;
        return {
          ok: false,
          error:
            typeof left === "number"
              ? `That code isn't right. ${left} ${left === 1 ? "try" : "tries"} left.`
              : "That code isn't right.",
        };
      }
      if (error.status === 400 && /expired/i.test(error.message)) {
        return { ok: false, error: "That code expired. Request a new one." };
      }
      if (error.status === 409) {
        return {
          ok: false,
          error: error.message || "That email or phone already has a kitchen account. Log in instead.",
        };
      }
      if (error.status === 422 && error.body.code === "AREA_NOT_FOUND") {
        return { ok: false, error: "That area isn't available any more. Reload the page and pick again." };
      }
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

/** A suspended kitchen's owner gets one appeal per ban. The kitchen stays
 *  suspended until ops lifts it; there is no going back to the queue. */
export async function appealKitchen(message: string): Promise<Done> {
  const text = message.trim();
  if (!text) return { ok: false, error: "Tell us what has changed." };
  if (text.length > 500) return { ok: false, error: "Keep it under 500 characters." };
  try {
    await api("/kitchen-console/kitchen/appeal", { method: "POST", scope: "kitchen", body: { message: text } });
    revalidatePath(KITCHEN_PAGE);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) {
      return { ok: false, error: "Only the kitchen's owner can send an appeal. Ask them to log in." };
    }
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

/**
 * Send a rejected application back to ops without uploading anything — for
 * when the fix was the guarantor, or nothing needed a new photo. karrigo-be
 * refuses it unless all three documents and the guarantor are on file.
 */
export async function requestRiderReview(): Promise<Done> {
  try {
    await api("/riders/me/request-review", { method: "POST", scope: "customer" });
    revalidatePath(RIDER_PAGE);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      revalidatePath(RIDER_PAGE);
      return { ok: false, error: "Your application is already with our team." };
    }
    return failure(error);
  }
}

export async function saveRiderBank(bankCode: string, accountNumber: string) {
  return saveBank("/riders/me/payout-account", "customer", RIDER_PAGE, bankCode, accountNumber);
}
