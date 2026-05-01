import { motion } from 'motion/react'
import { BracketLabel } from '@/components/ui/BracketLabel'

export function About() {
  return (
    <section id="about" className="scroll-mt-16 py-20 md:py-28 bg-[var(--color-surface)]">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-14 border-t border-[var(--color-border)] pt-7">
          <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">04</span>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <BracketLabel>About Anvis</BracketLabel>
          </motion.div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,640px)_minmax(260px,1fr)] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="space-y-5"
          >
            <h2 className="text-[2rem] md:text-[2.5rem] font-medium tracking-[-0.02em] text-ink leading-[1.1] max-w-2xl">
              Built for sites that have to do real work.
            </h2>
            <p className="text-[1.0625rem] leading-relaxed text-ink-muted">
              Anvis builds custom websites for local service businesses that need more than a visual refresh. The work focuses on structure, clarity, trust, conversion, and modern discovery, so the website supports how the business actually runs.
            </p>
            <p className="text-[1.0625rem] leading-relaxed text-ink-muted">
              The portfolio is curated to show relevant systems and outcomes, not every project. That keeps the focus on the kind of sites Anvis builds now.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.12 }}
            className="border-l border-amber/45 pl-6"
          >
            <p className="text-sm leading-relaxed text-ink-muted">
              This page shows the work, the context around it, and the direction Anvis is taking now.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
