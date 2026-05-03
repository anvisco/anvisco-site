import { motion } from 'motion/react'
import { BracketLabel } from '@/components/ui/BracketLabel'

export function DiscoveryLayer() {
  return (
    <section className="bg-[var(--color-surface)] py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-12">
        <div className="mb-10 flex items-center gap-4 border-t border-[var(--color-border)] pt-7 md:mb-14">
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
          className="mb-6 max-w-[22ch] text-[1.75rem] font-medium leading-[1.1] tracking-[-0.02em] text-ink md:mb-8 md:text-[2rem] lg:text-[2.5rem]"
        >
          <span className="block text-ink">Now websites also need to be</span>
          <span className="block text-amber">built for how people search.</span>
        </motion.h2>

        <div className="max-w-[60ch] space-y-5">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="text-base leading-relaxed text-ink-muted md:text-[1.125rem]"
          >
            People no longer search with short keywords alone. They ask direct questions through{' '}
            <span className="text-amber">Google, AI tools, Maps, and local recommendations</span>.
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
                &quot;{query}&quot;
              </div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.18 }}
            className="text-base leading-relaxed text-ink-muted md:text-[1.125rem]"
          >
            Your website needs to clearly explain who you are, what you offer, where you serve, and why people should trust you.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.24 }}
            className="border-l-0 text-[0.9375rem] font-medium leading-relaxed tracking-[-0.005em] text-ink-subtle"
          >
            This is{' '}
            <span className="text-amber">not a replacement for SEO.</span>{' '}
            It is a{' '}
            <span className="text-amber">layer on top of it.</span>
          </motion.p>
        </div>
      </div>
    </section>
  )
}
