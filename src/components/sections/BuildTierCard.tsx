import { motion } from 'motion/react'
import { BracketLabel } from '@/components/ui/BracketLabel'

interface BuildTierCardProps {
  name: string
  publicPrice: string
  foundingPrice: string
  features: string[]
  delivery: string
  recommended?: boolean
  index: number
  onCta: () => void
  ctaLabel: string
}

export function BuildTierCard({
  name,
  publicPrice,
  foundingPrice,
  features,
  delivery,
  recommended,
  index,
  onCta,
  ctaLabel,
}: BuildTierCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.08 }}
      className={`relative flex flex-col pt-8 pb-10 px-0 lg:px-8 border-b border-[var(--color-border)] lg:border-r lg:border-b-0 ${
        index === 0 ? 'lg:pl-0' : ''
      }`}
    >
      {recommended && (
        <div className="absolute top-8 right-0 lg:right-8">
          <BracketLabel>recommended</BracketLabel>
        </div>
      )}

      <p className="text-sm font-medium text-ink mb-6 tracking-[-0.005em]">{name}</p>

      <div className="mb-7 grid gap-5 border-y border-[var(--color-border)] py-6">
        <div>
          <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-[0.1em] text-ink-subtle">Founding rate</p>
          <p className="text-[2.5rem] font-medium tracking-[-0.03em] text-amber tabular-nums">
            {foundingPrice}
          </p>
        </div>
        <div>
          <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-[0.1em] text-ink-subtle">Public rate</p>
          <p className="text-base font-medium text-ink">{publicPrice}</p>
        </div>
      </div>

      <ul className="mb-6 space-y-3 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
            <span className="mt-2 h-1 w-1 shrink-0 bg-[var(--color-border-strong)]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <p className="mb-6 text-[0.7rem] tracking-[0.06em] text-ink-subtle uppercase">{delivery}</p>

      <button
        onClick={onCta}
        className="group mt-auto inline-flex items-center gap-2.5 border border-[var(--color-border-strong)] px-5 py-3 text-[0.7rem] tracking-[0.1em] uppercase text-ink font-medium transition-all duration-200 hover:border-amber hover:text-amber w-fit"
      >
        {ctaLabel}
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
      </button>
    </motion.div>
  )
}
