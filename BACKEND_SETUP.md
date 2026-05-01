# Backend setup (Pass 1)

This is the Pass 1 foundation for the Anvisco backend and client portal. It is intentionally
small: a Supabase schema, a request-flow `/checkout`, and stub routes for `/admin` and `/portal`.
Real auth, admin UI, and full Stripe wiring land in later passes.

## What Pass 1 includes

- Supabase schema for clients, packages, payments, project updates, emails (with RLS)
- Source-of-truth offer/pricing data in `src/data/offers.ts`
- Bundle discount logic (`3+ modules = 15% off`) in `src/lib/pricing.ts`
- `/checkout` request flow that saves to Supabase when configured, and shows a clear message when not
- `/checkout/success` confirmation page
- `/admin` and `/portal` stubs (route + safe placeholder UI)
- `/next-steps/{audit,scope,build,launch}` public stage pages
- TypeScript types in `src/types/backend.ts`

## What is intentionally NOT in Pass 1

- Admin login, dashboard, and CRUD UI
- Client portal login and live data binding
- Real Stripe integration (Payment Links / subscriptions / webhooks)
- Real email sending (Resend/Postmark wiring)
- Server functions / Edge Functions
- Audit / module credit tracking

These all hang off the schema and data layer that Pass 1 establishes.

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
```

`.env.local` is gitignored. Never commit it.

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

Until admin auth lands in Pass 2, you bootstrap the first admin manually.

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

## 6. Payments in v1

Payments are **manual / Stripe-hosted**:

- Brian receives the request, confirms scope, and creates a Stripe Payment Link or invoice
  (or sends an e-transfer detail) by email.
- The hosted link's URL gets pasted into `client_packages.payment_url` and/or
  `payment_schedules.payment_url` from the admin UI (Pass 2) or directly in Supabase.
- **No card data is ever stored on this site.** Only Stripe customer/subscription IDs are
  stored, for reference.

The optional `VITE_STRIPE_PAYMENT_LINK_*` env vars exist for a future pass that links
straight from `/checkout` to a hosted Payment Link for canned offers (audit, three build tiers).

## 7. What still needs to be built

- **Pass 2:** admin login, admin dashboard for clients/packages/payments/updates, client portal
  login + live data, basic email composer that writes to `email_logs`.
- **Pass 3:** real Stripe webhooks → `payment_schedules.status`, real email sending via Resend or
  Postmark, audit-credit tracking, file delivery for audits.
- **Pass 4:** subscription billing, churn/lifecycle automations, analytics on `package_type` mix.

## Troubleshooting

- **"Backend is not connected" on /checkout:** env vars are missing. Add them to `.env.local` and
  restart `npm run dev`.
- **`new row violates row-level security` when inserting a client:** the `clients` insert path is
  expected to be done by the public `/checkout` flow. Pass 1 inserts as the anon user. If you
  added a stricter policy, also add a policy that lets `anon` insert into `clients` and
  `client_packages` (or wire submission through a Supabase Edge Function in Pass 2).
- **`is_admin()` returns false:** the profile row is missing or its `role` is not `'admin'`. Re-run
  the SQL in step 4.
