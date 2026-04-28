import { motion } from 'motion/react'
import { ProjectCard } from './ProjectCard'
import { SectionWatermark } from './SectionWatermark'
import { projects } from '@/data/projects'

export function SelectedWork() {
  return (
    <section id="work" className="scroll-mt-16 py-24 md:py-32 border-t border-border bg-background relative overflow-hidden">
      <SectionWatermark>02</SectionWatermark>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex items-baseline justify-between mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs tracking-[0.2em] uppercase text-muted-foreground"
          >
            Selected Work
          </motion.p>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-xs text-muted-foreground tabular-nums"
          >
            4 projects
          </motion.span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-12 md:gap-y-16">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
