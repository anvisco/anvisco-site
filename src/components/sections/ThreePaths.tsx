import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { BracketLabel } from '@/components/ui/BracketLabel'

const paths = [
  {
    name: 'Audit',
    description: 'Find out where your site is losing visibility, trust, or bookings.',
    cta: 'Start Your Audit',
    to: '/audit',
  },
  {
    name: 'Improve',
    description: 'Upgrade specific parts of your existing website.',
    cta: 'Choose Your Upgrades',
    to: '/services',
  },
  {
    name: 'Rebuild',
    description: 'A full custom-coded website built around your business.',
    cta: 'Plan Your Build',
    to: '/services',
  },
]

export function ThreePaths() {
  return (
    <section id="services" className="scroll-mt-16 py-24 md:py-32 bg-[var(--color-bg)]">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        <div className="flex items-center gap-4 mb-14 border-t border-[var(--color-border)] pt-7">
          <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">03</span>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <BracketLabel>How to work together</BracketLabel>
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-5 text-[2rem] md:text-[2.5rem] font-medium tracking-[-0.02em] text-ink leading-[1.1] max-w-xl"
        >
          Choose the layer your website needs most.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 }}
          className="mb-14 max-w-[60ch] text-[1.0625rem] leading-relaxed text-ink-muted"
        >
          Not every business needs a full rebuild. Some need clearer content. Some need a better booking flow. Some need stronger visuals. Some need faster mobile performance. Some need a custom website built from the ground up.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[var(--color-border)]">
          {paths.map((path, i) => (
            <motion.div
              key={path.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.08 }}
              className={`group flex flex-col gap-5 pt-8 pb-10 border-b border-[var(--color-border)] md:border-b-0 md:pr-8 ${
                i > 0 ? 'md:pl-8 md:border-l md:border-[var(--color-border)]' : ''
              }`}
            >
              <p className="text-[1.25rem] font-medium tracking-[-0.01em] text-ink">{path.name}</p>
              <p className="text-sm leading-relaxed text-ink-muted flex-1">{path.description}</p>
              <Link
                to={path.to}
                className="group/link inline-flex items-center gap-2 text-[0.7rem] tracking-[0.1em] uppercase text-ink-subtle font-medium transition-colors duration-200 hover:text-amber w-fit"
              >
                {path.cta}
                <span className="text-amber transition-transform duration-200 group-hover/link:translate-x-0.5">→</span>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
