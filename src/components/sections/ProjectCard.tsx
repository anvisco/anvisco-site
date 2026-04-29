import { motion } from 'motion/react'
import type { Project } from '@/data/projects'
import { BracketLabel } from '@/components/ui/BracketLabel'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.07 }}
      className="group block border-t border-[var(--color-border)] pt-7 pb-8 cursor-pointer transition-all duration-200 hover:border-[var(--color-border-strong)]"
      style={{
        /* Hover: shift slightly right */
        '--tw-translate-x': '0px',
      } as React.CSSProperties}
    >
      <div className="flex gap-6 items-start transition-transform duration-200 group-hover:translate-x-2">

        {/* Amber index number */}
        <span
          className="shrink-0 text-[0.75rem] font-medium tabular-nums tracking-[0.08em] text-amber pt-0.5"
          aria-hidden="true"
        >
          {num}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* BracketLabel category above name */}
          <div className="mb-3">
            <BracketLabel>{project.tag}</BracketLabel>
          </div>

          {/* Project name */}
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xl font-medium tracking-[-0.01em] text-ink transition-colors duration-150 group-hover:text-amber">
              {project.client}
            </h3>
            <span
              aria-hidden="true"
              className="text-amber opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm"
            >
              →
            </span>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-ink-muted max-w-[56ch]">
            {project.shortDescription}
          </p>

          {/* Stack tags */}
          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="text-[0.65rem] tracking-[0.08em] uppercase text-ink-subtle border border-[var(--color-border)] px-2 py-1"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </motion.a>
  )
}
