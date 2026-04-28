import { motion } from 'motion/react'

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
    <section
      id="why"
      className="py-32 md:py-40 border-t border-border bg-background"
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 relative">

        <span
          aria-hidden="true"
          className="absolute right-0 top-0 hidden select-none font-bold leading-none text-white pointer-events-none tabular-nums md:block"
          style={{
            fontSize: 'clamp(4rem, 9vw, 7rem)',
            opacity: 0.09,
            letterSpacing: '-0.04em',
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          01
        </span>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          Why this work matters
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-xl sm:text-2xl md:text-3xl font-medium leading-[1.28] md:leading-relaxed max-w-3xl mb-6 text-white"
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
          className="mb-10 max-w-2xl text-foreground/80"
        >
          The four projects below each show a different side of this:
        </motion.p>

        <div className="grid grid-cols-1 border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {sides.map((side, i) => (
            <motion.div
              key={side.tag}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.07 }}
              className="border-b border-r border-border bg-card/50 p-7 lg:p-9"
            >
              <div className="border-l-2 border-primary pl-4">
                <p className="mb-3 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.07em] text-primary">
                  {side.tag}
                </p>
                <p className="text-sm leading-relaxed text-foreground/80">
                  <span className="font-semibold text-white">{side.project}</span>
                  {': '}{side.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 max-w-2xl text-muted-foreground"
        >
          Most "great-looking" websites fail one of these tests. My work starts
          by identifying which of these matter for your business, then building
          for them.
        </motion.p>

      </div>
    </section>
  )
}
