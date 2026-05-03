# Tech Stack

## Frontend

- Vite.
- React.
- TypeScript.
- Tailwind CSS.
- shadcn/ui where already in use.
- Cloudflare Pages hosts the frontend.
- `public/_redirects` maps `/* /index.html 200`.

## Backend

- Supabase database.
- Supabase Auth.
- Supabase Edge Functions.

## Edge Functions

- `create-checkout-session`
- `stripe-webhook`
- `checkout-session-summary`
- `claim-client-profile`

## Payments

- Stripe Checkout is the payment flow.
- Stripe webhook endpoint:
  - `https://evvozwtspivyumboqcnu.supabase.co/functions/v1/stripe-webhook`

## Email

- Supabase magic links use Resend SMTP.
- Paid-client welcome emails send through the Resend API.

## Frontend env

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Supabase secrets

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_CURRENCY`
- `SITE_URL`
- `PORTAL_URL`
- `ANVIS_SUPABASE_SECRET_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ANVIS_SUPPORT_EMAIL`

## Security rules

- No secrets in frontend env files.
- No secrets in docs.
- No service key in `VITE_` env.
- Stripe webhook must verify the signature.
- `claim-client-profile` must only link exact normalized email matches.
