import { motion } from 'motion/react'
import { BracketLabel } from '@/components/ui/BracketLabel'

const steps = [
  {
    number: '01',
    title: 'Discovery call',
    duration: '30 min',
    description:
      'Clarify your business, current site, goals, and what the website needs to do.',
  },
  {
    number: '02',
    title: 'Audit + proposal',
    duration: '24 hrs',
    description:
      'Get a concise breakdown of what to fix, why it matters, and what comes first.',
  },
  {
    number: '03',
    title: 'Build',
    duration: '5–14 days depending on scope',
    description:
      'Build in focused cycles with daily updates and a mid-build review.',
  },
  {
    number: '04',
    title: 'Launch + handover',
    duration: '',
    description:
      'Launch with a full walkthrough and 30 days of support.',
  },
]

export function Process() {
  return (
    <section id="process" className="scroll-mt-16 py-24 md:py-32 bg-[var(--color-bg)]">

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-16 border-t border-[var(--color-border)] pt-7">
          <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">04</span>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <BracketLabel>Process</BracketLabel>
          </motion.div>
        </div>

        {/* Four-column grid on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.08 }}
              className={`relative pt-7 pb-8 pr-8 ${
                i < steps.length - 1
                  ? 'border-b border-[var(--color-border)] lg:border-b-0 lg:border-r lg:border-[var(--color-border)]'
                  : ''
              } ${i > 0 ? 'lg:pl-8' : ''}`}
            >
              {/* Amber index */}
              <p className="text-[0.7rem] tabular-nums font-medium tracking-[0.08em] text-amber mb-6">
                {step.number}
              </p>

              {/* Step title */}
              <p className="text-base font-medium text-ink mb-1 tracking-[-0.01em]">
                {step.title}
              </p>

              {/* Duration */}
              {step.duration && (
                <p className="text-[0.7rem] tracking-[0.08em] uppercase text-ink-subtle mb-4">
                  {step.duration}
                </p>
              )}

              {/* Description */}
              <p className="text-sm text-ink-muted leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
