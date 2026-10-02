import "server-only";

import { cache } from "react";

import { ApiError, api, type Schemas } from "@/lib/api/client";
import { nairaToKobo } from "@/lib/money";
import type { Customer } from "./types";

/** The signed-in customer, or null. One lookup per request. */
export const getCustomer = cache(async (): Promise<Customer | null> => {
  try {
    const me = await api<Schemas["UserResponseDto"]>("/auth/me", { scope: "customer" });
    return {
      id: me.id,
      name: me.name ?? "",
      phone: me.phone,
      email: me.email ?? null,
      creditKobo: nairaToKobo(me.creditBalanceNaira),
    };
  } catch (error) {
    if (error instanceof ApiError && (error.unauthorized || error.status === 403)) return null;
    throw error;
  }
});
