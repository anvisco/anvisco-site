import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AdminShell,
  A_INPUT,
  A_SELECT,
  A_BTN_PRIMARY,
  A_BTN_GHOST,
} from '@/components/admin/AdminShell'
import { supabase } from '@/lib/supabase'
import type { ClientStatus } from '@/types/backend'

// ----- Local DB row types (snake_case from Supabase) -----

interface DbPackage {
  id: string
  package_name: string
  package_type: string
  status: string
  next_payment_due_at: string | null
}

interface DbClient {
  id: string
  name: string
  business_name: string | null
  email: string
  phone: string | null
  website_url: string | null
  status: string
  notes: string | null
  created_at: string
  client_packages: DbPackage[]
}

interface DbPayment {
  id: string
  client_id: string
  status: string
  due_date: string | null
  amount_cents: number
}

// ----- Derived summary -----

interface Summary {
  leads: number
  active: number
  overduePayments: number
  upcomingPayments: number
  activeBuilds: number
}

function computeSummary(clients: DbClient[], payments: DbPayment[]): Summary {
  const now = new Date()
  const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  return {
    leads: clients.filter((c) => c.status === 'lead').length,
    active: clients.filter((c) => c.status === 'active').length,
    overduePayments: payments.filter((p) => p.status === 'overdue').length,
    upcomingPayments: payments.filter((p) => {
      if (p.status !== 'not_started' && p.status !== 'pending') return false
      if (!p.due_date) return false
      const d = new Date(p.due_date)
      return d >= now && d <= in30
    }).length,
    activeBuilds: clients.filter((c) =>
      c.client_packages.some(
        (p) => p.status === 'in_progress' && p.package_type === 'build',
      ),
    ).length,
  }
}

function activePackageOf(client: DbClient): DbPackage | null {
  return client.client_packages.find((p) => p.status !== 'cancelled') ?? null
}

// ----- Component -----

export function AdminPage() {
  return (
    <AdminShell>
      <Dashboard />
    </AdminShell>
  )
}

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<DbClient[]>([])
  const [payments, setPayments] = useState<DbPayment[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAdd, setShowAdd] = useState(false)

  async function load() {
    if (!supabase) return
    setLoading(true)
    setError(null)
    const [clientsRes, paymentsRes] = await Promise.all([
      supabase
        .from('clients')
        .select(
          'id, name, business_name, email, phone, website_url, status, notes, created_at, client_packages(id, package_name, package_type, status, next_payment_due_at)',
        )
        .order('created_at', { ascending: false }),
      supabase
        .from('payment_schedules')
        .select('id, client_id, status, due_date, amount_cents'),
    ])
    if (clientsRes.error) { setError(clientsRes.error.message); setLoading(false); return }
    if (paymentsRes.error) { setError(paymentsRes.error.message); setLoading(false); return }
    setClients((clientsRes.data as DbClient[]) ?? [])
    setPayments((paymentsRes.data as DbPayment[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const summary = computeSummary(clients, payments)
  const filtered = statusFilter === 'all'
    ? clients
    : clients.filter((c) => c.status === statusFilter)

  return (
    <div>
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <div>
          <p className="mb-1 text-[0.7rem] uppercase tracking-[0.1em] text-ink-subtle">
            Admin dashboard
          </p>
          <h1 className="text-2xl font-medium tracking-tight text-ink">Clients</h1>
        </div>
        <button onClick={() => setShowAdd(true)} className={A_BTN_PRIMARY}>
          + Add client
        </button>
      </div>

      {error && (
        <p className="mb-6 border border-amber/60 bg-amber/5 px-3 py-2 text-sm text-amber">
          {error}
        </p>
      )}

      <SummaryCards summary={summary} loading={loading} />

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium text-ink">All clients</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.08em] text-ink-muted focus:border-amber focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {loading ? (
          <p className="py-8 text-sm text-ink-muted">Loading clients…</p>
        ) : filtered.length === 0 ? (
          <div className="border border-[var(--color-border)] px-6 py-10 text-center">
            <p className="text-sm text-ink-muted">
              {statusFilter === 'all' ? 'No clients yet.' : `No ${statusFilter} clients.`}
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="mt-4 text-sm text-amber hover:underline"
            >
              Add the first one →
            </button>
          </div>
        ) : (
          <ClientsTable clients={filtered} />
        )}
      </div>

      {showAdd && (
        <AddClientModal
          onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); load() }}
        />
      )}
    </div>
  )
}

function SummaryCards({ summary, loading }: { summary: Summary; loading: boolean }) {
  const cards = [
    { label: 'Total leads', value: summary.leads },
    { label: 'Active clients', value: summary.active },
    { label: 'Overdue payments', value: summary.overduePayments, warn: summary.overduePayments > 0 },
    { label: 'Due in 30 days', value: summary.upcomingPayments },
    { label: 'Active builds', value: summary.activeBuilds },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
        >
          <p className="mb-2 text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">
            {c.label}
          </p>
          <p
            className={`text-2xl font-medium tabular-nums ${loading ? 'text-ink-subtle' : c.warn ? 'text-amber' : 'text-ink'}`}
          >
            {loading ? '—' : c.value}
          </p>
        </div>
      ))}
    </div>
  )
}

function ClientsTable({ clients }: { clients: DbClient[] }) {
  return (
    <div className="overflow-x-auto border border-[var(--color-border)]">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            {['Business', 'Name', 'Email', 'Status', 'Package', 'Pkg status', 'Next payment'].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle font-medium"
                >
                  {h}
                </th>
              ),
            )}
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => {
            const pkg = activePackageOf(c)
            return (
              <tr
                key={c.id}
                className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors"
              >
                <td className="px-4 py-3 font-medium text-ink">
                  {c.business_name || '—'}
                </td>
                <td className="px-4 py-3 text-ink-muted">{c.name}</td>
                <td className="px-4 py-3 text-ink-muted">
                  <a
                    href={`mailto:${c.email}`}
                    className="hover:text-amber transition-colors"
                  >
                    {c.email}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3 text-ink-muted">
                  {pkg ? (
                    <span>
                      <span className="text-[0.65rem] uppercase tracking-[0.06em] text-ink-subtle mr-1.5">
                        {pkg.package_type}
                      </span>
                      {pkg.package_name}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3">
                  {pkg ? <StatusBadge status={pkg.status} /> : '—'}
                </td>
                <td className="px-4 py-3 text-ink-muted tabular-nums">
                  {fmtDate(pkg?.next_payment_due_at ?? null)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/admin/clients/${c.id}`}
                    className="text-[0.7rem] uppercase tracking-[0.08em] text-amber hover:underline"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

interface AddClientForm {
  name: string
  business_name: string
  email: string
  phone: string
  website_url: string
  status: ClientStatus
  notes: string
}

function AddClientModal({
  onClose,
  onSaved,
}: {
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<AddClientForm>({
    name: '',
    business_name: '',
    email: '',
    phone: '',
    website_url: '',
    status: 'lead',
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof AddClientForm>(k: K, v: AddClientForm[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setSaving(true)
    setError(null)
    const { error: err } = await supabase.from('clients').insert({
      name: form.name.trim(),
      business_name: form.business_name.trim() || null,
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      website_url: form.website_url.trim() || null,
      status: form.status,
      notes: form.notes.trim() || null,
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    onSaved()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-medium text-ink">Add client</h2>
          <button
            onClick={onClose}
            className="text-sm text-ink-subtle hover:text-ink transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" required>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className={A_INPUT}
              />
            </Field>
            <Field label="Business name">
              <input
                type="text"
                value={form.business_name}
                onChange={(e) => set('business_name', e.target.value)}
                className={A_INPUT}
              />
            </Field>
            <Field label="Email" required>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className={A_INPUT}
              />
            </Field>
            <Field label="Phone">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                className={A_INPUT}
              />
            </Field>
            <Field label="Website URL" full>
              <input
                type="url"
                placeholder="https://"
                value={form.website_url}
                onChange={(e) => set('website_url', e.target.value)}
                className={A_INPUT}
              />
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as ClientStatus)}
                className={A_SELECT}
              >
                <option value="lead">Lead</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <Field label="Notes" full>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                className={A_INPUT}
              />
            </Field>
          </div>

          {error && (
            <p className="border border-amber/60 bg-amber/5 px-3 py-2 text-sm text-amber">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className={A_BTN_PRIMARY}>
              {saving ? 'Saving…' : 'Save client'}
            </button>
            <button type="button" onClick={onClose} className={A_BTN_GHOST}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ----- Shared admin utilities (used here and in detail page) -----

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

export function fmtDate(d: string | null | undefined): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function fmtCents(cents: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(cents / 100)
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
  children: React.ReactNode
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
