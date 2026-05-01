import { useState } from 'react'

interface AccordionItem {
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
}

export function Accordion({ items }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="divide-y divide-[var(--color-border)]">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-start justify-between gap-6 py-6 text-left text-sm font-medium text-ink tracking-[-0.005em] transition-colors duration-150 hover:text-amber"
            aria-expanded={open === i}
          >
            <span>{item.question}</span>
            <span
              className="shrink-0 mt-0.5 text-amber transition-transform duration-200"
              style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
              aria-hidden="true"
            >
              +
            </span>
          </button>
          {open === i && (
            <div className="pb-6 text-sm leading-relaxed text-ink-muted max-w-[64ch]">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
