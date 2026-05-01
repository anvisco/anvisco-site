import type { ReactNode } from 'react'

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    lead: 'text-ink-muted border-[var(--color-border-strong)]',
    active: 'text-amber border-amber/60',
    paused: 'text-ink-muted border-[var(--color-border-strong)]',
    completed: 'text-ink-subtle border-[var(--color-border)]',
    archived: 'text-ink-subtle border-[var(--color-border)]',
    requested: 'text-ink-muted border-[var(--color-border-strong)]',
    scoped: 'text-amber border-amber/40',
    in_progress: 'text-amber border-amber/60',
    complete: 'text-ink-subtle border-[var(--color-border)]',
    cancelled: 'text-ink-subtle border-[var(--color-border)]',
    not_started: 'text-ink-subtle border-[var(--color-border)]',
    pending: 'text-ink-muted border-[var(--color-border-strong)]',
    paid: 'text-amber border-amber/40',
    overdue: 'text-amber border-amber/60',
    draft: 'text-ink-subtle border-[var(--color-border)]',
    sent: 'text-amber border-amber/40',
    failed: 'text-ink-subtle border-[var(--color-border)]',
  }
  return (
    <span
      className={`inline-flex items-center border px-1.5 py-0.5 text-[0.62rem] uppercase tracking-[0.06em] ${map[status] ?? 'text-ink-muted border-[var(--color-border-strong)]'}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export function Field({
  label,
  required,
  full,
  children,
}: {
  label: string
  required?: boolean
  full?: boolean
  children: ReactNode
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">
        {label}
        {required && <span className="ml-1 text-amber">*</span>}
      </span>
      {children}
    </label>
  )
}
