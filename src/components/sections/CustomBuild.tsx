import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { BracketLabel } from '@/components/ui/BracketLabel'

export function CustomBuild() {
  return (
    <section id="build" className="scroll-mt-16 bg-[var(--color-bg)] py-24 md:py-32">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-12">
        <div className="mb-14 flex items-center gap-4 border-t border-[var(--color-border)] pt-7">
          <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">05</span>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <BracketLabel>Custom builds</BracketLabel>
          </motion.div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,560px)_minmax(320px,1fr)] lg:items-start">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-[18ch] text-[2rem] font-medium leading-[1.08] tracking-[-0.02em] text-ink md:text-[2.5rem]"
          >
            For businesses ready to rebuild properly.
          </motion.h2>

          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="mb-6 max-w-[58ch] text-[1.125rem] leading-relaxed text-ink"
            >
              A custom website gives more control over structure, speed, design, content architecture, search readiness, and the full path from discovery to booking.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.16 }}
              className="mb-10 max-w-[58ch] border-l border-amber/50 pl-6 text-[1.0625rem] leading-relaxed text-ink-muted"
            >
              Built around how your business actually operates, not around a template. Public rates start at $2,200, with founding rates available for the first 3 clients.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.22 }}
            >
              <Link
                to="/services"
                className="group inline-flex items-center gap-2.5 border-[1.5px] border-ink px-6 py-3 text-sm font-medium text-ink tracking-[-0.005em] transition-all duration-200 hover:border-amber hover:text-amber"
              >
                Choose Your Build
                <span className="text-amber transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
