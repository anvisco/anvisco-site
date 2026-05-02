import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AdminShell,
  A_INPUT,
  A_SELECT,
  A_BTN_PRIMARY,
  A_BTN_GHOST,
  A_BTN_DANGER,
} from '@/components/admin/AdminShell'
import { StatusBadge, Field } from '@/lib/adminUtils'
import { fmtDate, fmtCents } from '@/lib/adminFormatters'
import {
  deleteAdminClient,
  loadAdminClientDeletePreview,
  type AdminClientDeletePreview,
} from '@/lib/adminClientDeletion'
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

interface CleanupClientRow {
  id: string
  name: string
  business_name: string | null
  email: string
  status: string
  created_at: string
}

interface CleanupPackageRow {
  id: string
  client_id: string
  package_name: string
  package_type: string
  status: string
  total_cents: number
  recurring_amount_cents: number | null
  created_at: string
}

interface CleanupPaymentRow {
  id: string
  client_id: string
  package_id: string
  label: string
  amount_cents: number
  status: string
  due_date: string | null
  created_at: string
}

interface CleanupUpdateRow {
  id: string
  client_id: string
  package_id: string | null
  stage: string
  title: string
  created_at: string
}

interface CleanupModuleSelectionRow {
  id: string
  package_id: string
  module_name: string
  quantity: number
  total_cents: number
}

interface CleanupLinkRow {
  id: string
  client_id: string
  user_id: string
  created_at: string
}

interface CleanupPreview {
  email: string
  clients: CleanupClientRow[]
  packages: CleanupPackageRow[]
  payments: CleanupPaymentRow[]
  updates: CleanupUpdateRow[]
  moduleSelections: CleanupModuleSelectionRow[]
  clientUsers: CleanupLinkRow[]
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
        (p) => (p.status === 'in_progress' || p.status === 'active') && p.package_type === 'build',
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
  const [refreshKey, setRefreshKey] = useState(0)
  const [deletePreview, setDeletePreview] = useState<AdminClientDeletePreview | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null)
  const refresh = () => setRefreshKey((k) => k + 1)

  useEffect(() => {
    if (!supabase) {
      Promise.resolve().then(() => setLoading(false))
      return
    }
    const sb = supabase
    Promise.resolve()
      .then(() => {
        setLoading(true)
        setError(null)
        return Promise.all([
          sb
            .from('clients')
            .select(
              'id, name, business_name, email, phone, website_url, status, notes, created_at, client_packages(id, package_name, package_type, status, next_payment_due_at)',
            )
            .order('created_at', { ascending: false }),
          sb.from('payment_schedules').select('id, client_id, status, due_date, amount_cents'),
        ])
      })
      .then(([clientsRes, paymentsRes]) => {
        if (clientsRes.error) { setError(clientsRes.error.message); setLoading(false); return }
        if (paymentsRes.error) { setError(paymentsRes.error.message); setLoading(false); return }
        setClients((clientsRes.data as DbClient[]) ?? [])
        setPayments((paymentsRes.data as DbPayment[]) ?? [])
        setLoading(false)
      })
  }, [refreshKey])

  const summary = computeSummary(clients, payments)
  const filtered = statusFilter === 'all'
    ? clients
    : clients.filter((c) => c.status === statusFilter)

  async function openDeleteClient(clientId: string) {
    setDeleteLoading(true)
    setDeleteError(null)
    setDeleteMessage(null)
    try {
      const preview = await loadAdminClientDeletePreview(clientId)
      setDeletePreview(preview)
    } catch (thrownError) {
      setDeletePreview(null)
      setDeleteError(thrownError instanceof Error ? thrownError.message : 'Could not load client details.')
    } finally {
      setDeleteLoading(false)
    }
  }

  async function confirmDeleteClient() {
    if (!deletePreview) return
    setDeleteLoading(true)
    setDeleteError(null)
    setDeleteMessage(null)
    try {
      await deleteAdminClient(deletePreview.client.id)
      setDeletePreview(null)
      setDeleteMessage(
        `Deleted ${deletePreview.client.business_name || deletePreview.client.name} and related records.`,
      )
      refresh()
    } catch (thrownError) {
      setDeleteError(thrownError instanceof Error ? thrownError.message : 'Could not delete client.')
    } finally {
      setDeleteLoading(false)
    }
  }

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
      {deleteError && (
        <p className="mb-6 border border-amber/60 bg-amber/5 px-3 py-2 text-sm text-amber">
          {deleteError}
        </p>
      )}
      {deleteMessage && (
        <p className="mb-6 border border-amber/60 bg-amber/5 px-3 py-2 text-sm text-amber">
          {deleteMessage}
        </p>
      )}

      <SummaryCards summary={summary} loading={loading} />
      <TestDataCleanupPanel onDeleted={refresh} />

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
          <ClientsTable clients={filtered} onDelete={openDeleteClient} deleting={deleteLoading} />
        )}
      </div>

      {deletePreview && (
        <DeleteClientModal
          preview={deletePreview}
          loading={deleteLoading}
          onClose={() => {
            setDeletePreview(null)
            setDeleteError(null)
          }}
          onConfirm={() => void confirmDeleteClient()}
        />
      )}

      {showAdd && (
        <AddClientModal
          onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); refresh() }}
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

function TestDataCleanupPanel({ onDeleted }: { onDeleted: () => void }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [preview, setPreview] = useState<CleanupPreview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handlePreview() {
    if (!supabase) {
      setError('Supabase is not configured.')
      return
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) {
      setError('Enter a client email to preview cleanup records.')
      return
    }

    setLoading(true)
    setError(null)
    setMessage(null)
    setConfirmDelete(false)

    try {
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, name, business_name, email, status, created_at')
        .ilike('email', normalizedEmail)
        .order('created_at', { ascending: false })

      if (clientsError) throw clientsError

      const clients = (clientsData as CleanupClientRow[]) ?? []
      const clientIds = clients.map((client) => client.id)

      const [packagesRes, paymentsRes, updatesRes, clientUsersRes] = await Promise.all([
        clientIds.length
          ? supabase
              .from('client_packages')
              .select('id, client_id, package_name, package_type, status, total_cents, recurring_amount_cents, created_at')
              .in('client_id', clientIds)
              .order('created_at', { ascending: false })
          : Promise.resolve({ data: [], error: null }),
        clientIds.length
          ? supabase
              .from('payment_schedules')
              .select('id, client_id, package_id, label, amount_cents, status, due_date, created_at')
              .in('client_id', clientIds)
              .order('created_at', { ascending: false })
          : Promise.resolve({ data: [], error: null }),
        clientIds.length
          ? supabase
              .from('project_updates')
              .select('id, client_id, package_id, stage, title, created_at')
              .in('client_id', clientIds)
              .order('created_at', { ascending: false })
          : Promise.resolve({ data: [], error: null }),
        clientIds.length
          ? supabase
              .from('client_users')
              .select('id, client_id, user_id, created_at')
              .in('client_id', clientIds)
              .order('created_at', { ascending: false })
          : Promise.resolve({ data: [], error: null }),
      ])

      if (packagesRes.error) throw packagesRes.error
      if (paymentsRes.error) throw paymentsRes.error
      if (updatesRes.error) throw updatesRes.error
      if (clientUsersRes.error) throw clientUsersRes.error

      const packages = (packagesRes.data as CleanupPackageRow[]) ?? []
      const packageIds = packages.map((pkg) => pkg.id)

      const moduleSelections = packageIds.length
        ? (
            (
              await supabase
                .from('client_module_selections')
                .select('id, package_id, module_name, quantity, total_cents')
                .in('package_id', packageIds)
                .order('created_at', { ascending: false })
            ).data as CleanupModuleSelectionRow[]
          ) ?? []
        : []

      setPreview({
        email: normalizedEmail,
        clients,
        packages,
        payments: (paymentsRes.data as CleanupPaymentRow[]) ?? [],
        updates: (updatesRes.data as CleanupUpdateRow[]) ?? [],
        moduleSelections,
        clientUsers: (clientUsersRes.data as CleanupLinkRow[]) ?? [],
      })
    } catch (thrownError) {
      setPreview(null)
      setError(thrownError instanceof Error ? thrownError.message : 'Could not preview cleanup records.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!supabase || !preview) return
    if (!confirmDelete) {
      setError('Confirm the deletion checkbox before removing records.')
      return
    }

    const clientIds = preview.clients.map((client) => client.id)
    const packageIds = preview.packages.map((pkg) => pkg.id)

    setDeleting(true)
    setError(null)
    setMessage(null)

    try {
      if (clientIds.length) {
        const deleteSteps = [
          supabase.from('project_updates').delete().in('client_id', clientIds),
          supabase.from('payment_schedules').delete().in('client_id', clientIds),
          packageIds.length
            ? supabase.from('client_module_selections').delete().in('package_id', packageIds)
            : Promise.resolve({ error: null }),
          supabase.from('client_packages').delete().in('client_id', clientIds),
          supabase.from('client_users').delete().in('client_id', clientIds),
          supabase.from('clients').delete().in('id', clientIds),
        ]

        for (const step of deleteSteps) {
          const result = await step
          if (result.error) {
            throw new Error(result.error.message)
          }
        }
      }

      setMessage(
        preview.clients.length > 1
          ? `Deleted ${preview.clients.length} client records and related test data.`
          : 'Deleted the matching client record and related test data.',
      )
      setPreview(null)
      setConfirmDelete(false)
      setEmail('')
      onDeleted()
    } catch (thrownError) {
      setError(thrownError instanceof Error ? thrownError.message : 'Could not delete cleanup records.')
    } finally {
      setDeleting(false)
    }
  }

  const counts = preview
    ? {
        clients: preview.clients.length,
        packages: preview.packages.length,
        payments: preview.payments.length,
        modules: preview.moduleSelections.length,
        updates: preview.updates.length,
        links: preview.clientUsers.length,
      }
    : null

  return (
    <section className="mt-8 border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div className="mb-4 border-t border-[var(--color-border)] pt-5">
        <p className="mb-2 text-[0.7rem] uppercase tracking-[0.08em] text-ink-subtle">
          Advanced cleanup
        </p>
        <h2 className="text-lg font-medium tracking-[-0.01em] text-ink">Email cleanup</h2>
      </div>

      <p className="max-w-[68ch] text-sm leading-relaxed text-ink-muted">
        Optional fallback for exact-email cleanup when you need to remove a test client by email.
        This removes project updates, payment schedules, module selections, packages, client-user
        links, and the client record itself. Stripe test events and email logs are left untouched
        for audit history.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <Field label="Client email" required full>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={A_INPUT}
            placeholder="test@example.com"
          />
        </Field>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void handlePreview()}
            disabled={loading}
            className={A_BTN_PRIMARY}
          >
            {loading ? 'Previewing…' : 'Preview cleanup'}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 border border-amber/60 bg-amber/5 px-3 py-2 text-sm text-amber">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-4 border border-amber/60 bg-amber/5 px-3 py-2 text-sm text-amber">
          {message}
        </p>
      )}

      {counts && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <StatBox label="Clients" value={counts.clients} />
          <StatBox label="Packages" value={counts.packages} />
          <StatBox label="Payments" value={counts.payments} />
          <StatBox label="Modules" value={counts.modules} />
          <StatBox label="Updates" value={counts.updates} />
          <StatBox label="Links" value={counts.links} />
        </div>
      )}

      {preview && (
        <div className="mt-6 space-y-4">
          {preview.clients.length === 0 ? (
            <div className="border border-[var(--color-border)] px-4 py-5 text-sm text-ink-muted">
              No matching clients were found for <span className="text-ink">{preview.email}</span>.
            </div>
          ) : (
            preview.clients.map((client) => {
              const clientPackages = preview.packages.filter((pkg) => pkg.client_id === client.id)
              const clientPayments = preview.payments.filter((payment) => payment.client_id === client.id)
              const clientUpdates = preview.updates.filter((update) => update.client_id === client.id)
              const clientLinks = preview.clientUsers.filter((link) => link.client_id === client.id)
              const packageIds = clientPackages.map((pkg) => pkg.id)
              const clientModules = preview.moduleSelections.filter((selection) =>
                packageIds.includes(selection.package_id),
              )

              return (
                <article key={client.id} className="border border-[var(--color-border)] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {client.business_name || client.name}
                      </p>
                      <p className="mt-1 text-xs text-ink-subtle">{client.email}</p>
                      <p className="mt-1 text-xs text-ink-muted">
                        Status: <span className="text-ink">{client.status}</span> · Created{' '}
                        <span className="text-ink">{fmtDate(client.created_at)}</span>
                      </p>
                    </div>
                    <div className="text-xs text-ink-muted">
                      {clientPackages.length} packages · {clientPayments.length} payments ·{' '}
                      {clientUpdates.length} updates · {clientModules.length} module rows ·{' '}
                      {clientLinks.length} auth links
                    </div>
                  </div>

                  {clientPackages.length > 0 && (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {clientPackages.map((pkg) => (
                        <div key={pkg.id} className="border border-[var(--color-border)] p-3">
                          <p className="text-sm text-ink">{pkg.package_name}</p>
                          <p className="mt-1 text-xs text-ink-muted">
                            {pkg.package_type} · {pkg.status}
                          </p>
                          <p className="mt-1 text-xs text-ink-muted">
                            Total {fmtCents(pkg.total_cents)}
                            {pkg.recurring_amount_cents !== null
                              ? ` · Recurring ${fmtCents(pkg.recurring_amount_cents)}/mo`
                              : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <PreviewList
                      title="Payments"
                      items={clientPayments.map(
                        (payment) => `${payment.label} · ${payment.status} · ${fmtCents(payment.amount_cents)}`,
                      )}
                    />
                    <PreviewList
                      title="Updates"
                      items={clientUpdates.map((update) => `${update.title} · ${update.stage}`)}
                    />
                    <PreviewList
                      title="Module rows"
                      items={clientModules.map(
                        (selection) =>
                          `${selection.module_name}${selection.quantity > 1 ? ` × ${selection.quantity}` : ''} · ${fmtCents(selection.total_cents)}`,
                      )}
                    />
                  </div>
                </article>
              )
            })
          )}

          {preview.clients.length > 0 && (
            <div className="border border-amber/30 bg-amber/5 p-4">
              <label className="flex items-start gap-3 text-sm text-ink-muted">
                <input
                  type="checkbox"
                  checked={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-amber"
                />
                <span>I understand this deletes matching test records.</span>
              </label>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void handleDelete()}
                  disabled={!confirmDelete || deleting}
                  className={A_BTN_DANGER}
                >
                  {deleting ? 'Deleting…' : 'Delete matching records'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
      <p className="mb-2 text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">{label}</p>
      <p className="text-xl font-medium text-ink tabular-nums">{value}</p>
    </div>
  )
}

function PreviewList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-[var(--color-border)] p-3">
      <p className="mb-2 text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">{title}</p>
      {items.length > 0 ? (
        <ul className="space-y-1 text-xs leading-relaxed text-ink-muted">
          {items.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-ink-subtle">None</p>
      )}
    </div>
  )
}

function ClientsTable({
  clients,
  onDelete,
  deleting,
}: {
  clients: DbClient[]
  onDelete: (clientId: string) => Promise<void>
  deleting: boolean
}) {
  return (
    <div className="overflow-x-auto border border-[var(--color-border)]">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            {['Business', 'Name', 'Email', 'Status', 'Package', 'Pkg status', 'Next payment', ''].map(
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
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/admin/clients/${c.id}`}
                      className="text-[0.7rem] uppercase tracking-[0.08em] text-amber hover:underline"
                    >
                      View →
                    </Link>
                    <button
                      type="button"
                      onClick={() => void onDelete(c.id)}
                      disabled={deleting}
                      className="text-[0.7rem] uppercase tracking-[0.08em] text-ink-subtle transition-colors hover:text-amber disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete Client
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function DeleteClientModal({
  preview,
  loading,
  onClose,
  onConfirm,
}: {
  preview: AdminClientDeletePreview
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  const name = preview.client.business_name || preview.client.name
  const counts = [
    { label: 'Packages', value: preview.packages.length },
    { label: 'Payments', value: preview.payments.length },
    { label: 'Updates', value: preview.updates.length },
    { label: 'Module rows', value: preview.moduleSelections.length },
    { label: 'Links', value: preview.clientUsers.length },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 border-t border-[var(--color-border)] pt-5">
          <p className="mb-2 text-[0.7rem] uppercase tracking-[0.08em] text-ink-subtle">
            Confirm delete
          </p>
          <h2 className="text-lg font-medium tracking-[-0.01em] text-ink">Delete Client</h2>
        </div>

        <p className="max-w-[60ch] text-sm leading-relaxed text-ink-muted">
          This will delete the selected client and related test/project records. This cannot be
          undone.
        </p>

        <div className="mt-5 border border-[var(--color-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-ink">{name}</p>
              <p className="mt-1 text-xs text-ink-subtle">{preview.client.email}</p>
            </div>
            <p className="text-xs uppercase tracking-[0.08em] text-ink-subtle">
              Created {fmtDate(preview.client.created_at)}
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {counts.map((item) => (
              <div key={item.label} className="border border-[var(--color-border)] p-3">
                <p className="text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">
                  {item.label}
                </p>
                <p className="mt-2 text-xl font-medium tabular-nums text-ink">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={A_BTN_DANGER}
          >
            {loading ? 'Deleting…' : 'Delete Client'}
          </button>
          <button type="button" onClick={onClose} className={A_BTN_GHOST}>
            Cancel
          </button>
        </div>
      </div>
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
