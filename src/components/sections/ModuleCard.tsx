import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import type { Module } from '@/data/modules'

interface ModuleCardProps {
  module: Module
  index: number
  compact?: boolean
  href?: string
}

export function ModuleCard({ module, index, compact, href }: ModuleCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.06 }}
      className={`group flex flex-col border border-[var(--color-border)] bg-[var(--color-bg)] p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/55 hover:bg-[var(--color-surface)] md:p-8 ${
        compact ? 'min-h-[220px]' : 'min-h-[260px]'
      }`}
    >
      <p className="mb-5 text-base font-medium text-ink tracking-[-0.005em]">{module.name}</p>
      {!compact && <p className="mb-8 flex-1 text-sm leading-relaxed text-ink-muted">{module.description}</p>}
      <div className="border-t border-[var(--color-border)] pt-5">
        <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-[0.1em] text-ink-subtle">Starting at</p>
        <p className="flex items-center justify-between gap-3 text-xl font-medium tracking-[-0.02em] text-amber">
          <span>{module.startingAt}</span>
          <span className="text-sm transition-transform duration-200 group-hover:translate-x-1">→</span>
        </p>
      </div>
    </motion.div>
  )

  if (!href) return content

  return (
    <Link to={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/70">
      {content}
    </Link>
  )
}
