# Admin Ops

## Admin dashboard

- The admin dashboard exists.
- Admin can view clients.
- Admin can view packages and payment update data.
- Admin can delete selected clients and related records.

## Delete order

1. `project_updates`
2. `payment_schedules`
3. `client_module_selections`
4. `client_packages`
5. `client_users`
6. `clients`

## Do not delete by default

- Stripe records.
- `stripe_events`.

## Client portal

- Magic-link login is the normal flow.
- The client must use the same checkout email.
- The portal auto-links auth user to client by normalized email match.
- Password setup is not the main flow.

## Troubleshooting

- If a backend warning appears on production, Cloudflare Pages may be missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY`.
- If a welcome email shows localhost, update `PORTAL_URL` and `SITE_URL` in Supabase secrets and redeploy `stripe-webhook`.
- If `claim-client-profile` returns `no_matching_client`, check the client email against the auth email and confirm the function has admin client access.
- If multiple localhost servers are running, kill the old Vite servers and use one clean port.
