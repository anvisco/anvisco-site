# Archive candidate review

Production-source baseline: `40df9c0bb0be2ddf7ef086750461bb11769f7e9d` (`main`). Candidate branch: `codex/anvisco-archive-production-review`. Production migration remains NO-GO.

The archive notice labels the earlier services, pricing and checkout inactive. The new-site link is disabled until the separately authorized apex cutover. The previous checkout, portal, admin and follow-up routes display neutral email support without determining any payment status. The support mailbox has not been verified for receipt.

## Existing SPA fallback

`public/_redirects` remains `/* /index.html 200`. The local built preview returned HTTP 200 for `/checkout`, `/checkout/success?session_id=synthetic`, `/checkout/cancel`, `/portal`, `/portal/old`, `/admin`, `/admin/clients/123`, `/next-steps/audit`, `/thank-you`, and `/unknown-archive-page`. Retired routes render the support page; an unknown path renders “Page not found.” Both are client-rendered responses, not HTTP 404s. The wildcard configuration indicates the same shell fallback is intended for other unmatched paths, subject to the actual hosting rules and deployment verification. No routing infrastructure has been changed. Decide separately whether true 404s, explicit redirect mappings, query-string handling and indexing need remediation before release.

Provider and customer obligations remain unverified despite the owner's confirmation that old Stripe Payment Links were deactivated. Verify the mailbox, records, live and test account obligations, retention and historical external links under separate authorization before migration or provider cleanup. No payment-status conclusion follows from these pages.

## Hosting and cutover review

For a separately approved release, inventory real archive paths and test direct requests on the target host. Preserve working portfolio deep links; give unknown paths a genuine HTTP 404 where the hosting configuration supports it. For retired transactional paths, choose explicit, tested support responses or redirects that do not assert a payment outcome, and assess query strings, fragments, caching and redirect loops. Confirm the behavior and status codes in a staged production-like environment before changing routing.

A generic `404.html` alone is insufficient: the current wildcard serves the SPA shell with HTTP 200, and a hosting change that bypasses that fallback can also break valid client-side deep links. Test direct loads, reloads and navigation for both existing and unknown routes against the actual host rules.

The archive notice link is gated by `NEW_SITE_AVAILABLE = false` in `src/components/layout/ArchiveNotice.tsx`. After the new site is confirmed to serve `https://anvisco.com` and a separate release is authorized, set that flag to `true`, verify the link destination and absence of loops, then include that change in the coordinated archive release. Do not enable it while the apex still serves the legacy site.

The existing anvis-portfolio Pages project serves `anvisco.com` and `www.anvisco.com` as well as `portfolio.anvisco.com`. Do not deploy this archive candidate to its production branch before the domain cutover is coordinated and separately authorized.
