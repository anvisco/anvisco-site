import { motion } from 'motion/react'
import { BracketLabel } from '@/components/ui/BracketLabel'

const steps = [
  {
    number: '01',
    title: 'Audit',
    duration: '1 to 2 days',
    description:
      'Review visibility, trust, content, speed, and booking flow before recommending what to fix.',
  },
  {
    number: '02',
    title: 'Scope & recommend',
    duration: 'Clear next step',
    description:
      'Decide whether the site needs a module, a bundle, or a full custom build.',
  },
  {
    number: '03',
    title: 'Build or upgrade',
    duration: 'Timeline depends on scope',
    description:
      'Improve the selected layer, from content and booking flow to a full custom-coded rebuild.',
  },
  {
    number: '04',
    title: 'Launch + handover',
    duration: '30 days of support',
    description:
      'Launch with a walkthrough, QA pass, and post-launch support so the site is ready to use.',
  },
]

export function Process() {
  return (
    <section id="process" className="scroll-mt-16 bg-[var(--color-bg)] py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-12">
        <div className="mb-10 flex items-center gap-4 border-t border-[var(--color-border)] pt-7 md:mb-16">
          <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">06</span>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <BracketLabel>Process</BracketLabel>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.08 }}
              className="relative flex min-h-[250px] flex-col border border-[var(--color-border)] bg-[var(--color-surface)] p-7"
            >
              <p className="text-[0.7rem] tabular-nums font-medium tracking-[0.08em] text-amber mb-6">
                {step.number}
              </p>

              <p className="text-base font-medium text-ink mb-1 tracking-[-0.01em]">
                {step.title}
              </p>

              <p className="text-[0.7rem] tracking-[0.08em] uppercase text-amber mb-5">
                {step.duration}
              </p>

              <p className="mt-auto text-sm text-ink-muted leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
