import { motion } from 'motion/react'
import { SectionWatermark } from './SectionWatermark'

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
    <section id="process" className="scroll-mt-16 py-24 md:py-32 border-t border-border bg-background relative overflow-hidden">
      <SectionWatermark>04</SectionWatermark>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-10"
        >
          Process
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-border">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.08 }}
              className="relative border-b border-r border-border bg-background p-5 transition-colors duration-150 hover:bg-muted/30 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-primary/60 lg:p-6"
            >
              <p className="text-4xl font-bold tracking-tight text-primary/80 mb-5">
                {step.number}
              </p>
              <p className="text-lg font-semibold mb-1">{step.title}</p>
              {step.duration && (
                <p className="text-xs text-muted-foreground mb-3">{step.duration}</p>
              )}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
