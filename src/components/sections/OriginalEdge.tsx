import { motion } from 'motion/react'
import { BracketLabel } from '@/components/ui/BracketLabel'

export function OriginalEdge() {
  return (
    <section className="bg-[var(--color-bg)] py-24 md:py-32">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-12">
        <div className="mb-14 flex items-center gap-4 border-t border-[var(--color-border)] pt-7">
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
          className="mb-8 max-w-[20ch] text-[2rem] font-medium leading-[1.1] tracking-[-0.02em] text-ink md:text-[2.5rem]"
        >
          <span className="block">Your website should</span>
          <span className="block">
            <span className="text-amber">do</span>{' '}
            <span className="text-amber">more than look good.</span>
          </span>
        </motion.h2>

        <div className="max-w-[60ch]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="space-y-5"
          >
            <p className="text-[1.0625rem] leading-relaxed text-ink">
              A good website should support the way your business actually works.
            </p>
            <p className="max-w-[56ch] text-[1.0625rem] leading-relaxed text-ink-muted">
              It should guide visitors, answer the right questions, build trust quickly, make booking easy, and turn interest into real appointments.
            </p>
            <p className="max-w-[56ch] text-[1.0625rem] leading-relaxed text-ink-muted">
              Most websites only describe the business.{' '}
              <span className="text-amber font-medium">Anvis builds sites that run &amp; optimize your business.</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
