import { motion } from 'motion/react'
import { BracketLabel } from '@/components/ui/BracketLabel'

const services = [
  'Information-heavy websites (clear structure, navigation, user flow)',
  'Membership systems (pricing, onboarding, member portals)',
  'Affiliate / referral setups (tracking, payouts, dashboards)',
  'Payment flows (multiple options, checkout clarity)',
  'Integrations (APIs, perks platforms, booking tools)',
  'Event and booking systems',
  'Multi-program platforms (combining multiple offers into one site)',
  'Newsletter and email automation',
  'Companion decks aligned with web narrative',
]

export function WhatIHandle() {
  return (
    <section id="services" className="scroll-mt-16 py-24 md:py-32 bg-[var(--color-bg)]">

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-14 border-t border-[var(--color-border)] pt-7">
          <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">03</span>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <BracketLabel>What I Handle</BracketLabel>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-16 lg:gap-24">

          {/* Left: short descriptor */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-[0.95rem] leading-6 text-ink-muted">
              Most of my work involves{' '}
              <span className="font-medium text-ink">simplifying complex websites</span>
              {' '}into clearer systems,{' '}
              <span className="text-ink-subtle">not just making them look better.</span>
            </p>
          </motion.div>

          {/* Right: service list */}
          <ul className="space-y-0">
            {services.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.04 }}
                className="group flex items-baseline gap-4 border-t border-[var(--color-border)] py-4 cursor-default transition-colors duration-150 hover:text-ink"
              >
                <span className="shrink-0 text-[0.65rem] tabular-nums text-amber font-medium tracking-[0.08em]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm leading-relaxed text-ink-muted transition-colors duration-150 group-hover:text-ink">
                  {item}
                </span>
              </motion.li>
            ))}
            <li className="border-t border-[var(--color-border)]" />
          </ul>

        </div>
      </div>
    </section>
  )
}
