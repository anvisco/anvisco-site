# Workflow

## Current client flow

1. The user visits the public site.
2. CTA routes are:
   - `Get Free Audit` / `Free Snapshot` -> `https://forms.gle/2wc94jkNKUVGWnLH8` (Google Form, opens in new tab)
   - `Discovery call` / `Book a call` -> Calendly (https://calendly.com/nducanhnguyenn/15-minute-discovery-call)
   - offers and build paths -> `/checkout`
   - `Client Login` -> `/portal`
3. The user selects an offer in `/checkout`.
4. Stripe Checkout handles payment.
5. Stripe redirects to `/checkout/success?session_id=...`.
6. `checkout-session-summary` returns a safe, package-specific confirmation.
7. `stripe-webhook` verifies the Stripe signature.
8. Supabase updates:
   - `clients`
   - `client_packages`
   - `payment_schedules`
   - `client_module_selections` when relevant
   - `stripe_events`
   - `welcome_email_sent_at`
9. The webhook sends the paid-client welcome email through the Resend API.
10. The client goes to `/portal`.
11. The client enters the same email used at checkout.
12. Supabase magic-link login authenticates the user.
13. `claim-client-profile` verifies the JWT and links auth user to client only when normalized emails match.
14. The portal loads package, stage, payment, and update data.
15. Admin can view and delete clients plus related test and project records.

## What is no longer true

- No URL-based static portal flow.
- No `/portal?plan=...&stage=...` flow.
- No Stripe Payment Links as the primary path.
- No manual project page links for clients.
- No "no backend", "no database", "no auth", or "no admin" statements.

## Portal rule

- The checkout email and the auth email must match after normalization.
- If the portal does not connect, the first thing to check is email mismatch.
