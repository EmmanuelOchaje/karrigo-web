# Handoff: Karrigo — website, web app, admin, groceries

## Overview
Karrigo delivers food from local kitchens and groceries from local stores. This bundle covers every surface changed in the latest design pass:

- **Website** — marketing landing page, rebranded and rewritten for food + groceries.
- **Web app** — customer ordering for food and groceries (browse → menu/store → cart → checkout → tracking).
- **Admin** — operations dashboard, plus the groceries-specific admin views.
- **Mobile (groceries)** — customer app and store app, stripped back to what the backend supports.
- **Parked** — designs for features that are deliberately NOT being built yet. Reference only.

## About the design files
Everything here is a **design reference built in HTML** — prototypes that show the intended look and behaviour. It is not production code. Rebuild these screens in the target codebase using its own framework, components and patterns. If there's no codebase yet, pick whatever framework suits the project.

Each `.dc.html` file opens directly in a browser (it loads `support.js` from the same folder). Styles are inline on each element, and the logic sits in a `class Component` at the bottom of each file. Read the markup to get exact values.

## Fidelity
**High fidelity.** Colours, type, spacing, radii and copy are final. Match them exactly.

## Product decisions (read before building)
- **One cart** shared across food and groceries. Only one active order at a time.
- **Login only at checkout** (phone number). Browsing is anonymous.
- **Products are name + price only.** No units, weights or variants yet.
- **Store flow:** store receives order → may remove out-of-stock lines (customer is charged for what's left) → accepts → packs against a tick list → marks ready → hands to rider.
- **No rider app** for groceries. Same rider flow as food.
- **Commission:** 15% food, 10% groceries (admin Money screen splits by side).
- **Parked (do not build):** substitutions/swap approval, weighed items, card holds, cash on delivery for groceries, scheduled delivery, large-order fees, catalogue review.

### ⚠ Known conflict: website copy vs product
The website copy in `Karrigo Web v5` came from a marketing brief, and it **promises parked features**: swap approval, weighed-item pricing, mudu/basket units, cash on delivery and scheduled delivery. These lines appear in the "How it works" step 4, the "Groceries, done properly" section, the store FAQs, the riders card (bags/weight) and the download bullets. Confirm with the product owner before shipping. Either cut those lines or hold the launch until the features exist.

## Screens

### Website — `website/Karrigo Web v5.dc.html`
Single long landing page. Max content width 1240px, 18px side gutters, dark rounded panels (radius 44px) on a #DEDEDE page.
1. **Nav** — dark pill bar (#0E0F0D, radius 999px). Links: Kitchens, Stores, Areas, Partner with Karrigo, Riders. Lime CTA "Order now".
2. **Hero** — H1 "Food, groceries, / at your doorstep." (second line in lime #C6F432), 800 weight, clamp(38px, 5.6vw, 78px), line-height 1, letter-spacing -0.045em. Subtext: "Order from the kitchens and stores near you. A Karrigo rider brings it over, wherever your landmark is." Address pill with placeholder "Where should we deliver? Street, area or landmark" and button "See what's near me". **Food | Groceries switch** below (state `tab`, default `food`; the active option is lime on ink). The helper line under the switch changes with the tab. Two tilted phone mockups, the light one showing the Food/Groceries tabs. Three stat chips.
3. **Food rail** — auto-scrolling strip of dishes (42s linear loop).
4. **Open near you** — two grids, "Kitchens open now" and "Stores open now", each holding 4 cards (`auto-fill, minmax(232px,1fr)`). Store cards show time, fee or minimum, and "Open until 9pm". Store images are empty slots.
5. **How it works** — 4 cards. The active card cycles every 2.4s, swapping to the ink background.
6. **Groceries, done properly** — 4 white cards *(parked-feature copy, see warning above)*.
7. **Where Karrigo delivers** — large "7" plus area chips (High Level, Wurukum, North Bank, Wadata, Modern Market, Old GRA, Kanshio) and a bulky-order note.
8. **Partners** — 3 cards: Riders (lime), Kitchens (ink), Stores (cream #FFF4D6, CTA "Register your store"). Commission is shown in bold "15% commission" on both the kitchen and store cards. Keep it in one config value.
9. **FAQ** — `<details>` accordion with 9 questions (5 customer, 4 store).
10. **Download** — "Food and groceries, one app." plus 3 feature chips and a phone showing the tabs.
11. **Closing CTA** — lime panel, "Hungry, or out of provisions?"
12. **Footer** — tagline "Food and groceries from around Makurdi." and "© 2026 Karrigo. Makurdi, Benue State, Nigeria."

Mobile at 390px: every grid uses auto-fit/auto-fill, so cards stack to one column. Hero type clamps down. The nav needs a mobile treatment in production (the prototype doesn't collapse it).

### Web app — `webapp/Karrigo Order v2.dc.html`
Clickable customer flows for food and groceries: browse with Food/Groceries tabs, kitchen menu, store page, one shared cart with live price calculation, phone-number checkout, order tracking and error states (below minimum, item cap, closed store).
**Needs a pass before build:** the grocery side still contains parked features (substitution approval with countdown, weighed-item receipt lines, card-hold wording, cash, transfer-to-wallet, scheduled slots, large-order fee, "Estimated total"). Implement the grocery flow to match the product decisions above: a firm total, the store trimming lines at accept time, and tracking stages Received → Accepted → Packed → Rider on the way → Delivered.

### Admin — `admin/Karrigo Admin.dc.html`
Eight-screen ops dashboard: Live Orders, Kitchens (food + groceries), Riders, Customers, Money, Issues, Settings. Dark/light toggle, a vertical menu highlight that slides between items, and a blurred sticky navbar on scroll.

### Groceries admin — `admin/Karrigo Groceries - Admin v2.dc.html`
- Kitchens filtered to grocery stores, with fields for minimum order, item cap and commission rate.
- Flagged items. There is no catalogue review queue.
- Money split by side: 15% food, 10% groceries.
- Create grocery kitchen form (super admins only).

### Mobile — `mobile/`
- **Customer v2** — groceries customer flow on mobile, matched to the product decisions.
- **Store v2** — B1 order queue (New / Packing / All filters, Open/Closed toggle) → B2 review (untick out-of-stock lines, total recalculates, accept is disabled if everything is removed) → B3 pack tick list with progress bar ("Mark ready" stays blocked until every line is ticked) → B4 rider handover → B5 sent. B6 documents the edge states: nothing in stock, store closed, rejected order, part packed.
- Open backend questions: does a rejected order refund automatically or wait for admin? Can the store edit quantities, or only remove lines?

### Parked — `parked/`
Substitutions, weighed items, the rider app and other cut features. **Do not build.** Kept for future reference.

## Design tokens
**Colours**
- Ink `#0E0F0D` · Ink 2 `#171815` · Page `#DEDEDE` · App bg `#F6F5EE` · White `#FFFFFF`
- Lime `#C6F432` (primary accent) · Lime ink `#12180A` (text on lime) · Olive link `#4E6B00` (hover `#3A5000`)
- Cream `#FFF4D6` (text on ink, store card) · Sand `#EDEBDF` · Border `#E4E7DE` · Mid border `#C4C4C4`
- Muted text `#6F7565` · Muted 2 `#8A8F7C` · Body grey `#4A4F3E` · Secondary `#5D6156`
- Orange accent `#FF6A2B`
- Status: packing `#FFE9B8`/`#5A3C00`, ready `#DDE7FF`/`#1C3470`, error `#FFE3E3`/`#7A1B1B`, warning `#FFF3DE`/`#9A5F0`

**Type** — Plus Jakarta Sans 400–800. Display 800 with letter-spacing -0.04 to -0.045em. Body 500 at 14–16px with line-height 1.5–1.55. Labels 700 at 11.5–12px, uppercase, letter-spacing 0.04–0.08em.

**Radii** — pills 999px · panels 44px · large cards 30–36px · inner images 22–24px · mobile cards 15–20px · phone 50–58px.

**Shadows** — card hover `0 26px 48px -26px rgba(14,15,13,.4)` · nav `0 12px 30px -14px rgba(14,15,13,.55)` · phone `0 40px 80px -40px rgba(14,15,13,.6)`.

**Motion** — hover lift `translateY(-2px…-6px)` over .18–.22s · screen transitions slide in 36px over .3s ease-out · status dot pulse 1.6–2s · respect `prefers-reduced-motion`.

## Assets
- `assets/brand/` — Karrigo icon, horizontal logo and wordmarks. The bag mark is also inline SVG in the website nav and footer.
- `assets/bike.jpg` — 3D scooter render used on the riders card.
- `assets/3d/` — a 3D grocery-basket model (three.js) styled to match the scooter. Open the HTML to view it and export GLB/OBJ, or render a PNG on white for the stores card.
- Food photos are loaded from `https://m-kart-web.vercel.app/food/*.jpg`. **That host is currently down**, so replace it with your own hosted images.
- Store card images are empty placeholders. Real photos are needed.

## Files
```
website/  Karrigo Web v5.dc.html (+ support.js, image-slot.js, ios-frame.jsx)
webapp/   Karrigo Order v2.dc.html
admin/    Karrigo Admin.dc.html, Karrigo Groceries - Admin v2.dc.html
mobile/   Karrigo Groceries - Customer v2.dc.html, Karrigo Groceries - Store v2.dc.html
parked/   reference only — do not build
assets/   brand, bike render, 3D basket
github.md source repo pointer
```
