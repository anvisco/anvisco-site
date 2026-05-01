import { motion } from 'motion/react'
import { BracketLabel } from '@/components/ui/BracketLabel'

export function About() {
  return (
    <section id="about" className="scroll-mt-16 py-24 md:py-32 bg-[var(--color-bg)]">

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
            <BracketLabel>About</BracketLabel>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-16 lg:gap-24">

          {/* Spacer column for desktop alignment */}
          <div />

          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-2xl mb-6 text-xl leading-[1.28] font-medium text-ink sm:text-2xl md:text-3xl md:leading-relaxed tracking-[-0.01em]"
            >
              Over the past two years, I have built websites for organizations
              that needed more than something that "looks nice." Membership
              platforms, nonprofits, and multi-program businesses where the
              website had to perform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="space-y-4 text-ink-muted leading-relaxed max-w-xl"
            >
              <p>
                That is the lens I bring to every project: what does this site
                need to do, and is it doing it well?
              </p>
              <p className="text-ink font-medium">
                Toronto-based. Available for projects globally.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
