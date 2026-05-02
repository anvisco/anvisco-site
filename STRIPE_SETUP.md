# Stripe setup

This project uses Stripe-hosted Checkout Sessions created in Supabase Edge Functions. The browser
never sees the Stripe secret key.

## 1. Create or open your Stripe account

1. Use Stripe test mode while developing.
2. Keep a separate live secret for production.

## 2. Add Supabase Edge Function secrets

Set these in Supabase, not in frontend env files:

```bash
supabase secrets set \
  ANVIS_SUPABASE_SECRET_KEY=... \
  STRIPE_SECRET_KEY=... \
  STRIPE_WEBHOOK_SECRET=... \
  STRIPE_CURRENCY=cad \
  SITE_URL=http://localhost:5173
```

For production later, set `SITE_URL=https://anvisco.com`.

## 3. Deploy the Edge Functions

Deploy the Edge Functions:

```bash
npx supabase functions deploy create-checkout-session --project-ref evvozwtspivyumboqcnu
npx supabase functions deploy stripe-webhook --project-ref evvozwtspivyumboqcnu
npx supabase functions deploy checkout-session-summary --project-ref evvozwtspivyumboqcnu
npx supabase functions deploy claim-client-profile --project-ref evvozwtspivyumboqcnu
```

If Supabase still reports `UNAUTHORIZED_NO_AUTH_HEADER`, force the deploy without JWT verification:

```bash
npx supabase functions deploy create-checkout-session --no-verify-jwt --project-ref evvozwtspivyumboqcnu
npx supabase functions deploy stripe-webhook --no-verify-jwt --project-ref evvozwtspivyumboqcnu
npx supabase functions deploy checkout-session-summary --no-verify-jwt --project-ref evvozwtspivyumboqcnu
npx supabase functions deploy claim-client-profile --no-verify-jwt --project-ref evvozwtspivyumboqcnu
```

These functions are intentionally configured with `verify_jwt = false` in `supabase/config.toml`.
That is required because Stripe webhooks and the browser preflight for checkout must reach the
Edge Function without Supabase platform JWT blocking the request first. The portal claim function
also uses `verify_jwt = false`, then verifies the logged-in Supabase user token itself before
creating any `client_users` link.

Supabase Auth magic-link emails are separate from Stripe. The default Supabase sender is
rate-limited for testing, so production uses custom SMTP in Supabase with Resend for portal login
links.

Paid-client welcome emails are sent from the `stripe-webhook` Edge Function through the Resend
API after Stripe confirms a successful checkout payment. That flow requires these Supabase
secrets:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ANVIS_SUPPORT_EMAIL`
- `PORTAL_URL`

Edge Functions do not automatically read frontend `.env.local` `VITE_` variables. If a function
needs a base URL for `success_url` / `cancel_url`, set it as the `SITE_URL` Supabase secret.
The `claim-client-profile` function also uses `ANVIS_SUPABASE_SECRET_KEY` server-side to look up
and insert the matching client link safely.

The webhook welcome-email send is best-effort. If Resend returns an error, the payment update
still commits and the webhook returns success after logging the failure safely.

The checkout function now returns Stripe to:

`/checkout/success?session_id={CHECKOUT_SESSION_ID}`

That session id is required so the success page can show package-specific confirmation.

## 4. Configure the Stripe webhook endpoint

Point Stripe to the deployed Supabase function URL for `stripe-webhook`.

Listen for these events:

- `checkout.session.completed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## 5. Test the checkout flow

1. Open `/checkout`.
2. Pick a paid path.
3. Submit the plan.
4. Confirm the browser redirects to Stripe Checkout.

5. Confirm `/checkout/success` loads package details using the new `checkout-session-summary`
   Edge Function.

## Debugging the deployed function

After deploy, test:

`https://evvozwtspivyumboqcnu.supabase.co/functions/v1/create-checkout-session`

Expected:

```json
{ "ok": true, "function": "create-checkout-session", "cors": true, "jwt": "disabled-required" }
```

If it returns:

`UNAUTHORIZED_NO_AUTH_HEADER`

then JWT verification is still enabled. Redeploy with:

```bash
npx supabase functions deploy create-checkout-session --no-verify-jwt --project-ref evvozwtspivyumboqcnu
```

If the response is a `500` with `SITE_URL function secret is missing.`, add the secret with:

```bash
npx supabase secrets set SITE_URL=http://localhost:5173
```

## 6. Test the webhook

1. Use Stripe test mode.
2. Complete a test Checkout Session.
3. Confirm `payment_schedules` and `client_packages` update in Supabase.

## 7. Verify status updates

- One-time payments should move the linked payment schedule to `paid`.
- Recurring plans should update the package status and next payment due date.
- Admin and client portal views should reflect the webhook-updated records.

## Safety notes

- Never expose `STRIPE_SECRET_KEY` to browser code.
- Webhook signature verification must use the raw request body.
- Do not mark payments paid from frontend redirects.
- Security is enforced server-side with Supabase secrets, server-side pricing, request validation,
  and Stripe signature verification.
