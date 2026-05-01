# Checkout / plan builder flow

`/checkout` is a **plan builder**, not an instant payment page. It captures what a client wants,
runs the bundle math, and saves the chosen path to Supabase. Brian then follows up with the next
step, payment link, or setup details based on the selected path.

## Pricing source of truth

Everything pricing-related lives in `src/data/offers.ts`. That file is canonical. Marketing
pages (`src/data/modules.ts`) derive their display data from it so the homepage, services
page, and `/checkout` cannot disagree about a price.

| Offer | File reference |
| --- | --- |
| Audit (free snapshot, full audit shown on the plan builder) | `AUDIT_OFFERS` |
| Improvement modules (six modules) | `MODULE_OFFERS` |
| Full builds (Essentials, Standard, Premium - founding + public rates) | `BUILD_OFFERS` |
| Recurring (Care $149/mo, Growth $449/mo) | `RECURRING_OFFERS` |
| Bundle rule (3+ modules = 15% off) | `BUNDLE_DISCOUNT_RATE`, `BUNDLE_DISCOUNT_MIN_MODULES` |

Prices are stored as plain dollar numbers in offers. The DB stores them in cents
(`price * 100`). Conversion happens via `toCents()` in `src/lib/pricing.ts`.

## Bundle discount logic

Defined once in `src/lib/pricing.ts`:

- `hasBundleDiscount(selected)` — true when 3+ distinct modules are picked
- `calculateBundleDiscount(selected)` — 15% off the module subtotal, rounded; zero otherwise
- `calculateModuleTotal(selected)` — subtotal minus discount

Service Page Expansion is priced **per page** with a minimum of **3 pages**, enforced by
`normalizeModuleQuantity()`. Selecting it always counts as one of the three modules required for
the bundle discount.

## Module selection flow

1. User picks the **Modules** path on `/checkout`.
2. Each module is a toggle. Service Page Expansion shows a **Pages** input that clamps to the
   minimum (3).
3. Subtotal updates in the right-hand summary as modules are toggled.
4. When the third distinct module is selected, the **Bundle discount** row flips from
   `Select 3+` to `-$X` and the total drops by 15%.
5. The DB stores per-module rows in `client_module_selections` with `unit_price_cents`,
   `quantity`, and `total_cents`.

## Full-build founding vs. public rate

Each build tier has both a founding rate and a public rate. The founding rate is displayed as
the primary number; the public rate is shown for reference. The summary always reports the
founding rate, since that is what current scope-confirmed clients pay. When founding slots run
out, swap the displayed price source by editing the build cards (or remove the founding rate
field entirely in `offers.ts`).

A 50% deposit row is created in `payment_schedules` automatically on full-build requests.

## Recurring (Care / Growth)

Recurring is a request rather than a checkout. The submission saves a `client_package` with
`package_type = 'recurring'` and `recurring_amount_cents` set. No `payment_schedule` row is
created, since the subscription is set up by Brian via Stripe in a follow-up.

## How requests are saved

On submit, `/checkout`:

1. Inserts a row in `clients` with `status = 'lead'`.
2. Inserts a row in `client_packages` with the chosen `package_type`, the calculated cents
   amounts, and `status = 'requested'`.
3. For modules: inserts one row per selection in `client_module_selections`.
4. For audit / modules / build: inserts a `payment_schedules` row with
   `status = 'not_started'`. Build deposit is 50%.
5. Redirects to `/checkout/success`.

If any insert fails (RLS, network, constraint), the page surfaces the error in the summary and
keeps the form filled in.

## Client portal handoff

After a plan is created, an admin can connect a Supabase Auth user to that client by inserting a
row into `client_users`.

Once the mapping exists, the client signs into `/portal` to see:

- their active package
- next payment
- stage and visible updates
- support contact details

## What happens if Supabase is not configured

`isSupabaseConfigured` is `false` and `supabase` is `null` when env vars are missing. Submitting
on `/checkout` shows: `Backend is not connected yet. Add Supabase env vars to save requests.`

The page still renders, all math still runs, and nothing crashes. `/admin` and `/portal` show
a similar "setup required" panel.

## Limitations of v1

- **No real payments** at submission time. Brian sends a hosted Stripe link or invoice manually.
- **No emails** are sent. Email sending wires up in a later pass via Resend or Postmark.
- **`anon` insert path** — `/checkout` writes as the unauthenticated user. RLS lets it through
  for `clients`, `client_packages`, `client_module_selections`, and `payment_schedules`. If you
  tighten policies, route submissions through a Supabase Edge Function instead.
- **No idempotency.** Double-clicking the submit button can create duplicate requests. Pass 2
  fix.
- **No anti-spam.** A future pass should add a honeypot or hCaptcha.
- **Audit credit tracking** for the $250 → module/build credit is not yet enforced — Brian
  applies it manually when issuing the next invoice.
