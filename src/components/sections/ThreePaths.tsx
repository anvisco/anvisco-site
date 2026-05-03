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
    to: '/checkout?path=modules',
  },
  {
    name: 'Rebuild',
    description: 'A full custom-coded website built around your business.',
    cta: 'Plan Your Build',
    to: '/checkout?path=build',
  },
]

export function ThreePaths() {
  return (
    <section id="services" className="scroll-mt-16 bg-[var(--color-bg)] py-24 md:py-32">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-12">
        <div className="mb-14 flex items-center gap-4 border-t border-[var(--color-border)] pt-7">
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
          className="mb-5 text-[2rem] font-medium leading-[1.1] tracking-[-0.02em] md:text-[2.5rem]"
        >
          <span className="block text-ink">Choose the layer</span>
          <span className="block whitespace-nowrap text-amber">your website needs most.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 }}
          className="mb-14 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-muted"
        >
          Not every business needs a full rebuild. Some need clearer content, a better booking
          flow, or stronger visuals.
        </motion.p>

        <div className="grid grid-cols-1 border-t border-[var(--color-border)] md:grid-cols-3">
          {paths.map((path, i) => (
            <motion.div
              key={path.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.08 }}
              className={`group flex flex-col gap-5 border-b border-[var(--color-border)] pb-10 pt-8 md:border-b-0 md:pr-8 ${
                i > 0 ? 'md:border-l md:border-[var(--color-border)] md:pl-8' : ''
              }`}
            >
              <p className="text-[1.25rem] font-medium tracking-[-0.01em] text-amber">{path.name}</p>
              <p className="max-w-[24ch] flex-1 text-sm leading-relaxed text-ink-muted">{path.description}</p>
              <Link
                to={path.to}
                className="group/link inline-flex w-fit items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink-subtle transition-colors duration-200 hover:text-amber"
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
