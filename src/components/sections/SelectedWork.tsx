import { motion } from 'motion/react'
import { ProjectCard } from './ProjectCard'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { projects } from '@/data/projects'

export function SelectedWork() {
  return (
    <section id="work" className="scroll-mt-16 py-24 md:py-32 bg-[var(--color-bg)]">

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div className="flex items-baseline justify-between mb-16 border-t border-[var(--color-border)] pt-7">
          <div className="flex items-center gap-4">
            <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">02</span>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <BracketLabel>Selected Work</BracketLabel>
            </motion.div>
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-[0.7rem] text-ink-subtle tabular-nums"
          >
            4 projects
          </motion.span>
        </div>

        {/* Editorial project list — single column */}
        <div>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
