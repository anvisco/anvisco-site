import { motion } from 'motion/react'
import type { Project } from '@/data/projects'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.09 }}
      className="group cursor-default block"
    >
      <div className="relative mb-6 overflow-hidden rounded-sm border border-border bg-card">
        {/* Top accent bar — expands on hover */}
        <div className="absolute left-0 top-0 z-10 h-0.5 w-8 bg-primary transition-all duration-500 ease-out group-hover:w-full" />

        {/* Browser chrome bar */}
        <div className="flex h-7 items-center gap-1.5 border-b border-border bg-muted/60 px-3">
          <span className="w-2 h-2 rounded-full bg-white/[0.28]" />
          <span className="w-2 h-2 rounded-full bg-white/[0.22]" />
          <span className="w-2 h-2 rounded-full bg-white/[0.16]" />
          <div className="flex-1 mx-2 h-3.5 rounded-full bg-white/[0.11]" />
        </div>

        {/* Screenshot area */}
        <div className="aspect-[4/3] relative">
          <img
            src={project.image}
            alt={project.alt}
            className="h-full w-full object-cover saturate-[0.9] contrast-[0.98] brightness-[0.98]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-background/10 mix-blend-color transition-opacity duration-200 group-hover:opacity-80"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-primary/[0.06] mix-blend-soft-light transition-opacity duration-200 group-hover:opacity-70"
          />
          {/* Arrow — appears on hover */}
          <span
            aria-hidden="true"
            className="absolute bottom-4 right-4 text-sm text-white opacity-0 group-hover:opacity-50 transition-opacity duration-200"
          >
            ↗
          </span>
        </div>
      </div>

      {/* Tag */}
      <p className="text-xs tracking-[0.15em] uppercase font-medium mb-2 text-primary">
        {project.tag}
      </p>

      {/* Client name */}
      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-150">
        {project.client}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
        {project.shortDescription}
      </p>

      {/* Stack */}
      <div className="flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-sm border border-border bg-muted/20 px-2 py-0.5 text-xs text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.a>
  )
}
