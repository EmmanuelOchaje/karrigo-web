"use server";

import { headers } from "next/headers";

import { ApiError, api, type Schemas } from "@/lib/api/client";
import { clearTokens, readRefreshToken, storeTokens } from "@/lib/api/session";
import { nairaToKobo } from "@/lib/money";
import { e164 } from "@/lib/phone";
import { priceLines } from "@/lib/shop/catalog";
import { getCustomer } from "@/lib/shop/session";
import type { Customer, PricedCart } from "@/lib/shop/types";

/**
 * Every customer mutation, as a Server Action. The backend does the real
 * checking (it re-prices from live menu prices and re-checks the delivery
 * zone); this layer turns its answers into sentences a hungry person can act
 * on, and never lets a raw error reach the screen.
 */

export type Failure = { ok: false; error: string; /** Seconds before another code can be asked for. */ retryAfter?: number };
type Done<T = object> = ({ ok: true } & T) | Failure;

function failure(error: unknown, fallback = "That didn't go through. Try again."): Failure {
  if (error instanceof ApiError) {
    const retry = error.body.retryAfterSeconds;
    return {
      ok: false,
      error: error.message,
      ...(typeof retry === "number" ? { retryAfter: retry } : {}),
    };
  }
  return { ok: false, error: fallback };
}

/* ------------------------------------------------------------------ auth */

export async function logIn(phone: string, password: string): Promise<Done<{ needsOtp?: boolean }>> {
  try {
    const tokens = await api<Schemas["TokenPairResponseDto"]>("/auth/login", {
      method: "POST",
      body: { phone: e164(phone), password },
    });
    await storeTokens("customer", tokens);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && error.body.passwordNotSet) {
      return {
        ok: false,
        error: "This number has no password yet. Use “Forgot password” to set one.",
      };
    }
    if (error instanceof ApiError && error.status === 401) {
      return { ok: false, error: "That number and password don't match. Check both and try again." };
    }
    return failure(error);
  }
}

export async function logOut(): Promise<void> {
  const refreshToken = await readRefreshToken("customer");
  if (refreshToken) {
    await api("/auth/logout", { method: "POST", body: { refreshToken } }).catch(() => {});
  }
  await clearTokens("customer");
}

/** Step one of signup, and of resetting a forgotten password. */
export async function requestCode(phone: string, intent: "signup" | "reset"): Promise<Done> {
  try {
    await api("/auth/otp/request", { method: "POST", body: { phone: e164(phone), intent } });
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { ok: false, error: "That number already has an account. Log in instead." };
    }
    if (error instanceof ApiError && error.status === 404) {
      return { ok: false, error: "No account with that number. Sign up instead." };
    }
    return failure(error);
  }
}

/**
 * Step two: the code proves the phone, which earns a one-shot token for
 * setting the password; that call is what signs them in. The name is saved
 * last, once there is a session to attach it to.
 */
export async function verifyAndSetPassword(input: {
  phone: string;
  code: string;
  password: string;
  name?: string;
}): Promise<Done> {
  try {
    const verified = await api<Schemas["PhoneVerifiedResponseDto"]>("/auth/otp/verify", {
      method: "POST",
      body: { phone: e164(input.phone), code: input.code },
    });
    const tokens = await api<Schemas["TokenPairResponseDto"]>("/auth/password/set", {
      method: "POST",
      body: { setupToken: verified.setupToken, password: input.password },
    });
    await storeTokens("customer", tokens);

    if (input.name?.trim()) {
      // A name that fails to save must not undo a successful signup.
      await api("/auth/me", { method: "PATCH", scope: "customer", body: { name: input.name.trim() } }).catch(
        () => {},
      );
    }
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { ok: false, error: "That code didn't work, or it has expired. Check it or ask for a new one." };
    }
    return failure(error);
  }
}

/* ------------------------------------------------------------------ cart */

/** Prices the cart against the menu as it is right now. Called when a cart is
 *  opened and again at checkout. */
export async function priceCartAction(
  slug: string,
  lines: Record<string, number>,
): Promise<Done<{ cart: PricedCart | null }>> {
  try {
    return { ok: true, cart: await priceLines(slug, lines) };
  } catch (error) {
    return failure(error, "We couldn't check the menu just now. Try again.");
  }
}

export async function validatePromo(code: string, subtotalKobo: number): Promise<Done<{ discountKobo: number; code: string }>> {
  try {
    const result = await api<{ code: string; discountNaira: number }>("/orders/promo/validate", {
      method: "POST",
      scope: "customer",
      body: { code: code.trim(), subtotalNaira: subtotalKobo / 100 },
    });
    return { ok: true, code: result.code, discountKobo: nairaToKobo(result.discountNaira) };
  } catch (error) {
    return failure(error);
  }
}

/* ----------------------------------------------------------------- order */

export type PayChoice = "card" | "transfer" | "cash";

export type PlaceInput = {
  kitchenSlug: string;
  lines: Record<string, number>;
  landmark: string;
  address: string;
  area: string;
  note: string;
  email: string;
  pay: PayChoice;
  promoCode?: string;
  /** From the browser's location, when they chose to share it. */
  coords?: { lat: number; lng: number };
};

/**
 * The centre of Makurdi, used when someone has not shared their location.
 * An address here is free text plus an area — never a dropped pin — so the
 * rider finds the gate from the landmark, and the coordinates only tell the
 * backend the order is inside the delivery zone.
 * TODO: replace with per-area centres once ops has surveyed them.
 */
const MAKURDI = { lat: 7.7337, lng: 8.5214 };

export async function placeOrder(
  input: PlaceInput,
): Promise<Done<{ orderId: string; payUrl: string | null; paymentHeld?: string }>> {
  const customer = await getCustomer();
  if (!customer) return { ok: false, error: "Log in to place your order." };

  try {
    // Re-check the cart against the live menu before anything is created.
    const cart = await priceLines(input.kitchenSlug, input.lines);
    if (!cart) return { ok: false, error: "That kitchen isn't taking orders right now." };
    if (!cart.kitchen.open) {
      return { ok: false, error: `${cart.kitchen.name} is closed right now${cart.kitchen.notice ? `: ${cart.kitchen.notice}` : "."}` };
    }
    if (cart.unavailable.length) {
      return {
        ok: false,
        error: `${cart.kitchen.name} has run out of ${cart.unavailable.join(", ")}. Take it out of your cart and try again.`,
      };
    }
    if (!cart.lines.length) return { ok: false, error: "Your cart is empty." };

    // Cards and transfers go through Paystack, which needs an email for the
    // receipt. Save it once so it is not asked again.
    if (input.pay !== "cash" && !customer.email) {
      const email = input.email.trim();
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return { ok: false, error: "Add your email so Paystack can send your receipt." };
      }
      await api("/auth/me", { method: "PATCH", scope: "customer", body: { email } });
    }

    const where = input.landmark.trim();
    const street = input.address.trim();
    const addressId = await saveAddress({
      line1: street || where,
      area: input.area,
      instructions: [where && street ? `Landmark: ${where}` : "", input.note.trim()].filter(Boolean).join(". ") || undefined,
      ...(input.coords ?? MAKURDI),
    });

    const order = await api<Schemas["OrderWithDetailsResponseDto"]>("/orders", {
      method: "POST",
      scope: "customer",
      body: {
        addressId,
        items: cart.lines.map((l) => ({ menuItemId: l.dishId, qty: l.qty })),
        provider: input.pay === "cash" ? "CASH" : "PAYSTACK",
        ...(input.pay === "card" ? { channel: "CARD" } : input.pay === "transfer" ? { channel: "BANK_TRANSFER" } : {}),
        ...(input.promoCode ? { promoCode: input.promoCode } : {}),
      },
    });

    if (input.pay === "cash") return { ok: true, orderId: order.id, payUrl: null };

    // The order exists from here on. If the payment page can't be opened,
    // failing would leave the customer on checkout with a full cart, and
    // every retry would place the same order again. Send them to the order
    // instead, where "Pay now" tries the payment alone.
    try {
      const payUrl = await startPayment(order.id);
      return { ok: true, orderId: order.id, payUrl };
    } catch (error) {
      return { ok: true, orderId: order.id, payUrl: null, paymentHeld: paymentFailure(error).error };
    }
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      return {
        ok: false,
        error: "That address is outside the area Karrigo delivers to yet. Try a landmark closer to the town centre.",
      };
    }
    return failure(error);
  }
}

async function saveAddress(a: {
  line1: string;
  area: string;
  instructions?: string;
  lat: number;
  lng: number;
}): Promise<string> {
  const existing = await api<Schemas["AddressResponseDto"][]>("/addresses", { scope: "customer" });
  const same = existing.find(
    (e) =>
      e.line1 === a.line1 &&
      e.area === a.area &&
      (e.instructions ?? "") === (a.instructions ?? "") &&
      Math.abs(e.lat - a.lat) < 0.0005 &&
      Math.abs(e.lng - a.lng) < 0.0005,
  );
  if (same) return same.id;

  const created = await api<Schemas["AddressResponseDto"]>("/addresses", {
    method: "POST",
    scope: "customer",
    body: { label: "Delivery", city: "Makurdi", state: "Benue", isDefault: existing.length === 0, ...a },
  });
  return created.id;
}

/** Where Paystack's hosted page returns to: straight back to the tracking
 *  page, which keeps checking until the payment lands. */
async function startPayment(orderId: string): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  const result = await api<Schemas["InitializePaymentResponseDto"]>(`/payments/orders/${orderId}/pay`, {
    method: "POST",
    scope: "customer",
    body: { callbackUrl: `${proto}://${host}/track?order=${orderId}` },
  });
  return result.authorizationUrl;
}

/** Why the payment page would not open, in words for the customer. A
 *  refused return address is ours to fix, not theirs, and the backend's
 *  wording for it ("callbackUrl is not on an allowed…") means nothing to them. */
function paymentFailure(error: unknown): Failure {
  if (error instanceof ApiError && /callbackUrl/i.test(error.message)) {
    return {
      ok: false,
      error: "Your order is saved, but we can't open the payment page from this site yet. That's on our side — try Pay now again shortly.",
    };
  }
  return failure(error, "Your order is saved, but the payment page didn't open. Try Pay now again.");
}

/** Retry a payment that was abandoned or failed. */
export async function payAgain(orderId: string): Promise<Done<{ payUrl: string }>> {
  try {
    return { ok: true, payUrl: await startPayment(orderId) };
  } catch (error) {
    return paymentFailure(error);
  }
}

/* -------------------------------------------------------------- tracking */

export type TrackedOrder = {
  id: string;
  code: string;
  status: Schemas["OrderWithDetailsResponseDto"]["status"];
  kitchen: string;
  kitchenSlug: string;
  to: string;
  items: { name: string; qty: number; lineKobo: number }[];
  subtotalKobo: number;
  feeKobo: number;
  discountKobo: number;
  creditKobo: number;
  totalKobo: number;
  pay: PayChoice;
  /** Paystack payment still to be made or confirmed. */
  payment: "paid" | "pending" | "failed" | "refunded" | "cash";
  rider: { name: string; phone: string | null } | null;
  placedAt: string;
};

export async function fetchOrder(id: string): Promise<Done<{ order: TrackedOrder }>> {
  try {
    const o = await api<Schemas["OrderWithDetailsResponseDto"]>(`/orders/${encodeURIComponent(id)}`, {
      scope: "customer",
    });
    const p = o.payments[0];
    const riderUser = (o.rider?.user ?? null) as { name?: string | null; phone?: string | null } | null;
    const kitchen = o.kitchenOrders[0]?.kitchen;

    return {
      ok: true,
      order: {
        id: o.id,
        code: o.code,
        status: o.status,
        kitchen: o.kitchenOrders.map((k) => k.kitchen.name).join(" + "),
        kitchenSlug: kitchen?.slug ?? "",
        to: [o.address.line1, o.address.area].filter(Boolean).join(", "),
        items: o.kitchenOrders.flatMap((k) =>
          k.items.map((i) => ({
            name: i.nameSnapshot,
            qty: i.qty,
            lineKobo: nairaToKobo(i.unitPriceNaira) * i.qty,
          })),
        ),
        subtotalKobo: nairaToKobo(o.subtotalNaira),
        feeKobo: nairaToKobo(o.deliveryFeeNaira),
        discountKobo: nairaToKobo(o.discountNaira),
        creditKobo: nairaToKobo(o.creditAppliedNaira),
        totalKobo: nairaToKobo(o.totalNaira),
        pay: !p || p.provider === "CASH" ? "cash" : p.channel === "BANK_TRANSFER" ? "transfer" : "card",
        payment: !p || p.provider === "CASH" ? "cash" : ({ SUCCEEDED: "paid", PENDING: "pending", FAILED: "failed", REFUNDED: "refunded" } as const)[p.status],
        rider: o.rider ? { name: riderUser?.name ?? "Your rider", phone: riderUser?.phone ?? null } : null,
        placedAt: o.placedAt,
      },
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { ok: false, error: "We can't find that order on your account. Check you're logged in with the number you ordered with." };
    }
    return failure(error);
  }
}

export async function cancelOrder(id: string): Promise<Done> {
  try {
    await api(`/orders/${encodeURIComponent(id)}/cancel`, { method: "POST", scope: "customer" });
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { ok: false, error: "The kitchen has already started on it, so it can't be cancelled here. Report a problem instead." };
    }
    return failure(error);
  }
}

export async function currentCustomer(): Promise<Customer | null> {
  return getCustomer();
}
