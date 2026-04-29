import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { BracketLabel } from '@/components/ui/BracketLabel'

const tiers = [
  {
    name: 'Essentials',
    slug: 'essentials',
    cta: 'Start Essentials',
    price: '$1,800',
    priceLabel: 'CAD',
    founding: '$1,200',
    features: [
      'Up to 5 pages',
      'Mobile-optimized',
      'Contact form',
      'Basic on-page SEO',
      'Google Business setup',
      '7-day delivery',
    ],
  },
  {
    name: 'Standard',
    slug: 'standard',
    cta: 'Start Standard',
    price: '$3,200',
    priceLabel: 'CAD',
    founding: '$2,200',
    recommended: true,
    features: [
      'Up to 10 pages',
      'Online booking integration',
      '1 additional language',
      'Image refresh',
      'On-page SEO',
      'Google Business optimization',
      '10-day delivery',
    ],
  },
  {
    name: 'Premium',
    slug: 'premium',
    cta: 'Start Premium',
    price: '$5,500',
    priceLabel: 'CAD',
    founding: '$3,800',
    features: [
      'Everything in Standard',
      'Custom features (insurance verification flow, member portal, API integration)',
      '2 additional languages',
      'First month of care plan included',
      '14-day delivery',
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16 py-24 md:py-32 bg-[var(--color-bg)]">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-12">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-16 border-t border-[var(--color-border)] pt-7">
          <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">05</span>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <BracketLabel>Pricing</BracketLabel>
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-14 text-[2.5rem] font-medium tracking-[-0.02em] text-ink leading-[1.1] max-w-xl"
        >
          Clear scopes. Fixed timelines. No surprises.
        </motion.h2>

        {/* Three-column editorial grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-[var(--color-border)]">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.08 }}
              className={`relative flex flex-col pt-8 pb-10 px-0 lg:px-8 border-b border-[var(--color-border)] lg:border-r lg:border-b-0 ${
                index === 0 ? 'lg:pl-0' : ''
              }`}
            >
              {/* Recommended label — top right, amber bracket style */}
              {tier.recommended && (
                <div className="absolute top-8 right-0 lg:right-8">
                  <BracketLabel>recommended</BracketLabel>
                </div>
              )}

              {/* Tier name */}
              <p className="text-sm font-medium text-ink mb-6 tracking-[-0.005em]">
                {tier.name}
              </p>

              {/* Price block */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[2.5rem] font-medium tracking-[-0.03em] text-amber tabular-nums">
                    {tier.founding}
                  </span>
                  <span className="text-sm text-ink-muted">{tier.priceLabel}</span>
                </div>
                <p className="text-sm text-ink-subtle">
                  <span className="line-through">{tier.price}</span>
                  {' '}
                  <span className="text-[0.7rem] tracking-[0.08em] uppercase">founding rate</span>
                </p>
              </div>

              {/* Features list */}
              <ul className="mb-8 space-y-3 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-[var(--color-border-strong)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA — outlined style matching hero */}
              <Link
                to={`/checkout?plan=${tier.slug}`}
                className="group mt-auto inline-flex items-center gap-2.5 border border-[var(--color-border-strong)] px-5 py-3 text-[0.7rem] tracking-[0.1em] uppercase text-ink font-medium transition-all duration-200 hover:border-amber hover:text-amber w-fit"
              >
                {tier.cta}
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Care plan footnote */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.12 }}
          className="mt-12 pl-5 border-l border-[var(--color-border)]"
        >
          <p className="mb-3 text-sm font-medium text-ink">Care Plan — $149/month</p>
          <p className="text-sm leading-relaxed text-ink-muted max-w-2xl">
            Hosting, monthly content updates (up to 2 hours), security monitoring,
            weekly backups, priority response.
          </p>
          <p className="mt-6 text-[0.7rem] leading-relaxed text-ink-subtle uppercase tracking-[0.08em]">
            Taking on 3 clients at founding rates. Once those spots are filled, pricing returns to standard.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
