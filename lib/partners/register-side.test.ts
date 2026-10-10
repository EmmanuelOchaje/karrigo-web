import { describe, expect, test } from "bun:test";

import { registrationFailureMessage, registrationRequest } from "./register-side";

describe("registrationRequest", () => {
  test("targets the kitchen console when an owner adds a store", () => {
    expect(
      registrationRequest("store", {
        storeName: "  Mama Ngozi Groceries  ",
        areaId: "area-1",
      }),
    ).toEqual({
      path: "/kitchen-console/business/store",
      body: { storeName: "Mama Ngozi Groceries", areaId: "area-1" },
    });
  });

  test("targets the store console and omits an empty cuisine when an owner adds a kitchen", () => {
    expect(
      registrationRequest("kitchen", {
        kitchenName: "  Terkimbi's Kitchen ",
        cuisine: "  ",
        areaId: "area-2",
      }),
    ).toEqual({
      path: "/store-console/business/kitchen",
      body: { kitchenName: "Terkimbi's Kitchen", areaId: "area-2" },
    });
  });
});

describe("registrationFailureMessage", () => {
  test("explains that only the business owner can add the other side", () => {
    expect(registrationFailureMessage({ status: 403, message: "Forbidden", body: {} }, "store")).toBe(
      "Only the business owner can register a store. Ask them to log in.",
    );
  });

  test("explains when the requested side is already registered", () => {
    expect(
      registrationFailureMessage(
        { status: 409, message: "Already registered", body: { code: "ALREADY_REGISTERED" } },
        "kitchen",
      ),
    ).toBe("Your business already has a kitchen.");
  });

  test("asks the owner to reload when an area is no longer available", () => {
    expect(
      registrationFailureMessage(
        { status: 422, message: "Area missing", body: { code: "AREA_NOT_FOUND" } },
        "store",
      ),
    ).toBe("That area isn't available any more. Reload the page and pick again.");
  });

  test("leaves unrelated failures to the shared action error handler", () => {
    expect(registrationFailureMessage({ status: 500, message: "No", body: {} }, "store")).toBeNull();
  });
});
