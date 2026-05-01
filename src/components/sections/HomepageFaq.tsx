import { motion } from 'motion/react'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { Accordion } from '@/components/ui/Accordion'

const items = [
  {
    question: 'Do I need a full rebuild?',
    answer:
      'Not always. Some businesses should start with an audit or a targeted module before they commit to a rebuild.',
  },
  {
    question: 'What makes a website AI-ready?',
    answer:
      'Clear structure for people, Google, AI tools, Maps, and local recommendations. The site should explain the business clearly and consistently.',
  },
  {
    question: 'Is this replacing SEO?',
    answer:
      'No. It adds a modern discovery layer on top of SEO, not instead of it.',
  },
  {
    question: 'Can you improve my existing site?',
    answer:
      'Yes. Modules are built for existing sites that need a stronger layer without starting over.',
  },
  {
    question: 'What happens after the audit?',
    answer:
      'The next step is usually a module, a bundle, or a full build depending on what the site actually needs.',
  },
  {
    question: 'Do I pay right away?',
    answer:
      'No. The request flow starts the process first. Payment or setup is confirmed after the scope is reviewed.',
  },
]

export function HomepageFaq() {
  return (
    <section id="faq" className="scroll-mt-16 py-20 md:py-28 bg-[var(--color-surface)]">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-14 border-t border-[var(--color-border)] pt-7">
          <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">07</span>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <BracketLabel>FAQ</BracketLabel>
          </motion.div>
        </div>

        <div className="max-w-[70ch]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-4 text-[2rem] md:text-[2.5rem] font-medium tracking-[-0.02em] text-ink leading-[1.1]"
          >
            Short answers for the most common decisions.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 }}
            className="mb-10 text-[1.0625rem] leading-relaxed text-ink-muted"
          >
            Use this to decide whether to start with an audit, a module, or a full build.
          </motion.p>

          <Accordion items={items} />
        </div>
      </div>
    </section>
  )
}
