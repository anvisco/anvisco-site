import { motion } from 'motion/react'
import { BracketLabel } from '@/components/ui/BracketLabel'

const sides = [
  {
    tag: 'Systems & Engagement',
    project: 'DGS',
    description: 'where the website is the business',
  },
  {
    tag: 'Operations & Continuity',
    project: 'IWB',
    description: 'where the website is a living partnership',
  },
  {
    tag: 'Scale & Investment',
    project: 'PDT',
    description: 'where the website is a template that scales',
  },
  {
    tag: 'Corporate & Partnership',
    project: 'RTG',
    description: 'where the website opens doors',
  },
]

export function WhyThisMatters() {
  return (
    <section id="why" className="py-24 md:py-32 bg-[var(--color-bg)]">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-14 border-t border-[var(--color-border)] pt-7">
          <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">01</span>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <BracketLabel>Why this work matters</BracketLabel>
          </motion.div>
        </div>

        {/* Lead copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-xl sm:text-2xl md:text-3xl font-medium leading-[1.28] md:leading-relaxed max-w-3xl mb-6 text-ink tracking-[-0.01em]"
        >
          A website is not a brochure. It is where your systems, operations,
          and first impressions either work together or fall apart. Most sites
          fail not because they look bad, but because they were built without
          understanding how the business actually runs. That is the problem I
          solve.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="mb-12 max-w-2xl text-ink-muted"
        >
          The four projects below each show a different side of this:
        </motion.p>

        {/* Four-column grid — no side-stripe, use amber number instead */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-[var(--color-border)]">
          {sides.map((side, i) => (
            <motion.div
              key={side.tag}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.07 }}
              className={`pt-6 pb-8 pr-6 border-b border-[var(--color-border)] ${
                i < sides.length - 1
                  ? 'sm:border-r sm:border-[var(--color-border)]'
                  : ''
              } ${i > 0 ? 'lg:pl-6' : ''}`}
            >
              <span className="block text-[0.65rem] tabular-nums text-amber font-medium tracking-[0.08em] mb-4">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="mb-3">
                <BracketLabel>{side.tag}</BracketLabel>
              </div>
              <p className="text-sm leading-relaxed text-ink-muted">
                <span className="font-medium text-ink">{side.project}</span>
                {': '}{side.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 max-w-2xl text-ink-muted"
        >
          Most "great-looking" websites fail one of these tests. My work starts
          by identifying which of these matter for your business, then building
          for them.
        </motion.p>

      </div>
    </section>
  )
}
