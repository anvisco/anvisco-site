# Anvis Website Copy - Refinement Pass

Scope: homepage refinement, offer/services page, audit landing page, portfolio content notes, module request flow, and client stage pages.

Public brand name: Anvis. Keep `anvisco.com` and `brian@anvisco.com` unchanged where they refer to the domain or email address.

Typography rule: the serif/script treatment is reserved for the hero accent line only: "run, grow, and get discovered." All body copy, callouts, notes, email links, cards, and footer text use sans-serif.

Public navigation:
- Home -> `/`
- Work -> `/portfolio`
- Services -> `/services`
- Get Free Audit -> `/audit`

Footer navigation matches the public navigation. About and Process are not exposed in nav/footer. FAQ is included in nav/footer and scrolls to the homepage FAQ section.

CTA routing:
- "Get a Website Audit" and "Get Free Audit" -> `/audit`
- "See Selected Work" and "See Work" -> `/portfolio`
- Homepage module/service CTAs -> `/services`
- Paid audit, module, build, and recurring request CTAs -> `/checkout` with the relevant `path` query when needed
- Route changes scroll to the top by default; hash links use fixed-nav scroll margin when used.

---

## 1. Homepage

**Flow:**
1. Hero
2. Business Function
3. Modern Discovery
4. Three Paths
5. Modules Teaser
6. Custom Build / Rebuild Properly
7. Process
8. FAQ
9. Final CTA

### 1.1 Hero

**Label:**
Local service websites

**Headline:**
Websites built to run, grow, and get discovered.

**Subtext:**
I build custom websites for local service businesses that improve operations, trust, and conversion. Now structured for how people search through Google, AI tools, Maps, and local recommendations.

**Primary CTA:** Get Free Audit
**Secondary CTA:** See Selected Work

---

### 1.2 Business Function

**Public label:**
Business function

**Section title:**
Your website should do more than look good.

**Body:**
A good website should support the way your business actually works.

It should guide visitors, answer the right questions, build trust quickly, make booking easy, and help turn interest into real appointments.

Most websites only describe the business. Anvis builds sites that help run it.

Accent emphasis: "more than look good", "actually works", and "run it".

---

### 1.3 Modern Discovery

**Public label:**
Modern discovery

**Section title:**
Now it also needs to be built for how people search.

**Body:**
People do not only type short keywords into Google anymore. They ask Google, AI tools, Maps, and local recommendations direct questions.

Examples:
- "best dentist near me"
- "emergency dentist open nearby"
- "who should I trust for Invisalign?"

Your website needs to clearly explain who you are, what you offer, where you serve, and why people should trust you.

This is not a replacement for SEO. It is a layer on top of it.

This line is integrated into normal body copy, not a separate quote or callout box.

Accent emphasis: "how people search", "Google, AI tools, Maps, and local recommendations", "not a replacement for SEO", and "layer on top".

---

### 1.4 Offer Section - Three Paths

**Section title:**
Choose the layer your website needs most.

**Intro:**
Not every business needs a full rebuild. Some need clearer content. Some need a better booking flow. Some need stronger visuals. Some need faster mobile performance. Some need a custom website built from the ground up.

**Three cards:**

**Audit**
Find out where your site is losing visibility, trust, or bookings.
→ Start with an Audit

**Improve**
Upgrade specific parts of your existing website.
→ See Modules

**Rebuild**
A full custom-coded website built around your business.
→ See Custom Builds

---

### 1.5 Modules Teaser

**Section title:**
Targeted upgrades without a full rebuild.

**Intro:**
Start with the layer holding the site back, then view the full module menu when you need pricing and scope.

**Featured module cards:**

- **AI-Ready Content Architecture:** restructure content so people, Google, and AI tools clearly understand the business. Starting at $1,400.
- **Visual Redesign:** modernize the look without rebuilding the system. Starting at $1,800.
- **Booking Flow Optimization:** make it easier to move from interest to appointment. Starting at $1,200.

**CTA:** View all modules -> `/services`

---

### 1.6 Custom Build Section

**Section title:**
For businesses ready to rebuild properly.

**Body:**
A custom website gives more control over structure, speed, design, content architecture, search readiness, and the full path from discovery to booking. Built around how your business actually operates, not around a template.

Three tiers: Essentials, Standard, Premium. Public rates start at $2,200, with founding rates available for the first few dental and local service clients.

**CTA:** See Build Tiers

---

### 1.7 Process

1. Audit
2. Scope & recommend
3. Build or upgrade
4. Launch + handover

---

### 1.8 FAQ

Short homepage FAQ with six questions:

1. Do I need a full rebuild?
2. What makes a website AI-ready?
3. Is this replacing SEO?
4. Can you improve my existing site?
5. What happens after the audit?
6. Do I pay right away?

Answers stay short and plain. The homepage FAQ is the primary linked FAQ and includes `id="faq"` for nav scrolling.

---

### 1.9 Final CTA

**Headline:**
Ready to choose the right path for your website?

**Body:**
Start with a simple request. Choose whether you need an audit, targeted improvements, a full build, or ongoing support. No instant payment, just a clear next step.

**Primary CTA:** Start a Website Request -> `/checkout`
**Secondary CTA:** Compare Services -> `/services`

---

## 2. Offer / Services Page

### 2.1 Page Hero

**Headline:**
Built modular. Buy only the layer your business needs.

**Subtext:**
Anvis offers four ways to work together: an audit to start, modules to upgrade specific parts, a full custom build, and recurring plans to keep the site improving.

---

### 2.2 The Ladder

**Section title:**
The ladder.

**Body:**
Most agencies sell one thing: a full rebuild, whether or not it is the right move. Anvis is structured differently.

```
Audit  ->  Modules  ->  Full Build  ->  Recurring
```

Start where it makes sense. Upgrade when the business is ready.

---

### 2.3 Audit Section

**Section title:**
1. Audit

**Two options:**

**Free AI-Ready Website Snapshot**
Three to five priority findings. A quick first look at where the site may be losing visibility, trust, or bookings. No cost.

**Paid AI-Ready Website Audit - $250**
A deeper review with a ranked action plan covering visibility, trust, content, speed, and booking flow.

$250, credited toward any module or full build within 30 days.

**CTA:** Free snapshot goes to `/audit`; paid audit goes to `/checkout?path=audit`.

---

### 2.4 Modules Section

**Section title:**
2. Improvement Modules

**Body:**
For businesses that do not need a full rebuild yet. Six modules covering content, visuals, booking, motion, service pages, and mobile performance.

[List each of the six modules with the same descriptions and "starting at" pricing as the homepage modules section.]

**Bundle:**
Any three modules: 15% off the combined price.

**CTA:** Request Modules -> `/checkout?path=modules`

---

### 2.4.1 Request Checkout Flow

**Route:** `/checkout`

**Purpose:**
A single request flow for every offer - audit, modules, full build, recurring. Not a payment
checkout. The bundle discount is handled inside this flow.

**Behavior:**
- Step 1: pick a path (Audit, Modules, Full Build, Recurring).
- Step 2: configure scope.
  - **Audit:** $250 Full Audit, credited toward any module or build within 30 days. Free Snapshot
    stays on `/audit` as a contact request.
  - **Modules:** select any combination. Service Page Expansion is per page, minimum 3 pages.
    3+ modules unlocks the 15% bundle discount automatically.
  - **Full Build:** Essentials, Standard, or Premium. Both founding and public rates are shown.
  - **Recurring:** Care or Growth Plan, monthly.
- Step 3: client details (name, business, email, phone, website URL, notes).
- Submit button is labelled **Request Checkout**.
- On submit, the request is saved to Supabase (when configured) and the user lands on
  `/checkout/success`. If Supabase is not configured, a clear "backend not connected" message
  is shown.
- Brian follows up to confirm scope and send a hosted Stripe Payment Link, invoice, or
  e-transfer detail. **No card data is stored on this site.**

---

### 2.5 Full Build Section

**Section title:**
3. Full Custom Build

**Body:**
A custom-coded website designed for visibility, trust, speed, and bookings. Three tiers depending on scope.

**Essentials: public rate $2,200, founding rate $1,500**
Up to 5 pages. Mobile-first. Booking-focused. Basic AI-ready content structure. Local SEO foundations.

**Standard: public rate $3,800, founding rate $2,600**
Up to 10 pages. Full AI-ready content architecture. Schema setup. Booking integration. One additional language. Conversion tracking.

**Premium: public rate $6,500, founding rate $4,500**
Custom features. Portals, APIs, advanced flows. Up to two additional languages. Premium animations. CMS or easy editing layer.

**Founding rate:** Limited to the first few dental and local service clients.

**Payment:** 50% deposit to start. Balance due before launch.

**CTA:** Discuss a Full Build

---

### 2.6 Recurring Plans Section

**Section title:**
4. Recurring Plans

**Body:**
Two plans depending on whether the goal is ongoing care or active growth.

**Care Plan: $149/month**
Hosting and deployment support, small content and image updates (up to 1 hour/month, rolls over up to 2 hours), bug fixes, security and uptime monitoring, backups, and priority email support. Larger work scoped separately.

**Growth Plan: $449/month**
Everything in Care Plan, plus up to 3 hours of content or page updates monthly, one new or rebuilt service page per quarter, monthly AI visibility check, GBP alignment review, quarterly analytics review, and conversion improvements based on real traffic data. Caps reset monthly with one-month rollover.

**CTA:** Choose a Plan

---

### 2.7 FAQ

**How is this different from a Wix or Squarespace site?**
Templates are built for speed of setup, not for how a specific business operates or how people now search. Anvis builds custom-coded sites structured around your actual flow and around how people find local businesses today.

**Do I need a full rebuild?**
Probably not. Most businesses get more value from one or two modules than from a full rebuild. The audit is designed to tell you which path makes sense.

**What does "AI-ready" actually mean?**
Content and structure that both people and search systems, including Google, AI tools, and Maps, can clearly understand. Service clarity, location signals, FAQs based on real questions, schema-ready content blocks, and provider entity clarity.

**How long does a build take?**
Essentials: 7 to 10 days. Standard: 10 to 14 days. Premium: 14 to 21 days. Modules vary by scope.

**Are the founding rates real?**
Yes. They apply to the first few dental and local service builds, then prices return to public rates.

---

## 3. Audit Landing Page

### 3.1 Hero

**Headline:**
Find out what your website is missing.

**Subtext:**
A focused review of how your site performs on visibility, trust, conversion, and AI-search readiness, so you know exactly where to invest before spending on a rebuild.

**Primary CTA:** Get the Free Snapshot
**Secondary CTA:** Get the Full Audit - $250

---

### 3.2 The Two Audit Options

**Section title:**
Two ways to start.

**Two cards side by side:**

**Free AI-Ready Website Snapshot**
- 3 to 5 priority findings
- The highest-impact issues only
- Delivered as a short Loom or written summary
- No cost, no obligation
- Designed to start a conversation

**Best for:** Practices wanting a quick second opinion before committing to anything.

→ Request the Snapshot

---

**Paid AI-Ready Website Audit - $250**
- A deeper review with a ranked action plan
- Visibility, trust, content, speed, and booking flow
- $250, credited toward any module or build within 30 days

**Best for:** Practices that want depth and a clear plan before deciding what to invest in.

**Credit:** The $250 is credited toward any module or full build if you move forward within 30 days.

→ Request the Full Audit

---

### 3.3 What Gets Reviewed

**Section title:**
What gets reviewed.

**Body:**
Eight areas. Each one is a real source of lost visibility, trust, or bookings.

- **AI discovery readiness:** can AI search tools and Google AI results clearly understand and recommend the business?
- **Local SEO structure:** is the site structured for local intent and Maps visibility?
- **Service page clarity:** are services clearly explained, structured, and findable?
- **Schema and structured data:** is the site giving search systems machine-readable signals?
- **Mobile speed and performance:** does the site load fast and feel right on mobile?
- **Booking flow:** how easy is it to go from visitor to appointment?
- **Trust signals:** reviews, real photos, provider clarity, credentials.
- **Content gaps:** what is missing that prospects actually search for?

---

### 3.4 What You Walk Away With

**Section title:**
What you walk away with.

**Body:**
A clear, ranked list of fixes. Not a redesign pitch. Not a sales document. A practical breakdown of where the site is leaking visibility, trust, or bookings, and what the highest-leverage moves are.

If a rebuild is the right move, the audit will say so. If it is not, the audit will say that too.

---

### 3.5 Final CTA

**Headline:**
Start with the audit.

**Body:**
Most practices spend money on the wrong fix because they never had a clear picture of what was actually broken. The audit fixes that.

**Primary CTA:** Get the Free Snapshot
**Secondary CTA:** Get the Full Audit - $250

---

## 4. Portfolio Page - Content Update Notes

Scope: content update only, not a rebuild.

### Changes

**Lead piece:** Do Good Society
- Keep current case study content
- Tighten copy to emphasize systems and conversion, not visuals
- Add a short note: "Live and operating."

**Second piece:** AI-Ready Dental Demo
- New card
- Marked as **In progress**
- No hard ETA
- Short description: "A custom-coded demo showing how a clinic site should be structured for discovery, trust, and bookings: homepage, service pages, provider bio, location, FAQ, and booking flow."

**Third piece:** Next Build Slot
- Card copy: "Reserved for the next local service build that proves the system in the wild."
- Communicates intentional curation, not an empty portfolio

**About section:**
- Title: About Anvis
- Keep it short and conversion-relevant
- Explain that Anvis builds custom websites for local service businesses that need more than a visual refresh
- Mention structure, clarity, trust, conversion, and modern discovery
- Mention the portfolio is curated to show relevant systems and outcomes, not every project

**Pull from public showcase:**
- Any weak Wix work
- Any project that does not support the premium claim

**Keep available as supporting context (optional collapsible section, not main showcase):**
- Immigrant Women in Business
- Purpose Driven Transformations
- RTG Group

**Reasoning:** Empty but premium beats full but average. The portfolio should signal taste and judgment, not volume.

---

## 5. Implementation Notes

- Nav structure: Home, Work, Services, FAQ, Get Free Audit.
- Footer structure: Home, Work, Services, FAQ, Get Free Audit.
- Public-facing company name is Anvis. Domain/email references remain anvisco.com and brian@anvisco.com.
- Quote/callout boxes for "Most websites describe the business..." and "This is not a replacement for SEO..." are removed. Their meaning is integrated into normal body copy with short amber accent spans.
- Serif/script font usage is allowed only in the hero accent line. Email links, footer text, notes, cards, and body copy are sans-serif.
- All "starting at" pricing should be visible. No hidden quote-only pricing on modules.
- Founding rates shown on the full build tier only, with the framing line: "Limited to the first few dental and local service builds."
- Primary site CTA throughout: "Get a Website Audit" or "Get Free Audit" links to the audit landing page.
- Homepage is an overview and conversion path. It should not duplicate the portfolio page or full services detail.
- Work lives on `/portfolio`, not on the homepage.
- About lives on `/portfolio`, not as a top-level homepage section.
- FAQ lives on the homepage and is the primary linked FAQ surface.
- Module detail lives on `/services`; the homepage shows only a teaser and sends users to `/services`.
- The homepage bottom CTA is now a higher-intent request step: "Start a Website Request" -> `/checkout`.
- The module bundle discount is supported by `/checkout`, which now serves every offer (audit, modules, full build, recurring) as a request flow rather than a payment checkout.
- Public stage pages live at `/next-steps/audit`, `/next-steps/scope`, `/next-steps/build`, and `/next-steps/launch` for clients who want a plain-English read of where they are in the process.
- Module canonical IDs are now `content-architecture`, `visual-redesign`, `booking-flow`, `animation-premium`, `service-page-expansion`, `mobile-speed-cleanup`. Marketing display names match `MODULE_OFFERS` in `src/data/offers.ts`. AI-readiness is positioned as an additive layer inside relevant modules, not a rebrand of the company.
- Client stage pages use the four-step flow: Audit, Scope & recommend, Build or upgrade, Launch + handover.
- The AI-readiness layer should appear in the hero, the discovery section, the audit page, and the modules section. It should not appear in the recurring plans, the portfolio page, or the FAQ in a heavy way.
- Tone check before publishing: read every section out loud. Cut anything that sounds like AI agency hype, generic SEO talk, or template-builder marketing.
