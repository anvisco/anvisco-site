import { motion } from 'motion/react'
import { BracketLabel } from '@/components/ui/BracketLabel'

export function DiscoveryLayer() {
  return (
    <section className="py-24 md:py-32 bg-[var(--color-surface)]">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        <div className="flex items-center gap-4 mb-14 border-t border-[var(--color-border)] pt-7">
          <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">02</span>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <BracketLabel>Modern discovery</BracketLabel>
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8 text-[2rem] md:text-[2.5rem] font-medium tracking-[-0.02em] text-ink leading-[1.1] max-w-2xl"
        >
          Now it also needs to be built for{' '}
          <span className="text-amber">how people search.</span>
        </motion.h2>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,620px)_minmax(260px,1fr)]">
          <div className="space-y-5">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="text-[1.125rem] leading-relaxed text-ink-muted"
          >
            People do not only type short keywords into Google anymore. They ask AI tools, Maps, and search engines direct questions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.14 }}
            className="grid gap-2 text-sm text-ink"
          >
            {['best dentist near me', 'emergency dentist open nearby', 'who should I trust for Invisalign?'].map((query) => (
              <div key={query} className="border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
                "{query}"
              </div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.18 }}
            className="text-[1.125rem] leading-relaxed text-ink-muted"
          >
            When someone asks ChatGPT or Google AI to recommend a clinic, your website either gives those tools enough to work with, or it does not. The clinics with clear structure get suggested. The ones without get skipped.
          </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.24 }}
            className="h-fit border-l border-amber/45 pl-6 text-[1.2rem] leading-relaxed text-ink"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontStyle: 'italic' }}
          >
            This is not a replacement for SEO. It is a layer on top of it.
          </motion.p>
        </div>

      </div>
    </section>
  )
}
