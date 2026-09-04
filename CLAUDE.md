# CLAUDE.md

Project context for Claude Code. Read this before writing any code.

---

## What we're building

**M-Kart** — food delivery for Makurdi, Benue State, Nigeria.

Customers order from local restaurants, pay by card, transfer or cash, and follow
a rider from the kitchen to their gate. Three user types, one product:

| Role | Surface | Status |
|---|---|---|
| **Customer** | Web + Android app | Design complete |
| **Restaurant** | Web + Android app (same app, role-gated) | Design complete |
| **Rider** | Android app | Not designed yet — do not build |
| **Admin/ops** | Web, internal | Not designed yet |

## Build order — important

**Web first, app second.** Reasons:

1. Install friction is the largest drop-off in the funnel. A web link can be
   pasted into a WhatsApp group; an app cannot.
2. Order tracking by public link works with no account and no install. Every
   forwarded link is free marketing.
3. One Next.js codebase gives us the marketing site, the customer ordering flow,
   the restaurant dashboard and the admin panel.
4. The React Native app reuses the same API later.

Do not start the React Native app until the web flow works end to end.

## Stack

```
Next.js 15 (App Router) + TypeScript
Tailwind CSS
PostgreSQL (Supabase — also gives us auth-adjacent bits and storage)
Prisma ORM
Paystack (payments)
Termii or Africa's Talking (SMS OTP)
Mapbox (maps — cheaper than Google Maps at our volume; verify current pricing)
Vercel (hosting)
```

**Verify every version and price before committing.** These were chosen in
September 2026 and things move.

## Non-negotiable rules

1. **Never hardcode a colour, size or spacing value.** Everything comes from
   `theme.ts`. If a value is missing, add it to the theme rather than inlining it.

2. **The lime `#C6F432` is a FILL, never text on a light background.** It measures
   1.4:1 on white, which is unreadable in sunlight. On light backgrounds the
   accent-as-text token is `#4E6B00`. This is in the theme; use the token.

3. **Role checks are enforced server-side, always.** The customer and restaurant
   UIs ship in the same bundle. A customer must never be able to reach restaurant
   endpoints by manipulating client state.

4. **Money is stored in kobo as integers.** Never floats. `₦2,800` is `280000`.

5. **Every price shown to a user is fetched live**, never cached client-side
   across a session. Kitchens change prices and sell out.

6. **Nigerian mobile data is the constraint.** Optimise images aggressively, lazy
   load below the fold, and test on a throttled 3G profile before calling
   anything done.

## Business rules that are easy to get wrong

- **One kitchen per order.** A cart may only contain items from a single
  restaurant. Adding from another kitchen prompts to clear the cart.
- **Delivery fee varies by distance**, per kitchen, from a zone fee table. It is
  not a flat number.
- **Minimum order** is set per restaurant. Checkout is blocked below it, with the
  shortfall shown in naira.
- **Sold-out toggles reset automatically at each restaurant's opening time.**
- **Carts must revalidate** against live availability on open and again at
  checkout. An item can sell out while sitting in a cart.
- **Restaurants have 3 minutes to accept an order.** After that it auto-cancels
  and refunds.
- **Landmark addressing.** An address is free text plus a resolved area. Never
  require a map pin drag.

## Design source of truth

| Thing | Where |
|---|---|
| All screens | `design/` HTML files — open in a browser, use DevTools Inspect |
| Tokens | `theme.ts` — import these, never hardcode |
| Per-screen behaviour | `SPEC.md` |
| Database | `SCHEMA.sql` |
| Endpoints | `API.md` |
| What to build in what order | `BUILD-ORDER.md` |

If the HTML and `theme.ts` ever disagree, **`theme.ts` wins**.

## Conventions

- Server Components by default; `"use client"` only where interactivity demands it
- Server Actions for mutations, Route Handlers for anything the mobile app calls
- Zod for all input validation, shared between client and server
- No `any`. If typing is hard, the model is probably wrong.
- Errors surface as user-readable messages, never raw stack traces
- Every list has a loading state, an empty state and an error state. All three.

## Things that are NOT decided — ask before building

1. **Location permission timing.** During onboarding, or at first restaurant tap?
2. **Late-order credit.** The design grants ₦500 automatically. Is that policy?
3. **Rider assignment.** Manual by ops, or automatic by distance? Affects the
   dispatch model significantly.
4. **Restaurant notifications.** A browser tab cannot reliably ring a locked
   Android phone. Either a native app, a PWA with push, or ops phones the kitchen.
   This is a real operational decision, not a technical detail.

## Tone in the product

Plain, warm, specific. Say "Terkimbi's has run out of egusi", not "This item is
currently unavailable." Name the kitchen, name the rider, name the amount, name
the timeline. Never apologise vaguely.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
