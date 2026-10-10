import type { components } from "./schema";

/** Every request and response shape in karrigo-be, generated from
 *  `api/openapi.json` (`bun run api:types`). Safe to import anywhere. */
export type Schemas = components["schemas"];
