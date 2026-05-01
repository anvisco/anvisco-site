import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { ModuleCard } from './ModuleCard'
import { modules } from '@/data/modules'

export function Modules() {
  const featuredModules = modules.slice(0, 3)

  return (
    <section id="modules" className="scroll-mt-16 py-24 md:py-32 bg-[var(--color-surface)]">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        <div className="flex items-center gap-4 mb-14 border-t border-[var(--color-border)] pt-7">
          <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">04</span>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <BracketLabel>Module teaser</BracketLabel>
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-4 text-[2rem] md:text-[2.5rem] font-medium tracking-[-0.02em] text-ink leading-[1.1] max-w-xl"
        >
          Targeted upgrades without a full rebuild.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 }}
          className="mb-14 text-[1.0625rem] leading-relaxed text-ink-muted max-w-[52ch]"
        >
          Start with the layer holding the site back, then view the full module menu when you need pricing and scope.
        </motion.p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredModules.map((module, i) => (
            <ModuleCard key={module.id} module={module} index={i} compact href="/services" />
          ))}
        </div>

        <Link
          to="/services"
          className="group mt-10 inline-flex items-center gap-2.5 border border-[var(--color-border-strong)] px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink transition-all duration-200 hover:border-amber hover:text-amber"
        >
          Choose Your Upgrades
          <span className="text-amber transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </Link>

      </div>
    </section>
  )
}
