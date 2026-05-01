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
  SUPABASE_SERVICE_ROLE_KEY=... \
  STRIPE_SECRET_KEY=... \
  STRIPE_WEBHOOK_SECRET=... \
  STRIPE_CURRENCY=usd
```

## 3. Deploy the Edge Functions

Deploy both functions:

```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

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
