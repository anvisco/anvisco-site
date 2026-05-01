# Checkout / Stripe flow

`/checkout` is a **plan builder**, not a custom payment form. It captures what a client wants,
runs the bundle math in the UI, and then hands the selected path to a Supabase Edge Function that
creates a Stripe-hosted Checkout Session with trusted server-side pricing.

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

Recurring uses Stripe Checkout in subscription mode. The submission still saves a
`client_package` with `package_type = 'recurring'` and `recurring_amount_cents` set, and the
Edge Function creates the hosted subscription session server-side.

## Stripe session flow

On submit, `/checkout`:

1. Sends the selected path and client details to the `create-checkout-session` Edge Function.
2. The function recalculates the final subtotal, bundle discount, and charge amount server-side.
3. The function creates or updates the client, package, module selections, and payment schedule.
4. The function creates a Stripe Checkout Session and returns the hosted `session.url`.
5. Stripe returns the browser to `/checkout/success?session_id={CHECKOUT_SESSION_ID}`.
6. The browser shows package-specific confirmation details after it loads the summary function.

`create-checkout-session` must be deployed with `verify_jwt = false` so the browser preflight can
reach the Edge Function without Supabase platform auth blocking it first.

The function also expects a server-side `SITE_URL` secret for Stripe `success_url` and
`cancel_url`. Frontend `VITE_` env vars are not read inside Edge Functions unless they are passed
through as Supabase secrets.

## Supabase Auth redirects

Supabase Auth must allow password setup and portal login redirects to these URLs:

- `http://localhost:5173/set-password`
- `https://anvisco.com/set-password`
- `http://localhost:5173/portal`
- `https://anvisco.com/portal`

Those redirects are required for the client password setup flow and the client portal login
flow.

`/checkout/success` calls the `checkout-session-summary` Edge Function with the Stripe
`session_id` query param. That function returns only safe confirmation data for the success page.

If Stripe or Supabase returns an error, the page surfaces the message in the summary and keeps
the form filled in.

## Client portal handoff

After a plan is created, an admin can connect a Supabase Auth user to that client by inserting a
row into `client_users`.

Once the mapping exists, the client signs into `/portal` to see:

- their active package
- next payment
- stage and visible updates
- support contact details

`/portal` is the official client login page, uses email/password authentication, and should be
linked from the success page as the primary post-payment destination for returning clients.
New clients use the password setup link on `/portal` to reach `/set-password` and create their
password securely through Supabase email recovery. After login, the portal calls
`claim-client-profile` to link the signed-in auth user to the matching `clients.email` value if it
finds one.

That means the checkout email and the auth email must match exactly. If they do not match, the
portal stays in the pending state until an admin connects the record manually.

## Manual fallback

Admin can still set a `payment_url` manually on a package or payment schedule when a hosted
Stripe link or another payment path is needed.

## What happens if Supabase is not configured

`isSupabaseConfigured` is `false` and `supabase` is `null` when env vars are missing. Submitting
on `/checkout` shows: `Backend is not connected yet. Add Supabase env vars to save requests.`

The page still renders, all math still runs, and nothing crashes. `/admin` and `/portal` show
a similar "setup required" panel.

## Limitations of v1

- **No card data** is ever stored on this site. Stripe-hosted Checkout handles payment capture.
- **No emails** are sent. Email sending wires up in a later pass via Resend or Postmark.
- **Stripe webhooks** update payment status after Checkout completes. The frontend never marks a
  payment paid on redirect.
- **Stripe webhooks require `verify_jwt = false`.** Stripe does not send Supabase JWT headers, so
  the platform must allow the request through to the function for signature verification.
- **No anti-spam.** A future pass should add a honeypot or hCaptcha.
