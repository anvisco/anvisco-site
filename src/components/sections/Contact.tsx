import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { BracketLabel } from '@/components/ui/BracketLabel'

export function Contact() {
  return (
    <section
      id="contact"
      className="bg-[var(--color-bg)] py-16 md:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-screen-xl px-6 lg:px-12">
        <div className="mb-10 flex items-center gap-4 border-t border-[var(--color-border)] pt-7 md:mb-14">
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

        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-6 text-[1.875rem] font-medium leading-[1.05] tracking-[-0.03em] text-ink sm:text-[2.25rem] md:text-[2.5rem] lg:text-[3rem]"
          >
            Ready to choose the right path for your website?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="mb-8 max-w-[52ch] text-base leading-relaxed text-ink-muted md:mb-12 md:text-[1.125rem]"
          >
            Start with a simple request. Choose whether you need an audit, targeted improvements, a full build, or ongoing support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.18 }}
            className="flex flex-col gap-5 md:gap-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-4">
              <Link
                to="/checkout"
                className="group inline-flex w-full items-center justify-center gap-2.5 border-[1.5px] border-ink px-8 py-4 text-sm font-medium tracking-[-0.005em] text-ink transition-all duration-200 hover:border-amber hover:text-amber sm:w-auto sm:justify-start"
              >
                Build Your Plan
                <span className="text-amber transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>

              <Link
                to="/services"
                className="group inline-flex w-full items-center justify-center gap-2.5 border-[1.5px] border-[var(--color-border-strong)] px-8 py-4 text-sm font-medium tracking-[-0.005em] text-ink-muted transition-all duration-200 hover:border-amber hover:text-ink sm:w-auto sm:justify-start"
              >
                Compare Services
                <span className="text-amber opacity-60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">→</span>
              </Link>
            </div>

            <p className="text-sm text-ink-muted">
              Questions?{' '}
              <a href="mailto:brian@anvisco.com" className="font-sans text-amber transition-colors hover:text-ink">
                brian@anvisco.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
