# Karrigo — build package

Everything needed to build Karrigo, a food delivery service for Makurdi, Benue
State, Nigeria.

## How to use this

1. Put this whole folder at the root of a new git repository
2. Open it with Claude Code
3. Say: **"Read CLAUDE.md, then do M0 from BUILD-ORDER.md"**
4. One milestone per session, commit at the end of each

## What's here

```
CLAUDE.md                 Read first. Stack, rules, conventions, open questions.
BUILD-ORDER.md            Ten milestones with prompts. Work through in order.
SCHEMA.sql                PostgreSQL schema, runnable.
API.md                    Endpoints, business rules, rate limits.
theme.ts                  Design tokens. Import these; never hardcode a value.
mkart-handoff.md          Per-screen behaviour notes.
mkart-project-brief.md    Business context: model, metrics, risks, unit economics.
design/                   Every screen as inspectable HTML.
```

## About design/

These are not pictures. Open any file in Chrome and use **Inspect** — the
Computed panel gives exact hex, px, weights, padding and radii, the same
information a Figma inspect panel would.

`design/mkart-design-complete.html` is all customer screens in one document with
a nav. The individual files are easier to work against milestone by milestone.

Set device mode to **390px** to see true phone rendering.

**The phone frames are mockup furniture.** The bezel, status bar and home
indicator are not part of the design.

## What is designed and what is not

| Surface | Screens | Status |
|---|---|---|
| Customer app | ~56 | Complete |
| Marketing site | 4 pages | Complete |
| Web ordering | 4 pages | Complete |
| Restaurant | 9 | Complete, phone-first |
| Rider app | ~10 | **Not designed. Do not build.** |
| Admin panel | ~10 | **Not designed.** Build plain, from the component library. |

## Things that are still open

Listed in full at the bottom of CLAUDE.md. The four that will cost a rewrite if
guessed wrong:

1. **Location permission timing** — during onboarding, or at first restaurant tap
2. **Rider assignment** — manual by ops, or automatic by distance
3. **Restaurant notifications** — a browser tab cannot reliably ring a locked
   Android phone. Native app, PWA push, or ops phones the kitchen.
4. **Late-order credit** — the design grants ₦500 automatically. Is that policy?

Ask before building any of these.

## Three things that are easy to get wrong

**Money is kobo, as integers.** ₦2,800 is `280000`. Never floats, anywhere.

**The lime `#C6F432` is a fill, never text on a light background.** It measures
1.4:1 on white — unreadable in sunlight, and Makurdi is sunny. The token for
accent-as-text on light is `#4E6B00`.

**Carts must revalidate against live availability**, on open and again at
checkout. Kitchens run out of dishes mid-afternoon. If you don't catch it in the
cart, you take payment for food that cannot be cooked.

## Non-code work this doesn't cover

The build package assumes a business exists around it. Still outstanding:

- Customer, restaurant and rider research — none done yet
- CAC registration and a corporate bank account
- Restaurant and rider agreements
- Paystack account and settlement setup
- Real food photography — every image in the designs is a placeholder
- Actual restaurants signed and riders recruited

`mkart-project-brief.md` covers all of this.
