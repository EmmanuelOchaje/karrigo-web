# Karrigo — developer handoff

**For:** mobile developer · **Platform:** React Native, Android first
**Version:** 0.1 — auth flow only

---

## What you're getting

| File | What it is |
|---|---|
| `mkart-auth-flow.html` | 13 screens: sign up, sign in, and every state |
| `mkart-app-flow-dmsans.html` | 6 screens: home, dish, cart, tracking |
| `theme.ts` | Design tokens. Import these; don't hardcode values. |
| This document | Everything the mockups can't tell you |

## How to read the mockups

Open the HTML in Chrome, right-click any element, **Inspect**. The Styles and
Computed panels give you exact hex values, font sizes, weights, padding, gaps and
radii — the same information Figma's inspect panel gives you.

Toggle device mode (Cmd/Ctrl+Shift+M) and set the width to 390px to see the real
phone rendering rather than the scaled-down preview.

**The phone frames are not part of the design.** The black bezel, the rounded
corner, the status bar and the home indicator are all mockup furniture. Your
screen starts at the safe-area inset.

---

## Global rules

**Screen padding** is 16px left and right on every screen, with no exceptions.
The black header block is the only element that goes edge to edge.

**Everything is a pill or a 15px rounded rect.** Buttons and chips are fully
rounded (999). Cards, fields and OTP boxes are 13–15. The header block is 24 on
its bottom corners only.

**The lime is a fill, never text on white.** See the contrast note in `theme.ts`.
If you ever find yourself writing lime-coloured text on a light background, that's
a bug.

**Dark screens carry no shadows.** Depth on dark comes from the `ink2` surface
against `ink`. Shadows are for light screens only.

**Body copy on dark is weight 300.** This is what gives the design its feel. If it
tests too faint on a cheap 720p device in sunlight, raise it to 400 globally —
change it in `theme.ts`, not per component.

---

## Components to build first

Build these as shared components before building screens. Every screen is
assembled from them.

| Component | Variants | Notes |
|---|---|---|
| `Button` | acid, dark, muted, ghost | Full width by default. 46px tall. Muted = disabled state. |
| `TextField` | dark, light | 46px tall, 15 radius. Has optional left slot (country code) and divider. |
| `PhoneField` | — | Country code + divider + number. Format as they type: `801 234 5678` |
| `OtpInput` | default, error | 6 boxes. Auto-advance, auto-submit on 6th digit, paste-fills all six. |
| `BackButton` | dark, light | 29px circle |
| `ListRow` | — | Icon square + title + subtitle. Used for suggestions, permissions, addresses. |
| `Chip` | default, selected | Pill, optional colour dot or emoji |
| `FeatureIcon` | acid, muted, danger | 64px rounded square for the state screens |

---

## Screen-by-screen notes

### 01 · Splash
Show for as long as the auth check takes, no artificial delay. If a valid token
exists, go straight to Home — never show the sign-in screen to a signed-in user.

### 02 · Enter number
- Keyboard type: `phone-pad`, autofocus on mount
- Country code is fixed to +234 for v1. Don't build a country picker.
- Accept `0801...`, `801...` and `+234801...`; normalise to E.164 before sending
- **Button disabled until 10 digits are entered.** Use the `muted` variant.
- Rate limit: max 3 sends per number per hour, server-side

### 03 · Verify code
- 6 digits, numeric keyboard, autofocus first box
- **Android SMS Retriever API** — auto-fill the code without asking for SMS read
  permission. Your SMS body must end with the 11-character app hash. Worth doing;
  it removes the most annoying step in the whole flow.
- Auto-submit when the sixth digit lands. Don't make them press Verify.
- Resend disabled for 60s with a live countdown
- Code expires after 10 minutes

### 04 · Location permission
This screen appears **before** the system dialog. Its whole job is to raise the
grant rate, because Android will not re-prompt after a denial.

- "Allow location" triggers the system prompt
- "I'll type my address" skips straight to 05, no prompt fired
- If they deny at the system prompt → screen 13, not back to 04

> **Open decision.** We discussed moving this out of onboarding and asking at
> first restaurant tap instead — better conversion, same permission. Confirm with
> the product owner before building.

### 05 · Name & address
- Name: required, 2–40 chars
- Address: landmark text OR a coordinate from "use my current location"
- **Landmark addressing is the core product decision.** Free text plus a resolved
  area. Don't force a pin drag; most Makurdi addresses aren't street-addressable.
- Store both: the raw landmark string (shown to the rider verbatim) and the
  resolved area (used for filtering kitchens and pricing delivery)

### 06 · Welcome
The kitchen count and delivery hours are live data, not static copy. If zero
kitchens are open, change the message — don't show "0 kitchens are open."

### 07 · Sign in
Identical mechanism to 02. There is no separate signup and login: one number, one
flow, the server decides whether the account exists.

### 08 · Session expired
Pre-fill the last known number. Never make a returning user retype it.

### 09 · Wrong code
Show attempts remaining. Shake the OTP row on failure (see motion tokens).

### 10 · Code not arriving
The highest-value screen in this flow. SMS delivery in Nigeria is genuinely
unreliable and this is where signups die.

- Appears automatically after the first resend fails, or via a link on 03
- **"Call me with the code"** is voice OTP fallback. Costs more per attempt than
  SMS but recovers users the SMS path loses.
- WhatsApp support link opens `wa.me` with a prefilled message

### 11 · Too many attempts
Server-enforced, 15 minute lockout after 5 failures. Live countdown.

### 12 · No connection
Global — should appear anywhere a request fails, not just in auth.

### 13 · Location denied
This is a **permanent** state, not a one-off error. Android won't re-prompt, so
this screen has to work forever. Popular areas as one-tap options; the list comes
from the server so ops can update it as coverage grows.

---

## What the mockups don't cover — ask before you build

1. **Transitions.** Push from right for forward navigation, fade for state
   changes. Nothing bouncy.
2. **Loading states.** Every button needs one. Spinner replaces the label; button
   stays the same width so nothing jumps.
3. **Keyboard behaviour.** Content must scroll above the keyboard, and the primary
   button should ride above it rather than being covered.
4. **Dark mode.** Not designed. The app is dark-and-light by screen, not by system
   preference. Ignore system dark mode for v1.
5. **Tablet.** Not supported. Phone only.
6. **Accessibility.** Minimum tap target 44×44. All icons need labels. Text should
   survive a 200% system font scale — test this, several screens will break.
7. **Localisation.** English only for v1, but don't hardcode strings.

## Assets needed

- App icon (adaptive, Android): not yet designed
- Splash logo: currently a CSS square with "M" — needs a real mark
- Nigerian flag emoji in the phone field: fine as an emoji, or supply an SVG
- No other images in the auth flow

## Backend endpoints this flow implies

```
POST /auth/request-code     { phone }              → { attemptsLeft, retryAfter }
POST /auth/verify-code      { phone, code }        → { token, isNewUser }
POST /auth/request-voice    { phone }              → { retryAfter }
POST /users/me              { name }               → { user }
POST /users/me/addresses    { landmark, coords? }  → { address, resolvedArea }
GET  /areas/popular                                → [ { id, name } ]
GET  /areas/coverage        ?lat&lng              → { covered, areaName }
```

---

## About Figma

These HTML files work as a spec, and DevTools gives your developer the same
numbers Figma's inspect panel would. What they don't give you:

- A place for the developer to leave comments on a specific screen
- Version history when the design changes
- A component library your designer can maintain over time

For a build this size that matters eventually. Two options:

1. **Get a designer to rebuild these in Figma properly.** Cleanest long-term, and
   it's a few days of contract work rather than a full design engagement.
2. **Import the HTML into Figma.** There are plugins that convert HTML to Figma
   layers — worth searching the Figma community plugins for a current one, since
   they come and go. The output usually needs tidying but gets you 70% there.

Either way, `theme.ts` should be the source of truth for values, and Figma the
source of truth for layout. If they ever disagree, `theme.ts` wins.
