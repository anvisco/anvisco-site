# Live Launch

## Cloudflare Pages

- Set the frontend env vars in Cloudflare Pages.
- Verify the deployed build has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Confirm `public/_redirects` still routes `/* /index.html 200`.

## Supabase Auth

- Allow these redirect URLs:
  - `http://localhost:5173/portal`
  - `https://anvisco.com/portal`

## Stripe live webhook

- Use the live webhook signing secret.
- Point Stripe to the deployed `stripe-webhook` function.
- Keep the webhook signature check enabled.

## Supabase live secrets

- Keep live secrets in Supabase, not in frontend env files.
- Do not copy test keys into live secrets or docs.

## Function redeploy commands

```bash
npx supabase functions deploy create-checkout-session --project-ref evvozwtspivyumboqcnu
npx supabase functions deploy stripe-webhook --project-ref evvozwtspivyumboqcnu
npx supabase functions deploy checkout-session-summary --project-ref evvozwtspivyumboqcnu
npx supabase functions deploy claim-client-profile --project-ref evvozwtspivyumboqcnu
```

## Live smoke test

1. Open the public site.
2. Click "Get Free Audit" on the homepage — confirm it opens the Google Form (https://forms.gle/2wc94jkNKUVGWnLH8) in a new tab.
3. Visit `/audit` — confirm the "Get Free Audit" CTA opens the Google Form, not Calendly.
4. Test `/checkout` with Stripe live or test mode as appropriate.
4. Confirm `/checkout/success?session_id=...` shows package-specific confirmation.
5. Confirm the webhook updates Supabase rows.
6. Confirm the welcome email sends.
7. Confirm `/portal` magic-link login connects the client by email.
8. Confirm the admin dashboard can view the client record.

## Refund and security

- Test a refund only after the live checkout path is confirmed.
- Keep secrets out of browser code and out of docs.
- Do not switch live and test keys casually.
- Confirm the webhook still verifies Stripe signatures after every redeploy.
