import { motion } from 'motion/react'

const CALENDLY = 'https://calendly.com/nducanhnguyenn/15-minute-discovery-call'
const EMAIL = 'brian@anvisco.com'

export function Contact() {
  return (
    <section
      id="contact"
      className="py-24 md:py-32 border-t border-border bg-background"
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
          06
        </span>

        <div className="max-w-2xl">

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            Book a call
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6 text-white"
          >
            Got a website that is not pulling its weight?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="mb-6 text-lg leading-relaxed text-foreground/80"
          >
            Book a 15-minute call. I will review your site before we speak and
            walk you through the three most important things I would fix.
            Consider it a free consult designed to give you clarity upfront.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.18 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-primary px-8 py-4 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/85"
            >
              Book a 15-minute call
            </a>

            <a
              href={`mailto:${EMAIL}`}
              className="text-sm text-muted-foreground transition-colors duration-150 hover:text-white"
            >
              {EMAIL}
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
