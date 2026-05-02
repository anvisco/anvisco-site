# Backend setup

This is the shared backend foundation for the Anvis site, admin system, and authenticated client
portal. It includes the Supabase schema, request flow at `/checkout`, the admin portal, and the
real authenticated `/portal` client view.

## What this backend includes

- Supabase schema for clients, packages, payments, project updates, emails (with RLS)
- Source-of-truth offer/pricing data in `src/data/offers.ts`
- Bundle discount logic (`3+ modules = 15% off`) in `src/lib/pricing.ts`
- `/checkout` request flow that saves to Supabase when configured, and shows a clear message when not
- `/checkout/success` confirmation page
- `/admin` and `/portal` routes
- `/next-steps/{audit,scope,build,launch}` public stage pages
- Supabase Edge Functions for Stripe Checkout Sessions and webhook processing
- `checkout-session-summary` Edge Function for the post-payment confirmation page
- `claim-client-profile` Edge Function for secure email-based portal linking
- TypeScript types in `src/types/backend.ts`

## What is intentionally not included

- Admin login, dashboard, and CRUD UI
- Real Stripe integration (Checkout Sessions / subscriptions / webhooks)
- Real email sending (Resend/Postmark wiring)
- Server functions / Edge Functions
- Audit / module credit tracking

These all hang off the schema and data layer that the backend establishes.

---

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Pick a region close to you (Toronto users: `ca-central-1`).
3. Save the database password somewhere safe (you only need it for direct DB access).

## 2. Get the env values

In the Supabase dashboard, **Settings → API**:

- `Project URL` → `VITE_SUPABASE_URL`
- `Project API keys → anon public` → `VITE_SUPABASE_ANON_KEY`

The anon key is safe in the browser - RLS protects data.

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_SITE_URL=http://localhost:5173
ANVIS_SUPABASE_SECRET_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CURRENCY=cad
SITE_URL=http://localhost:5173
```

`.env.local` is gitignored. Never commit it.

## 2b. Configure Supabase secrets for Edge Functions

Store server-only values with the Supabase CLI so they are available to Edge Functions but never
shipped to the browser:

```bash
supabase secrets set \
  ANVIS_SUPABASE_SECRET_KEY=... \
  STRIPE_SECRET_KEY=... \
  STRIPE_WEBHOOK_SECRET=... \
  STRIPE_CURRENCY=cad \
  SITE_URL=http://localhost:5173
```

Never prefix these with `VITE_`.

`SITE_URL` is the server-side base URL used by the checkout Edge Function for Stripe
`success_url` and `cancel_url`. Frontend `VITE_` variables are not available inside Edge Functions
unless you pass them explicitly as Supabase secrets.

## 2c. Configure Supabase Auth redirect URLs

Supabase Auth must allow the browser to return to the portal login page after magic links:

- `http://localhost:5173/portal`
- `https://anvisco.com/portal`

These URLs are required for the client portal login flow.

## 2d. Supabase Auth email delivery notes

Supabase's default Auth email sender is rate-limited and intended for testing. This project uses a
custom SMTP provider in Supabase with Resend for production portal login emails, so magic links
are not throttled during normal use.

Paid-client welcome emails are separate from Supabase Auth. They are sent from the
`stripe-webhook` Edge Function through the Resend API after a successful Stripe checkout event.
Those emails use the following Supabase secrets:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ANVIS_SUPPORT_EMAIL`
- `PORTAL_URL`

## 3. Run the migration

Pick one:

### Option A - Supabase SQL editor (fastest)

1. Open the Supabase dashboard → **SQL Editor → New query**.
2. Paste the contents of `supabase/migrations/001_initial_anvisco_backend.sql`.
3. Click **Run**.

### Option B - Supabase CLI

If you have the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

After it runs, you should see these tables in **Database → Tables**:
`profiles, clients, client_users, client_packages, client_module_selections,
payment_schedules, project_updates, email_logs, email_templates`.

All have RLS enabled.

## 4. Create the first admin profile

Until admin auth lands in the admin portal, you bootstrap the first admin manually.

1. **Authentication → Users → Add user → Send invite** (use your real email).
2. Click the invite link in your inbox to set a password and confirm the user.
3. **SQL Editor → New query**, then run (replace the email):

```sql
insert into public.profiles (id, email, role)
select id, email, 'admin'
from auth.users
where email = 'brian@anvisco.com'
on conflict (id) do update set role = 'admin';
```

Verify: `select * from public.profiles where role = 'admin';` should return one row.

`is_admin()` will now return `true` for that user. All admin-scoped policies key off
`is_admin()`.

## 5. Local development

```bash
npm install
npm run dev
```

- `/checkout` renders. Submitting a request without env vars shows a clear "backend not connected"
  message and doesn't crash.
- With env vars filled in, submitting creates rows in `clients`, `client_packages`, optional
  `client_module_selections`, and a `payment_schedules` row, then redirects to `/checkout/success`.

## 6. Payments

Stripe Checkout Sessions are created server-side by the `create-checkout-session` Edge Function.
The frontend only sends the selected path and client details; the function recalculates pricing
from trusted data before it talks to Stripe.

- Audits, module bundles, build deposits, and recurring plans all use Stripe-hosted Checkout.
- No card data is stored on this site.
- Stripe secret keys stay in Edge Function secrets and are never exposed to the browser.
- Manual `payment_url` fallback is still supported in the admin portal when needed.
- Stripe webhook processing updates payment and package status after Checkout completes.
- `/checkout/success` loads `session_id` and uses the summary function to show package-specific
  confirmation details.

## 6b. Deploy Stripe Edge Functions

Deploy both functions after setting secrets:

```bash
npx supabase functions deploy create-checkout-session --project-ref evvozwtspivyumboqcnu
npx supabase functions deploy stripe-webhook --project-ref evvozwtspivyumboqcnu
npx supabase functions deploy checkout-session-summary --project-ref evvozwtspivyumboqcnu
```

If JWT verification is still blocking the requests, force the deploy without it:

```bash
npx supabase functions deploy create-checkout-session --no-verify-jwt --project-ref evvozwtspivyumboqcnu
npx supabase functions deploy stripe-webhook --no-verify-jwt --project-ref evvozwtspivyumboqcnu
npx supabase functions deploy checkout-session-summary --no-verify-jwt --project-ref evvozwtspivyumboqcnu
```

The repo ships `supabase/config.toml` with:

```toml
[functions.create-checkout-session]
verify_jwt = false

[functions.stripe-webhook]
verify_jwt = false

[functions.checkout-session-summary]
verify_jwt = false
```

That is expected. Checkout session creation and Stripe webhook delivery must be reachable without
Supabase platform JWT enforcement, and the functions protect themselves with server-side secrets,
server-side pricing, validation, and Stripe signature checks.

The success-page summary function must also stay public because the browser calls it after Stripe
redirects back with the `session_id` query param.

The `stripe-webhook` function also sends a paid-client welcome email through Resend API after a
successful checkout payment. If that send fails, payment processing still succeeds and the webhook
does not roll back the payment updates.

In Stripe, point the webhook endpoint at the deployed `stripe-webhook` function URL and listen for:

- `checkout.session.completed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Use Stripe test mode while verifying the flow.

## 7. Admin portal

### Accessing `/admin`

Navigate to `/admin` in the browser. The portal:

- Shows a setup message if `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are missing.
- Shows a login form if Supabase is configured but no session exists.
- Shows "Not authorized" if the user's profile row does not have `role = 'admin'`.
- Shows the full dashboard once authenticated as admin.

### Creating the first admin user

The first admin must be bootstrapped manually in Supabase. See **step 4** above. The SQL snippet
creates the `profiles` row with `role = 'admin'`.

After that you can log in at `/admin` with the email/password you set for that user.

### What the admin portal can do now

| Area | Capability |
|---|---|
| Dashboard | Summary cards: total leads, active clients, overdue payments, due in 30 days, active builds |
| Clients table | Lists all clients with business name, email, status, active package, next payment |
| Add client | Modal form: name, business, email, phone, website URL, status, notes → inserts into `clients` |
| Test Data Cleanup | Preview and delete matching test records by client email through the admin UI |
| Client detail — Overview | View and edit all client fields; saves to Supabase |
| Client detail — Package | View active package (subtotal, discount, total, recurring, modules); edit status, payment URL, next payment due |
| Client detail — Payments | List payment schedules; add new; mark paid / overdue / reset; edit payment URL per payment |
| Client detail — Stage & Updates | Add project updates with stage, title, body, visible-to-client toggle; lists all updates |
| Client detail — Emails | Compose email drafts saved to `email_logs`; lists all logged emails |

### What is still manual or not yet built

- **Email sending:** The email compose form saves a draft to `email_logs` only. No emails are
  actually sent yet.
- **Audit credit tracking:** Not yet enforced automatically.

### RLS notes

All admin reads/writes go through Supabase RLS. The `is_admin()` helper in the schema gates all
admin-scoped policies. If an operation returns an RLS error, the admin UI surfaces the error
message clearly — check that the user's `profiles.role = 'admin'` row exists.

### Safe cleanup workflow

The admin cleanup tool is intentionally narrow:

1. Enter the exact client email.
2. Preview the matching records.
3. Confirm the deletion checkbox.
4. Delete only the records tied to that email.

The cleanup flow deletes `project_updates`, `payment_schedules`, `client_module_selections`,
`client_packages`, `client_users`, and then `clients`. Stripe test events are left alone unless a
future maintenance pass adds a separate, audited cleanup path for them.

### SQL Editor note

Saved queries in the Supabase SQL Editor can be deleted if they are only temporary test or debug
snippets. Do not delete migration files in `supabase/migrations`, and do not delete tables or
data unless you are intentionally using the admin cleanup workflow.

## 8. Client portal

- `/portal` is authenticated with Supabase Auth using magic-link login.
- `/portal` is the official client login directory and login entry point.
- Clients enter the same email they used at checkout and receive a secure login link.
- Email ownership is the verification step. Supabase can create the auth user during magic-link
  login if the email does not already exist in `auth.users`.
- After login, the portal can automatically link the signed-in auth user to a `clients` row when
  the authenticated email matches `clients.email`.
- That claim flow runs through the `claim-client-profile` Edge Function and inserts into
  `client_users` server-side with the service secret.
- The portal looks up the signed-in user in `client_users` using `auth.uid()`.
- That mapping resolves the related client record, then loads only that client’s packages,
  module selections, payment schedules, and client-visible project updates.
- If a login has not been mapped yet, the portal shows a clean connection-pending state until the
  matching email is connected.
- `/set-password` is not part of the primary client portal flow. Keep it only as an internal
  fallback if you still need a manual support reset path.
- If Supabase env vars are missing, the portal shows a setup message instead of crashing.
- The portal never exposes other clients, email logs, or internal-only updates.

Welcome emails are sent only after Stripe confirms payment. The webhook uses the Resend API and
the `client_packages.welcome_email_sent_at` column to avoid duplicate messages on webhook retries.

Manual inserts into `client_users` are only needed for special cases, such as an email mismatch or
an intentionally hand-managed client record. Normal portal signup should self-link by email match
through `claim-client-profile`.

## 9. What still needs to be built

- Real email sending (Resend/Postmark)
- Audit credit tracking automation
- File delivery for audits
- Subscription lifecycle automations and analytics

## Troubleshooting

- **"Backend is not connected" on `/checkout` or `/portal`:** env vars are missing. Add them to
  `.env.local` and restart `npm run dev`.
- **Stripe Checkout or webhook failing:** confirm the Edge Function secrets are set with
  `supabase secrets set`, that `verify_jwt = false` is present for both functions, and that Stripe
  is pointing to the webhook endpoint documented below. Also confirm `SITE_URL` is set as a
  Supabase secret; Edge Functions do not read `VITE_SITE_URL` from the browser env.
- **Portal stays on Connection pending:** confirm the user used the same email as checkout, and
  deploy the `claim-client-profile` Edge Function so the portal can auto-link by email.
- **`new row violates row-level security` when inserting a client:** the `clients` insert path is
  expected to be done by the public `/checkout` flow. The anon user inserts those rows. If you
  added a stricter policy, also add a policy that lets `anon` insert into `clients` and
  `client_packages` (or wire submission through a Supabase Edge Function).
- **`is_admin()` returns false:** the profile row is missing or its `role` is not `'admin'`. Re-run
  the SQL in step 4.
