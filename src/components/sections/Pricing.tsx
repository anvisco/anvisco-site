import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

const tiers = [
  {
    name: 'Essentials',
    slug: 'essentials',
    cta: 'Start Essentials',
    price: '$1,800',
    founding: 'Founding: $1,200',
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
    founding: 'Founding: $2,200',
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
    founding: 'Founding: $3,800',
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
    <section id="pricing" className="scroll-mt-16 border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="mb-14 max-w-none"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Pricing
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white md:whitespace-nowrap md:text-4xl">
            Clear scopes. Fixed timelines. No surprises.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-y-6 items-stretch border-l border-t border-border lg:grid-cols-3 lg:gap-y-0">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.08 }}
              className={`relative flex h-full flex-col border-b border-r border-border bg-background p-6 transition-colors duration-150 lg:p-8 ${
                tier.recommended
                  ? 'z-10 bg-muted/25 shadow-[0_0_44px_hsl(var(--primary)/0.08)] ring-1 ring-primary/45'
                  : 'hover:bg-muted/20'
              }`}
            >
              {tier.recommended && (
                <p className="absolute left-6 top-0 inline-flex -translate-y-1/2 rounded-sm border border-primary/40 bg-background px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary shadow-[0_0_18px_hsl(var(--background)/0.9)] lg:left-8">
                  Recommended
                </p>
              )}

              <div className="mb-7">
                <h3 className="mb-4 text-xl font-semibold text-white">{tier.name}</h3>
                <p className="mb-2 text-4xl font-bold tracking-tight text-foreground">
                  {tier.price}
                </p>
                <p className="text-sm font-medium text-primary">{tier.founding}</p>
              </div>

              <ul className="mb-8 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/70" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={`/checkout?plan=${tier.slug}`}
                className={`mt-auto flex w-full items-center justify-center rounded-md px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                  tier.recommended
                    ? 'bg-primary text-primary-foreground hover:bg-primary/85'
                    : 'border border-border bg-transparent text-white hover:bg-muted/30'
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.12 }}
          className="mt-12 max-w-3xl border-l border-border pl-5"
        >
          <p className="mb-3 text-sm font-semibold text-white">Care Plan - $149/month</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Hosting, monthly content updates (up to 2 hours), security monitoring,
            weekly backups, priority response.
          </p>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Taking on 3 clients at founding rates. Once those spots are filled, pricing returns to standard.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
