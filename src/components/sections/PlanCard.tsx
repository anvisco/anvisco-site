import { motion } from 'motion/react'

interface PlanCardProps {
  name: string
  price: string
  features: string[]
  index: number
}

export function PlanCard({ name, price, features, index }: PlanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.08 }}
      className="border border-[var(--color-border)] p-8 flex flex-col gap-6"
    >
      <div>
        <p className="text-sm font-medium text-ink mb-3 tracking-[-0.005em]">{name}</p>
        <span className="text-[2.5rem] font-medium tracking-[-0.03em] text-amber tabular-nums">
          {price}
        </span>
        <span className="text-sm text-ink-muted ml-2">/ month</span>
      </div>

      <ul className="space-y-3 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
            <span className="mt-2 h-1 w-1 shrink-0 bg-[var(--color-border-strong)]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>


    </motion.div>
  )
}
