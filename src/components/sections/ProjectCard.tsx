import { motion } from 'motion/react'
import type { Project } from '@/data/projects'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { WebsiteFrame } from './WebsiteFrame'

interface ProjectCardProps {
  project: Project
}

const statusLabel: Record<Project['status'], string> = {
  live: 'Live',
  'in-progress': 'In progress',
  reserved: 'Reserved',
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.article
      initial={false}
      className="group border-t border-[var(--color-border)] py-10 transition-colors duration-200 hover:border-[var(--color-border-strong)] md:py-12"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:items-start lg:gap-12">

        <div className="min-w-0">

          <div className="mb-3 flex items-center gap-3">
            <BracketLabel>{project.tag}</BracketLabel>
            <span className="text-[0.65rem] font-medium tracking-[0.08em] uppercase text-amber">
              {statusLabel[project.status]}
            </span>
          </div>

          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 inline-flex items-center gap-3"
            >
              <h3 className="text-xl font-medium tracking-[-0.01em] text-ink transition-colors duration-200">
                {project.client}
              </h3>
              <span aria-hidden="true" className="text-xl text-amber transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </a>
          ) : (
            <div className="mb-4 inline-flex items-center gap-3">
              <h3 className="text-xl font-medium tracking-[-0.01em] text-ink">
                {project.client}
              </h3>
            </div>
          )}

          <p className="max-w-[56ch] text-sm leading-relaxed text-ink-muted">
            {project.shortDescription}
          </p>

          {project.stack.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="border border-border-strong bg-surface px-2.5 py-1 text-xs uppercase tracking-wider text-ink-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {(project.image || project.frameLabel) && (
          <WebsiteFrame href={project.link} image={project.image} alt={project.alt} label={project.frameLabel} />
        )}

      </div>
    </motion.article>
  )
}
