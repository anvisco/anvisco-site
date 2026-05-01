import { motion } from 'motion/react'
import { BracketLabel } from '@/components/ui/BracketLabel'

export function OriginalEdge() {
  return (
    <section className="py-24 md:py-32 bg-[var(--color-bg)]">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        <div className="flex items-center gap-4 mb-14 border-t border-[var(--color-border)] pt-7">
          <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">01</span>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <BracketLabel>Business function</BracketLabel>
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8 text-[2rem] md:text-[2.5rem] font-medium tracking-[-0.02em] text-ink leading-[1.1] max-w-2xl"
        >
          Your website should do <span className="text-amber">more than look good.</span>
        </motion.h2>

        <div className="max-w-[68ch]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="space-y-5"
          >
            <p className="text-[1.25rem] leading-relaxed text-ink">
              A good website should support the way your business <span className="text-amber">actually works</span>.
            </p>
            <p className="text-[1.0625rem] leading-relaxed text-ink-muted">
              It should guide visitors, answer the right questions, build trust quickly, make booking easy, and help turn interest into real appointments.
            </p>
            <p className="text-[1.0625rem] leading-relaxed text-ink-muted">
              Most websites only describe the business. Anvis builds sites that help <span className="text-amber">run it</span>.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
