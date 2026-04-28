import { motion } from 'motion/react'
import { SectionWatermark } from './SectionWatermark'

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
    <section id="services" className="scroll-mt-16 py-24 md:py-32 border-t border-border bg-background relative overflow-hidden">
      <SectionWatermark>03</SectionWatermark>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-16 lg:gap-24">

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative border-l border-primary/35 pl-5"
          >
            <p className="mb-7 text-xs uppercase tracking-[0.22em] text-primary/85">
              What I Handle
            </p>
            <p className="text-[0.95rem] leading-6 text-foreground/80">
              Most of my work involves{' '}
              <span className="font-semibold text-foreground">simplifying complex websites</span>
              <br />
              into clearer systems,
              <br />
              <span className="text-muted-foreground">not just making them look better.</span>
            </p>
          </motion.div>

          <ul className="space-y-2">
            {services.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.05 }}
                className={`group relative -mx-3 cursor-default rounded-sm border border-border bg-card/45 px-4 py-4 pl-8 text-sm leading-relaxed shadow-[inset_0_1px_0_hsl(var(--primary)/0.08)] transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-muted/40 hover:shadow-[0_14px_34px_hsl(var(--background)/0.22)] before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-primary/55 before:opacity-80 ${
                  i % 2 === 1 ? 'lg:translate-x-2' : ''
                }`}
              >
                <span className="absolute left-3 top-[1.35rem] h-1.5 w-1.5 rounded-full border border-primary/60 bg-background transition-colors duration-150 group-hover:bg-primary/70" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  )
}
