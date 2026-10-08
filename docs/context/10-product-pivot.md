# Anvisco product-first migration — October 8, 2026

Decision: move Anvisco's original client-service website, unchanged, to archive.anvisco.com; rebuild anvisco.com around self-service software tools. NEST remains separate at nest.anvisco.com and is not an Anvisco product.

Website direction: Small tools for the AI-native web.

Product pages reflect current maturity. Feed Doctor is a research concept. Do not claim availability, customer adoption, OpenAI approval or finished functionality. The site should remain useful and credible without a product launch.

Implementation: retain Vite / React / TypeScript / Tailwind / Cloudflare Pages. Preserve archive branch at the original main commit. Develop the new root website in a separate branch and merge only after archive deployment, DNS and old auth/checkout/portal verification.

SEO: use page-specific redirects for /work, /portfolio, /faq, /audit. Review how currently indexed service URLs should be handled. Do not redirect every route to home. Update Search Console and sitemap after cutover.

Legal: entity/jurisdiction not yet confirmed. Review draft privacy and terms text before publication.

No work is to be done on NEST.
