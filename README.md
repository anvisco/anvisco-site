# Anvisco — product-first site

Stack: Vite, React, TypeScript, Tailwind, Cloudflare Pages.
Commands: npm ci, npm run dev, npm run lint, npm run build.

## Domain architecture

- anvisco.com: new software-company site
- archive.anvisco.com: original service and portfolio site (frozen)
- nest.anvisco.com: separate personal project, untouched

Original website is preserved at Git branch archive-2026-10-08, based on commit 40df9c0. No live deployment or DNS migration is performed by this branch.

## Required migration checklist before PR merge

1. Deploy archive-2026-10-08 to Cloudflare Pages and attach archive.anvisco.com.
2. Confirm the archive works under HTTPS. Verify the existing home, /work, /portfolio and /services routes.
3. Original website contains authentication, Stripe checkout, portal and admin routes. Update relevant Supabase auth redirect URLs and Stripe return URLs if necessary, then test these flows before cutover.
4. Check preview deployment and build, mobile layouts, accessibility, and metadata.
5. Check redirect mappings in public/_redirects: 301 for moved public content; 302 for temporary operational paths. The new /services page intentionally stays on the root domain.
6. Review privacy and terms wording before publication.
7. Only after the archive is working, merge this PR. Verify old redirects, new site, and unchanged nest.anvisco.com.

The root domain remains on main until this PR is merged. Product descriptions are research concepts, not shipped claims. No new product backend, CMS, auth or payments are introduced.
