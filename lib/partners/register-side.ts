export type PartnerSideToAdd = "kitchen" | "store";

type StoreInput = { storeName: string; areaId: string };
type KitchenInput = { kitchenName: string; areaId: string; cuisine?: string };

export function registrationRequest(
  side: "store",
  input: StoreInput,
): { path: string; body: StoreInput };
export function registrationRequest(
  side: "kitchen",
  input: KitchenInput,
): { path: string; body: KitchenInput };
export function registrationRequest(
  side: PartnerSideToAdd,
  input: StoreInput | KitchenInput,
): { path: string; body: StoreInput | KitchenInput } {
  if (side === "store") {
    const store = input as StoreInput;
    return {
      path: "/kitchen-console/business/store",
      body: { storeName: store.storeName.trim(), areaId: store.areaId },
    };
  }

  const kitchen = input as KitchenInput;
  const cuisine = kitchen.cuisine?.trim();
  return {
    path: "/store-console/business/kitchen",
    body: {
      kitchenName: kitchen.kitchenName.trim(),
      areaId: kitchen.areaId,
      ...(cuisine ? { cuisine } : {}),
    },
  };
}

type ApiFailure = {
  status: number;
  body: Record<string, unknown>;
};

function isApiFailure(error: unknown): error is ApiFailure {
  return Boolean(
    error &&
      typeof error === "object" &&
      "status" in error &&
      typeof error.status === "number" &&
      "body" in error &&
      error.body &&
      typeof error.body === "object",
  );
}

export function registrationFailureMessage(error: unknown, side: PartnerSideToAdd): string | null {
  if (!isApiFailure(error)) return null;

  if (error.status === 403) {
    return `Only the business owner can register a ${side}. Ask them to log in.`;
  }
  if (error.status === 409 && error.body.code === "ALREADY_REGISTERED") {
    return `Your business already has a ${side}.`;
  }
  if (error.status === 422 && error.body.code === "AREA_NOT_FOUND") {
    return "That area isn't available any more. Reload the page and pick again.";
  }
  return null;
}
