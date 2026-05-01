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
  STRIPE_CURRENCY=usd
```

## 3. Deploy the Edge Functions

Deploy both functions:

```bash
npx supabase functions deploy create-checkout-session --project-ref evvozwtspivyumboqcnu
npx supabase functions deploy stripe-webhook --project-ref evvozwtspivyumboqcnu
```

If Supabase still reports `UNAUTHORIZED_NO_AUTH_HEADER`, force the deploy without JWT verification:

```bash
npx supabase functions deploy create-checkout-session --no-verify-jwt --project-ref evvozwtspivyumboqcnu
npx supabase functions deploy stripe-webhook --no-verify-jwt --project-ref evvozwtspivyumboqcnu
```

These functions are intentionally configured with `verify_jwt = false` in `supabase/config.toml`.
That is required because Stripe webhooks and the browser preflight for checkout must reach the
Edge Function without Supabase platform JWT blocking the request first.

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
