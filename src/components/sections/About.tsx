import { motion } from 'motion/react'
import { SectionWatermark } from './SectionWatermark'

export function About() {
  return (
    <section id="about" className="scroll-mt-16 py-24 md:py-32 border-t border-border bg-background relative overflow-hidden">
      <SectionWatermark>05</SectionWatermark>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-16 lg:gap-24">

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs tracking-[0.2em] uppercase text-muted-foreground"
          >
            About
          </motion.p>

          <div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-2xl mb-6 text-xl leading-[1.28] font-medium text-white sm:text-2xl md:text-3xl md:leading-relaxed"
            >
              Over the past two years, I have built websites for organizations
              that needed more than something that "looks nice." Membership
              platforms, nonprofits, and multi-program businesses where the
              website had to perform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="space-y-5 text-muted-foreground leading-relaxed max-w-xl"
            >
              <p>
                That is the lens I bring to every project: what does this site
                need to do, and is it doing it well?
              </p>
              <p className="text-foreground font-medium">
                Toronto-based. Available for projects globally.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
