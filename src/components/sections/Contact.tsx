import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { BracketLabel } from '@/components/ui/BracketLabel'

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
            <BracketLabel>Build your plan</BracketLabel>
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
            Ready to choose the right path for your website?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="mb-10 text-[1.125rem] leading-relaxed text-ink-muted max-w-[52ch]"
          >
            Start with a simple request. Choose whether you need an audit, targeted improvements, a full build, or ongoing support.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.18 }}
            className="flex flex-col items-start gap-6"
          >
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                to="/checkout"
                className="group inline-flex items-center gap-2.5 border-[1.5px] border-ink px-8 py-4 text-sm font-medium text-ink tracking-[-0.005em] transition-all duration-200 hover:border-amber hover:text-amber"
              >
                Build Your Plan
                <span className="text-amber transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>

              <Link
                to="/services"
                className="group relative text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
              >
                Compare Services
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px w-0 bg-amber transition-all duration-200 group-hover:w-full"
                />
              </Link>
            </div>

            <p className="mt-2 text-sm text-ink-muted">
              Questions? <a href="mailto:brian@anvisco.com" className="font-sans text-amber transition-colors hover:text-ink">brian@anvisco.com</a>
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
