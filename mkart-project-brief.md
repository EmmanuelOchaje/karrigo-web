# Karrigo — Project Brief

**Version 0.1 · Draft · September 2026**
**Owner:** [your name] · **Status:** Pre-research

---

## 1. What we are building

Karrigo is a food delivery service for Makurdi, Benue State. Customers order from
local restaurants through a mobile app, pay by card, transfer or cash, and follow
their rider from the kitchen to their gate.

We are not building a Glovo clone for Nigeria. We are building the delivery
layer for one city that no national player currently serves properly, and we
intend to own that city before we think about a second one.

## 2. The problem

Ordering food for delivery in Makurdi today means calling a restaurant directly,
messaging them on WhatsApp, or sending a keke driver you know personally. That
means:

- **For customers:** no way to see what is available, no fixed price for
  delivery, no idea when food will arrive, and no recourse when it does not.
- **For restaurants:** delivery is an unpaid side job. Staff take orders by
  phone while cooking, and someone has to leave the kitchen to deliver.
- **For riders:** work is informal, irregular, and depends on personal contacts.

None of this is a technology problem in the abstract. It is a coordination
problem, and coordination is what an app is actually good for.

> **To be validated in research.** Every claim in this section is currently an
> assumption. Section 9 covers how we test them before writing code.

## 3. Why Makurdi, why now

- National players (Chowdeck, Glovo, Bolt Food) concentrate on Lagos, Abuja and
  Port Harcourt. Second-tier cities are largely unserved.
- Makurdi has a large student population (Benue State University, Joseph Sarwuan
  Tarka University) — young, phone-first, price-sensitive, and clustered
  geographically. That is close to an ideal first user base.
- Benue is an agricultural state with cheap, abundant food. Margins on the food
  itself are not the constraint; logistics is.
- A small city is a genuine advantage: short delivery distances, a knowable
  restaurant scene, and word of mouth that actually travels.

**The risk in this positioning:** if we prove the market works, a funded national
player can enter and outspend us. Our defence is depth — exclusive restaurant
relationships, a rider network that knows the roads, and a brand people trust
locally. Not technology.

## 4. Who we are building for

**Primary: the young working customer.** 20–35, salaried or hustling, orders
lunch at the office or dinner at home 2–5 times a week. Cares most about speed
and reliability. Will pay a delivery fee.

**Secondary: the student.** Highly price-sensitive, orders in groups, concentrated
around campus. High volume, low value per order. Good for density, bad for
margin. Useful for building habit and word of mouth.

**Restaurant partner.** Owner-operated, 5–20 staff, no existing digital presence,
no usable photos of their own food, suspicious of commission. Needs to see money
before they trust the process.

**Rider.** Owns or rents a bike, currently doing okada or informal delivery work.
Cares about earnings per hour and getting paid on time. Will leave immediately
for a better-paying option.

## 5. Scope

### In scope for v1

- Customer mobile app (Android first)
- Rider mobile app
- Restaurant order dashboard (web, tablet-friendly)
- Internal admin and dispatch panel (web)
- Marketing website with restaurant and rider signup
- Payments via a Nigerian gateway (Paystack or Flutterwave) plus cash on delivery
- Landmark-based addressing, not street addresses
- Live order tracking

### Explicitly out of scope for v1

- iOS app (Android is the overwhelming majority of the market here)
- Groceries, pharmacy, parcels or any non-restaurant vertical
- Scheduled or advance orders
- In-app chat between customer and rider (phone calls work)
- Loyalty programme, referral engine, subscriptions
- Multi-city support
- Anything blockchain-related

Every item on the "out" list is a thing we can add once the core loop works. The
failure mode for a project like this is building all of them first.

## 6. What "done" looks like for v1

A customer in High Level can open the app, see six restaurants that are actually
open, order pounded yam and egusi, pay with their card, watch the rider approach,
and eat within 40 minutes. The restaurant can mark egusi sold out at 2pm without
calling us. The rider gets paid on Friday without anyone doing arithmetic by hand.

If all of that works for 50 orders a day, v1 is done.

## 7. Success metrics

We will track these from day one. The first three matter most.

| Metric | Why it matters | Target by month 3 |
|---|---|---|
| Orders per day | The only number that really matters | 40–60 |
| Order-to-gate time | Our core promise | Under 35 min median |
| Repeat rate (30-day) | Whether the product actually works | Above 35% |
| Cancellation rate | Usually a restaurant or dispatch failure | Under 8% |
| Active restaurants | Supply health | 12–15 live |
| Active riders per day | Capacity | 6–10 |
| Contribution per order | Whether the unit economics can ever work | Break-even or better |

**Vanity metrics we will not report:** app downloads, registered users, social
media followers, total restaurants signed. None of them mean anything if orders
per day is flat.

## 8. Unit economics (to be validated)

Per order, roughly:

- Order value: ₦3,000 (assumption — validate against real restaurant tickets)
- Commission from restaurant: 15% = ₦450
- Delivery fee from customer: ₦500
- Rider payout: −₦450
- Payment gateway fee: −₦50
- **Contribution: around ₦450 per order**

At 50 orders a day that is roughly ₦675,000 a month gross contribution, before
salaries, marketing, or the incentives you will inevitably have to pay riders in
the early weeks to keep them online.

**This is the single most important thing to get right in research.** If
restaurants will not accept 15%, or riders will not work for ₦450 a trip, or
customers will not pay ₦500 delivery, the model has to change before you build
anything. Find out by asking people, not by launching.

## 9. Research phase (before any code)

**Weeks 1–3. Deliverable: a go / no-go / change-the-model decision.**

- **Restaurants:** interview 15 owners across High Level, Wurukum, North Bank and
  Modern Market. Establish: do they deliver now, how, what does it cost them,
  what commission would they accept, would they let us photograph their menu.
- **Riders:** interview 10. Establish: current earnings per day, what they would
  need per trip, whether they have phones that can hold a map, whether they would
  work for a company versus independently.
- **Customers:** survey 100+ (campus and offices). Establish: how they order now,
  how often, what they would pay for delivery, biggest frustration.
- **Competition:** confirm whether Chowdeck or anyone else is in Makurdi or
  planning to be. Check the app stores and ask restaurants directly.
- **Geography:** map delivery zones and typical distances. Test how well
  landmark-based addressing actually works by trying to find ten addresses.

Do not skip this to start coding. Code written against wrong assumptions is worse
than no code, because you will be reluctant to throw it away.

## 10. Phasing

| Phase | Duration | Output |
|---|---|---|
| 0. Research | 3 weeks | Validated model, or a changed one |
| 1. Design | 3 weeks | Flows and screens for all four surfaces |
| 2. Build | 10–12 weeks | Customer app, rider app, restaurant dashboard, admin |
| 3. Closed pilot | 4 weeks | 3 restaurants, 3 riders, one area, staff and friends only |
| 4. Public launch | — | One area of Makurdi, then expand area by area |

**Do not launch city-wide.** Launch in one area where you can personally recover
from every failure. Expand when the failures stop.

## 11. Team

| Role | Status | Notes |
|---|---|---|
| Product / founder | You | Research, priorities, restaurant relationships |
| Mobile developer | You or hire | React Native, both apps |
| Backend developer | **Hire — critical gap** | Orders, payments, dispatch logic |
| UI/UX designer | Contract, 4–6 weeks | All four surfaces |
| Operations lead | Hire | Riders, restaurant onboarding, daily dispatch |

The operations lead is not a nice-to-have. Delivery startups fail on operations
far more often than on code.

## 12. Budget

Roughly ₦1.5m–₦3.5m for the build phase, excluding marketing and ongoing
delivery operations. See the earlier breakdown for the line items. The range
depends almost entirely on whether people are paid market rate or working for
equity.

Separately, budget for **pilot operating costs**: rider guarantees during weeks
when volume is low, restaurant onboarding incentives, and refunds for orders that
go wrong. These are not one-off setup costs and they are easy to forget.

## 13. Key risks

| Risk | Severity | Mitigation |
|---|---|---|
| Riders quit for better pay | High | Guarantee minimum earnings during pilot; pay weekly without fail |
| Restaurants reject commission | High | Test in research; consider flat monthly fee as an alternative |
| Not enough order density | High | Launch in one dense area, not the whole city |
| Cash-on-delivery reconciliation | Medium | Cap cash orders per rider; daily settlement |
| A funded competitor enters | Medium | Exclusive restaurant deals; local brand depth |
| Founder split between this and Rust/Web3 study | **High** | Decide honestly which one gets your next six months |
| Fuel or bike maintenance costs spike | Medium | Structure rider pay per trip, not per hour |

## 14. Open questions

1. Do we take commission from restaurants, charge them a flat monthly fee, or both?
2. Do riders work as employees or independent contractors, and what does Nigerian
   labour law require in each case?
3. Cash on delivery — essential for adoption, but how do we reconcile it safely?
4. Who owns the customer relationship when a restaurant already has its own riders?
5. What happens to an order when a restaurant does not answer the tablet?

---
---

# What needs to be in place to run this properly

The brief above is the *what*. This is the scaffolding that keeps it from
becoming a folder of half-finished ideas.

## Legal and corporate

- [ ] **Register the business with CAC.** A Limited company, not a business name,
      if you plan to take investment or sign restaurant contracts. ₦50k–₦100k.
- [ ] **Corporate bank account.** Never run customer money through a personal
      account. This is the mistake that kills otherwise-healthy startups.
- [ ] **Get a TIN** and understand your VAT obligations.
- [ ] **Founder agreement**, in writing, before anyone writes code. Equity split,
      vesting, what happens if someone leaves, who owns the IP. This conversation
      is uncomfortable now and catastrophic later.
- [ ] **Restaurant partner agreement** — commission, payout schedule, food safety
      responsibility, who refunds what when an order goes wrong.
- [ ] **Rider agreement** — status, pay structure, insurance, liability for
      accidents and for lost or damaged food.
- [ ] **Terms of Service and Privacy Policy.** Google Play will not publish you
      without them, and NDPR (Nigeria Data Protection Regulation) applies to you
      the moment you store a customer's phone number and address.
- [ ] **Employment contracts** for anyone you hire.

## Financial

- [ ] **Bookkeeping from day one.** A spreadsheet is fine at first; no records is
      not. You will need this for investors, for tax, and for your own sanity.
- [ ] **Separate float for operations** — rider payouts, refunds, incentives —
      tracked apart from the build budget.
- [ ] **A weekly payout process** with a named person responsible. Riders leaving
      because payday slipped is the most avoidable failure in this business.
- [ ] **Payment gateway account** (Paystack or Flutterwave) with settlement
      account and reconciliation process defined.
- [ ] **A simple financial model** — orders, contribution, burn, months of runway.
      One spreadsheet, updated monthly.

## Technical

- [ ] **Version control** — GitHub organisation, not personal repos. Private.
- [ ] **Branch and review process.** Even solo, even two people. `main` stays
      deployable.
- [ ] **Environments:** local, staging, production. Never test against live data.
- [ ] **Secrets management.** API keys never in the repo. This is how payment
      credentials leak.
- [ ] **Automated backups** of the database, tested by actually restoring one.
- [ ] **Error monitoring** (Sentry or similar) and uptime alerting.
- [ ] **A written technical decision log** — why React Native, why this database,
      why this payment provider. In six months you will not remember, and neither
      will the developer who joins.
- [ ] **API documentation** — four clients talk to one backend. Undocumented, this
      becomes unworkable fast.

## Product and design

- [ ] **A single source of truth for scope.** One document — this one — that says
      what is in v1. Every "can we also add" goes to a backlog, not into v1.
- [ ] **Screen inventory** across all four surfaces, so nobody discovers the rider
      app needs eleven more screens in week nine.
- [ ] **Design system** — colours, type, spacing, components — defined once and
      shared across app and web.
- [ ] **A written definition of done** per feature: built, reviewed, tested on a
      real device on real Nigerian mobile data, and documented.

## Operations

- [ ] **Restaurant onboarding checklist** — sign agreement, photograph menu,
      enter items and prices, train on the tablet, test order, go live.
- [ ] **Rider onboarding checklist** — verify licence, check bike and phone,
      training on the app, first supervised delivery.
- [ ] **Support process.** One WhatsApp number, staffed during delivery hours,
      with a defined refund policy so decisions do not get made ad hoc.
- [ ] **An incident runbook** — what to do when the payment gateway is down, when
      a rider has an accident, when a restaurant refuses to fulfil an order.
- [ ] **Daily ops rhythm** — who checks the dispatch board, who confirms
      restaurants are open, who reconciles cash.

## Ways of working

- [ ] **Weekly team meeting**, 30 minutes, same time. What shipped, what is
      blocked, what is next.
- [ ] **A task board** (Linear, Trello, GitHub Projects — the tool barely matters).
      Everything visible, everything owned by a named person.
- [ ] **A shared drive** with a sane folder structure for contracts, research,
      designs and finance.
- [ ] **Written decisions.** When you decide commission is 15%, write down the
      date and the reasoning. Nine months from now someone will ask why.
- [ ] **A monthly review against the metrics in section 7.** If orders per day is
      flat for two months, something is wrong with the model, not with effort.

---

## The honest recommendation

Do section 9 before anything else. Three weeks of interviews in Wurukum and
Modern Market will tell you more about whether this business works than three
months of building will, and it costs you transport fare instead of ₦2 million.

Second: decide about the Rust and Web3 track. This project needs your full
attention for six months minimum, and it has nothing to do with blockchain. Both
paths are legitimate. Doing both at half strength is the one that fails.
