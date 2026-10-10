# Web handoff: match the backend's "one business, two onboardings" (and the other new backend features)

Written 2026-10-10 so work can continue in another tool (Codex) if the first session stops. **This file is the single source of truth.** Update the *Progress log* at the bottom after every task (tick the box, add the commit hash, note anything surprising).

## 0. Where things are

| Thing | Path |
|---|---|
| This web repo | `/Users/mac/Desktop/kha1ide/projects/work-projects/karrigo/karrigo-web` (branch `dev`, was clean when this started) |
| Backend repo | `/Users/mac/Desktop/kha1ide/projects/work-projects/karrigo/karrigo-be` (branch `dev`, last backend commit `d006735`, **not pushed**, not deployed) |
| Backend contract docs | `/Users/mac/Desktop/kha1ide/projects/work-projects/karrigo/docs/partner-onboarding-contract.md` and `web-partners-routes.md` |
| Original plan (same tasks, more detail on 1 to 7) | `/Users/mac/Desktop/kha1ide/projects/work-projects/karrigo/docs/superpowers/plans/2026-10-10-web-partners-business.md` |
| Other backend requests/answers | `/Users/mac/Desktop/kha1ide/projects/work-projects/karrigo/BACKEND-REQUESTS.md` |

Package manager here is **npm** (`package-lock.json`). Verify with `npx tsc --noEmit`, `npx eslint <the files you changed>`, `npm run build`. There is no test runner. **`npm run lint` already fails on the untouched repo (57 problems, 11 errors, in files like `theme.ts` and generated code), so lint only your changed files and make sure you add no new problems.**

**Read `CLAUDE.md` in this repo first**, especially: use `theme.ts` tokens (never hardcode colours/sizes), lime is a fill never text on light, role checks are server-side, money is kobo in the web (the API sends naira, convert with `nairaToKobo`/`koboToNaira` in `@/lib/money`), Server Components by default, Zod for input, no `any`, plain warm specific copy, every list has loading/empty/error states. **This is a newer Next.js than you know: read `node_modules/next/dist/docs/` before using any Next API** (redirects, route handlers, caching, `PageProps` typing).

## 1. What changed in the backend (the short version)

A partner is now one **business**: one shared login (owner + staff) and one payout account, with at most one **kitchen** and one **store**. Each side has its own onboarding, location, rider fee, 6 verification photos, ops approval, suspension and appeal.

- Sign-up, one per onboarding: `POST /v1/kitchen-auth/register` (fields incl. `kitchenName`, optional `cuisine`) and `POST /v1/store-auth/register` (`storeName`). Both also take `name, email, password, phone, otpCode, emailOtpCode, areaId`. OTPs: `POST /v1/kitchen-auth/otp/request {phone}` and `/email-otp/request {email}` (same under `/store-auth/`). 409 if the phone/email is already used by any partner login; 422 `AREA_NOT_FOUND`; 401 wrong code; 400 expired code.
- **One login, two prefixes.** `/v1/kitchen-auth/*` and `/v1/store-auth/*` have the same login, refresh, logout, password flows, `me`. The token works on both consoles. Email is matched ignoring case. Changing the password signs the account out everywhere.
- `GET /v1/kitchen-auth/me` returns `{ kitchenStaffId, businessId, kitchenId | null, storeId | null, staffRole }`. Use it to branch.
- **Missing side:** every `/v1/kitchen-console/*` route returns **409 `NO_KITCHEN`** for a business without a kitchen; every `/v1/store-console/*` route returns **409 `NO_STORE`** without a store. Treat as "show the register-your-business-as-X form", not an error.
- **Add the other side (owner only, no OTP, no password):** `POST /v1/kitchen-console/business/store {storeName, areaId}` and `POST /v1/store-console/business/kitchen {kitchenName, areaId, cuisine?}`. 409 `ALREADY_REGISTERED`, 403 for STAFF, 422 `AREA_NOT_FOUND`. New side starts `PENDING`.
- **Store console** (`/v1/store-console/...`, owner-only unless noted): `GET store` (adds `missing: ("LOCATION"|"RIDER_FEE")[]`, `verificationPhotoCount`), `PATCH store` (profile; send `lat` and `lng` together, 400 otherwise; `riderBaseFeeNaira` 500 to 20000; `isOpen:true` is 422 `STORE_NOT_READY` until location and fee are set), `POST store/appeal {message}`, `POST store/payout-account/resolve`, `PATCH store/payout-account {bankCode, accountNumber}`, `POST store/hero-image`, `POST|GET store/photos`, `DELETE store/photos/:id`, `GET geocode?query=`, `GET reverse-geocode?lat=&lng=`. Exactly **6** verification photos per side (a 7th is 409). The payout account is the **business's**, so it shows on both sides.
- **Admin:** `GET /v1/admin/stores?status=&q=`, `GET /v1/admin/stores/:id` (adds `business`, `kitchen | null`, `staff`, signed `verificationPhotos`, `recentAudit`), `PATCH /v1/admin/stores/:id/status {status:"ACTIVE"|"SUSPENDED", note?}` (approve needs all 6 photos: 422 `VERIFICATION_PHOTOS_REQUIRED` with `details:{required,have}`; suspend needs a note), `POST /v1/admin/stores` (SUPER_ADMIN) now returns `{ store, ownerEmail, temporaryPassword }`. `GET /v1/admin/kitchens/:id` still has `staff` (now the business's logins) plus `business` and `store`.
- **Changed admin shapes (breaks current web code):** support tickets and audit entries no longer have `kitchenStaff.kitchen` / `actorKitchenStaff.kitchen`; they have `business: { id, name, kitchen: { id, name, slug } | null }`.
- **Public tracking by link (new):** every new order has `trackingToken` (in the normal order response). `GET /v1/public/track/{token}` needs no login: `{ code, status, placedAt, deliveredAt, kitchens:[{name,status}], rider: { firstName, lat, lng } | null, etaMinutes | null }`. 404 for unknown or expired (24h after delivery/cancel). Rider position only while on the road; ETA is a rough estimate.
- **Public stats (new):** `GET /v1/public/stats` -> `{ users, orders, areas, downloads | null }`, cacheable for an hour. `downloads` is a manually set number and may be `null`.
- **Addresses without coordinates (new):** `POST /v1/addresses` accepts `areaId` (from `GET /areas`) and no `lat`/`lng`; the backend uses the area's centre. Send both `lat` and `lng` or neither (400 otherwise). 422 `AREA_HAS_NO_LOCATION` if that area has no map position yet. `area` (name) is optional when `areaId` is sent.

## 2. Current web facts (verified 2026-10-10)

- Partner auth uses the cookie scope `kitchen` (`karrigo_kt` / `karrigo_krt`, refresh `/kitchen-auth/refresh`) in `lib/api/scopes.ts`, written by `lib/api/session.ts`, refreshed by `proxy.ts`. **Keep the scope and cookie names**: it is the same token the backend now treats as the shared partner login; renaming would sign every kitchen out.
- Partner pages: `app/(order)/partners/{page,kitchen/page,store/page,rider/page}.tsx`; sign-in `app/(partner-auth)/partners/kitchen/login/page.tsx`. `app/(order)/partners/store/page.tsx` is only a holding page ("message us").
- Partner server actions: `app/(order)/partners/actions.ts` (`applyKitchen`, `kitchenLogIn`, `saveKitchenLocation`, `saveKitchenBank`, `uploadKitchenPhoto`, `appealKitchen`, ...). Data: `lib/partners/data.ts` (`getKitchenApplication`), `lib/kitchen/data.ts`. Components: `components/partners/{KitchenApply,KitchenSetup,parts}.tsx`, `components/kitchen/VerificationPhotos.tsx`.
- Links to `/partners/store`: `app/page.tsx:241`, `app/(order)/partners/page.tsx:17`, `components/site/SiteFooter.tsx:19`.
- The pinned `api/openapi.json` (127 paths) is older than the backend; `lib/api/extra.ts` holds hand-written shims for newer endpoints. Types: `npm run api:types` -> `lib/api/schema.d.ts`.
- Ops panel: `app/(admin)/admin/(shell)/{kitchens,riders,...}`, queue code `lib/admin/queue.ts` (`QueueKind = "kitchens" | "riders"`), `components/admin/queue/{ReviewQueue,QueueDetail,KitchenProducts}.tsx`, data `lib/admin/data.ts`. **Will crash once the new backend is live:** `app/(admin)/admin/(shell)/audit/page.tsx` (`actor()` reads `e.actorKitchenStaff.kitchen.name`), `lib/admin/data.ts` ~l.49 (`staff.kitchen.name`), (`lib/admin/overview.ts` only reads the staff member's name, so it needs no change).
- Public tracking today: `app/(order)/track/page.tsx` redirects to login unless the viewer is the customer; `?order=<id>`. Components `components/order/TrackOrder.tsx`, live socket `lib/live.ts`.
- Addresses: `app/(order)/actions.ts` ~l.205 to 262 invents `MAKURDI = { lat: 7.7337, lng: 8.5214 }` when geocoding finds nothing. Form: `components/site/AddressForm.tsx`; areas from `lib/shop/areas.ts` (`listAreas`, `listAreaNames`).
- No landing-page "users and downloads" panel was found on this branch (`growthStats` is not referenced). Task 10 handles both cases.

## 3. Tasks, in order

Do them in this order, one commit each (message in brackets). After each: `npx tsc --noEmit && npm run lint`, and `npm run build` when pages/routes changed. Tick the box in the Progress log.

### Task 1: Ops panel survives the new admin shapes [`fix(admin): read kitchen staff's kitchen through the business`]
Create `lib/admin/staff.ts` with `staffLabel(staff)` returning `"Ada (Mama Put)"`: kitchen name if present (old `staff.kitchen` or new `staff.business.kitchen`), else the business name, else just the name. Use it in `audit/page.tsx` and `lib/admin/data.ts` (`loadTickets`); `overview.ts` needs no change. No direct `.kitchen.name` on a staff object may remain. Must accept both shapes (so web can deploy before or after the backend) without `any`.

### Task 2: Partner identity helper [`feat(partners): read the partner's business, kitchen and store`]
`lib/partners/types.ts`: `Partner = { businessId; kitchenId: string|null; storeId: string|null; isOwner: boolean }`, `StoreApplication` (like `KitchenApplication` without dishes/cuisine, plus `missing`). `lib/partners/data.ts`: `getPartner()` (`GET /kitchen-auth/me`, scope `kitchen`, null on 401/403), `getStoreApplication()` (`GET /store-console/store`, null on 401/403 and on 409 `NO_STORE`), and make `getKitchenApplication()` also return null on 409 `NO_KITCHEN`.

### Task 3: Route `/partners/stores` [`feat(partners): /partners/stores, with the old URL redirecting`]
Move `partners/store/page.tsx` to `partners/stores/page.tsx` (rewritten in Task 5). Permanent redirect `/partners/store` -> `/partners/stores` in `next.config.ts` (read the Next redirects docs first). Update the three links listed in section 2.

### Task 4: Shared sign-in and store sign-up [`feat(partners): store sign-up on the shared partner login`]
Extract the shared apply form from `KitchenApply.tsx` into `PartnerApply({ side, areas, onSubmit })`; keep `KitchenApply` a thin wrapper (kitchen page unchanged). Add `StoreApply`, action `applyStore` (mirror `applyKitchen`'s error mapping and token storage; store tokens with scope `kitchen`; redirect to `/partners/stores`), and `app/(partner-auth)/partners/stores/login/page.tsx` (same sign-in, redirect to `/partners/stores`).

### Task 5: Add the other side + the two pages [`feat(partners): register your business as a kitchen or a store`]
Actions `registerStoreForBusiness({storeName, areaId})` -> `POST /kitchen-console/business/store` and `registerKitchenForBusiness({kitchenName, areaId, cuisine?})` -> `POST /store-console/business/kitchen` (409 `ALREADY_REGISTERED`, 403, 422 mapped to friendly messages). Component `AddOtherSide({ side, areas, isOwner })` (non-owners get a plain "ask the owner" message). Both pages branch on `getPartner()`: signed out -> apply form; has the side -> setup; signed in without the side -> `AddOtherSide`. Headings: "Cook with Karrigo" / "Register your store"; for a signed-in owner without the side "Register your business as a kitchen/store".

### Task 6: Store setup checklist [`feat(partners): store setup and approval status`]
`StoreSetup` mirroring `KitchenSetup`: status (`PENDING` in review, `ACTIVE`, `SUSPENDED` with `rejectionNote` + appeal box), checklist: location, rider fee, payout account (done if the business already has one, show name + last 4), photos `x/6` (the kitchen's do not count). Actions: `saveStoreLocation` (lat+lng together), `saveStoreFee`, `saveStoreBank` (resolve account name first, as `saveKitchenBank` does), `uploadStorePhoto`/`deleteStorePhoto`, `appealStore`. Parametrise `components/kitchen/VerificationPhotos.tsx` by side instead of copying it. No products step (stores have no catalogue yet).

### Task 7: Regenerate API types [`chore(api): regenerate types from the business-model backend`]
Generate the OpenAPI JSON from the backend (see section 5), copy to `api/openapi.json`, `npm run api:types`, fix all type errors it surfaces, delete shims in `lib/api/extra.ts` that `Schemas` now covers. Expect `/store-auth`, `/store-console`, `/admin/stores`, `/public/track/{token}`, `/public/stats`.

### Task 8: Ops: review stores [`feat(admin): review stores`]
Extend the queue to a third kind: `QueueKind = "kitchens" | "riders" | "stores"` in `lib/admin/queue.ts`; a `storeItem()` mapper from `/admin/stores` rows and `/admin/stores/:id` detail (fields: area, owner(s) from `staff`, payout account name/last 4, the same-business kitchen status if any, `rejectionNote`, appeal). Checks: location set, rider fee set, payout account, photos `n/6`. New page `app/(admin)/admin/(shell)/stores/page.tsx` (copy how `kitchens/page.tsx` loads the queue), nav entry (see `lib/admin/nav.ts`), actions to approve/suspend via `PATCH /admin/stores/:id/status` (mirror the kitchen moderation action in `app/(admin)/admin/moderation-actions.ts`; always `requireAdmin()` server-side; show the 422 `VERIFICATION_PHOTOS_REQUIRED` message; a note is required to suspend). Photos viewer: reuse the kitchen photo viewer with the signed URLs from the store detail. No payout/money UI for stores (they cannot have orders yet): hide those controls rather than showing zeros. Optional if time: a "Create store" form calling `POST /admin/stores` (SUPER_ADMIN, shows the one-time `temporaryPassword` once).

### Task 9: Public tracking by link [`feat(track): no-login tracking link`]
New public route `app/(order)/track/[token]/page.tsx` calling `GET /public/track/{token}` (server, no scope, never cached). Read-only view: order code, status steps, kitchen names with their status, rider first name + whether on the road, ETA ("about 12 min") only when present, delivered time; a calm 404 page for unknown/expired ("This tracking link has expired or isn't right"). Refresh by polling (e.g. every 20 to 30 s while not delivered/cancelled, stop after); the socket needs login so do not use it here. No address, phone or payment data is shown (the API has none). Add a "Share tracking link" button on the existing `TrackOrder` view that copies `${SITE_URL}/track/${trackingToken}` (the order response now has `trackingToken`; add it to the web's order type; hide the button if it is null for old orders). Keep `/track?order=<id>` for the customer. Mobile-data-friendly: small page, no heavy images.

### Task 10: Homepage totals [`feat(home): real platform totals`]
Data function `getPublicStats()` in `lib/shop/` or `lib/live-stats.ts`: `api<{users,orders,areas,downloads}>("/public/stats", { revalidate: 3600 })`, server only, returning `null` on any failure. If the landing page already has a numbers/"users and downloads" panel (search `app/page.tsx` and `components/site` for it, or `growthStats` in `lib/fixtures.ts` on whatever branch has it), wire it to this and delete the fixture; show a figure only when it is real (hide `downloads` when `null`, and hide the whole panel if the fetch failed). If there is no such panel on this branch, add just the data function and say so in the progress log (do not invent a design).

### Task 11: Addresses without invented coordinates [`fix(checkout): send the area, not a made-up location`]
In `app/(order)/actions.ts`: remove the `MAKURDI` fallback. Resolve the customer's chosen area to its `areaId` (`listAreas()` has `{id, name}`; match by name, or carry the id through `PlaceInput`/`AddressForm` if that is cleaner). When the customer shared or picked real coordinates, send them (both) together with the area. When geocoding finds nothing, **omit `lat`/`lng`** and send `areaId`. Map 422 `AREA_HAS_NO_LOCATION` to "We can't place that area on the map yet. Pick the nearest area or add a landmark." and 400 as a form error. Keep delivery fee/distance logic as is (the backend now computes from the area centre).

### Task 12: Run everything against the real backend [no commit unless fixes]
See section 5. Walk: (a) store sign-up at `/partners/stores`; (b) from that account `/partners/kitchen` shows "register your business as a kitchen", submit it; (c) kitchen-first sign-up then "register as a store"; (d) a STAFF login sees no add-side form (create one in the DB); (e) `/partners/store` redirects; (f) a pre-migration kitchen account signs in with a capitalised email; (g) ops audit log + tickets render for a store-only staff entry; (h) ops can approve a store only with 6 photos and see the 422 message otherwise, and suspend with a note; (i) a placed order's `/track/<token>` works logged out and expires correctly; (j) homepage totals render or are hidden; (k) an order to an address typed with no location is accepted with the area centre. Fix what breaks, one commit each.

## 4. Review checklist (what a reviewer should confirm at the end)

- Store-only owner on `/partners/kitchen` -> "register your business as a kitchen" (no crash on 409 `NO_KITCHEN`); kitchen-only owner on `/partners/stores` -> "register as a store".
- STAFF never sees the add-side form; 403 shows a message.
- Signed-out visitors see their page's own sign-up and a link to the shared sign-in.
- An already signed-in kitchen owner stays signed in after deploy; `/partners/store` still works.
- Ops audit/tickets render for kitchen-less staff and old-shape entries.
- Payout account set on one side shows as done on the other; photos are 6 per side.
- Public tracking page leaks nothing beyond the API's fields and handles 404/expired.
- No hardcoded colours/sizes, no `any`, loading/empty/error states present.

## 5. Running the new backend locally (for Task 7 and 12)

Backend is not deployed; the web's default `KARRIGO_API_URL` is `https://rx.karrigo.app/v1` (old backend). To test:

1. Postgres: the machine has `initdb`/`pg_ctl`. `initdb -D /tmp/pgdata -U postgres --auth=trust`, then `pg_ctl -D /tmp/pgdata -o "-p 54329 -c unix_socket_directories=''" -l /tmp/pg.log start`, `psql -h localhost -p 54329 -U postgres -c "create database karrigo_dev"`, apply every `karrigo-be/prisma/migrations/*/migration.sql` in name order with `psql -v ON_ERROR_STOP=1`.
2. Redis: `redis-server` (installed).
3. From `karrigo-be`: `pnpm install` (pnpm, not npm), `pnpm prisma generate`, then run with env `DATABASE_URL=postgresql://postgres@localhost:54329/karrigo_dev REDIS_URL=redis://localhost:6379 JWT_ACCESS_SECRET=dev KITCHEN_JWT_ACCESS_SECRET=dev2 ADMIN_JWT_ACCESS_SECRET=dev3 PORT=3002 RIDER_PER_KM_NAIRA=200 pnpm start:dev` (check `karrigo-be/.env.example` for anything else required; OTP/mail providers can be left blank in development, read the OTP code from the server logs if the service logs it, otherwise insert/read it in Redis).
4. Seed one admin: `pnpm seed:admin` (needs `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD`), and areas: `prisma/seed-areas.ts`.
5. Web: `KARRIGO_API_URL=http://localhost:3002/v1 npm run dev`; the ops panel is at `http://admin.localhost:3000`.
6. To regenerate `api/openapi.json` without a database: in `karrigo-be`, `pnpm exec nest build`, then a small node script using `NestFactory.create(AppModule, { preview: true, abortOnError: false, logger: false })`, `app.setGlobalPrefix('v1')`, `SwaggerModule.createDocument(app, new DocumentBuilder().addBearerAuth().build())` and write the JSON (dummy `DATABASE_URL`/`REDIS_URL` are fine). It gives about 163 paths.

If the backend cannot be run, say so in the progress log and rely on typecheck/lint/build; do not claim the flows were verified.

## 6. Decisions already made (do not re-ask)

- Keep cookie scope `kitchen` as the shared partner scope.
- `/partners/kitchen` and `/partners/stores` (plural) are the two onboarding routes; old `/partners/store` redirects.
- Add store review to the ops panel in this round; add public tracking, homepage totals and area-based addresses in this round.
- Ops store payouts/money UI is out of scope (stores cannot have orders yet).

## 7. Progress log (update as you go)

- [x] Task 1  Ops panel shapes (`lib/admin/staff.ts` has `staffLabel` and `staffWorkplace`)
- [x] Task 2  Partner identity helper (`getPartner`, `getStoreApplication`; shims `PartnerMe`, `StoreConsoleRow` in `lib/api/extra.ts` until Task 7)
- [x] Task 3  `/partners/stores` route + links (verified: `/partners/store` answers 308 to `/partners/stores`, query kept)
- [ ] Task 4  Shared sign-in + store sign-up
- [ ] Task 5  Add the other side + pages
- [ ] Task 6  Store setup checklist
- [ ] Task 7  Regenerate API types
- [ ] Task 8  Ops: review stores
- [ ] Task 9  Public tracking by link
- [ ] Task 10 Homepage totals
- [ ] Task 11 Addresses by area
- [ ] Task 12 Run against the real backend

Notes / surprises:
- Task 2 also changed `lib/kitchen/data.ts`: `getKitchen()` now treats 409 `NO_KITCHEN` as "no kitchen" (it used to throw), and `requireKitchen()` sends a signed-in store-only owner to `/partners/kitchen` (to register a kitchen) instead of the login form. `getPartner()` is `cache()`d so `/kitchen-auth/me` is read once per request.
- `npm run lint` is red on the untouched repo (57 problems); lint only the files you change.
- After moving/renaming a route, `npx tsc --noEmit` and `npm run build` can fail on stale generated types in `.next/dev/types` or `.next/types` (git-ignored). Delete those two folders and rebuild (check first that no `next dev` for *this* repo is running).
- Verifying the build: `npm run build` works offline and lists routes; `npx next start -p 3911` then `curl -I` is a quick runtime check.
