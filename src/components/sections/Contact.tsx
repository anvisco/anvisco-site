import { motion } from 'motion/react'
import { BracketLabel } from '@/components/ui/BracketLabel'

const CALENDLY = 'https://calendly.com/nducanhnguyenn/15-minute-discovery-call'
const EMAIL = 'brian@anvisco.com'

export function Contact() {
  return (
    <section
      id="contact"
      className="py-24 md:py-32 bg-[var(--color-bg)]"
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-14 border-t border-[var(--color-border)] pt-7">
          <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">07</span>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <BracketLabel>Book a call</BracketLabel>
          </motion.div>
        </div>

        <div className="max-w-2xl border-r border-[var(--color-border)] pr-8 max-sm:border-r-0 max-sm:pr-0">

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-[2.5rem] md:text-[3rem] font-medium tracking-[-0.03em] leading-[1.05] mb-6 text-ink"
          >
            Got a website that is not pulling its weight?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="mb-10 text-[1.125rem] leading-relaxed text-ink-muted max-w-[52ch]"
          >
            Book a 15-minute call. I will review your site before we speak and
            walk you through the three most important things I would fix.
            Consider it a free consult designed to give you clarity upfront.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.18 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            {/* Primary outlined CTA */}
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 border-[1.5px] border-ink px-8 py-4 text-sm font-medium text-ink tracking-[-0.005em] transition-all duration-200 hover:border-amber hover:text-amber"
            >
              Book a 15-minute call
              <span className="text-amber transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>

            {/* Email — serif italic editorial touch */}
            <a
              href={`mailto:${EMAIL}`}
              className="text-sm transition-colors duration-150 hover:text-amber"
              style={{
                fontFamily: '"Instrument Serif", Georgia, serif',
                fontStyle: 'italic',
                color: 'var(--color-ink-muted)',
              }}
            >
              {EMAIL}
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
