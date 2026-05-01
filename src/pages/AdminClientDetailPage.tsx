import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
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
import { supabase } from '@/lib/supabase'
import type { ClientStatus, PackageStatus, PaymentStatus, ProjectStage } from '@/types/backend'

// ----- Local DB types -----

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
  updated_at: string
}

interface DbPackage {
  id: string
  client_id: string
  package_name: string
  package_type: string
  status: string
  subtotal_cents: number
  discount_cents: number
  total_cents: number
  recurring_amount_cents: number | null
  next_payment_due_at: string | null
  payment_url: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
}

interface DbModuleSelection {
  id: string
  package_id: string
  module_id: string
  module_name: string
  quantity: number
  unit_price_cents: number
  total_cents: number
  created_at: string
}

interface DbPayment {
  id: string
  client_id: string
  package_id: string
  label: string
  amount_cents: number
  due_date: string | null
  status: string
  payment_url: string | null
  stripe_session_id: string | null
  stripe_payment_intent_id: string | null
  stripe_invoice_id: string | null
  paid_at: string | null
  created_at: string
}

interface DbUpdate {
  id: string
  client_id: string
  package_id: string | null
  stage: string
  title: string
  body: string | null
  visible_to_client: boolean
  created_at: string
}

interface DbEmailLog {
  id: string
  client_id: string | null
  to_email: string
  subject: string
  body: string | null
  status: string
  sent_at: string | null
  created_at: string
}

// ----- Main page -----

type TabId = 'overview' | 'package' | 'payments' | 'updates' | 'emails'

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'package', label: 'Package' },
  { id: 'payments', label: 'Payments' },
  { id: 'updates', label: 'Stage & Updates' },
  { id: 'emails', label: 'Emails' },
]

export function AdminClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <AdminShell title={id}>
      {id ? <Detail clientId={id} /> : <p className="text-sm text-ink-muted">No client ID.</p>}
    </AdminShell>
  )
}

function Detail({ clientId }: { clientId: string }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<TabId>('overview')

  const [client, setClient] = useState<DbClient | null>(null)
  const [packages, setPackages] = useState<DbPackage[]>([])
  const [moduleSelections, setModuleSelections] = useState<DbModuleSelection[]>([])
  const [payments, setPayments] = useState<DbPayment[]>([])
  const [updates, setUpdates] = useState<DbUpdate[]>([])
  const [emails, setEmails] = useState<DbEmailLog[]>([])

  const activePackage: DbPackage | null =
    packages.find((p) => p.status !== 'cancelled') ?? null

  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey((k) => k + 1)

  useEffect(() => {
    if (!supabase) return
    const sb = supabase
    Promise.resolve()
      .then(() => {
        setLoading(true)
        setError(null)
        return Promise.all([
          sb.from('clients').select('*').eq('id', clientId).single(),
          sb.from('client_packages').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
          sb.from('payment_schedules').select('*').eq('client_id', clientId).order('due_date', { ascending: true }),
          sb.from('project_updates').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
          sb.from('email_logs').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
        ])
      })
      .then(([cRes, pRes, payRes, uRes, eRes]) => {
        if (cRes.error) { setError(cRes.error.message); setLoading(false); return }

        const pkgs: DbPackage[] = (pRes.data as DbPackage[]) ?? []
        const active = pkgs.find((p) => p.status !== 'cancelled') ?? null

        setClient(cRes.data as DbClient)
        setPackages(pkgs)
        setPayments((payRes.data as DbPayment[]) ?? [])
        setUpdates((uRes.data as DbUpdate[]) ?? [])
        setEmails((eRes.data as DbEmailLog[]) ?? [])

        if (active) {
          sb.from('client_module_selections')
            .select('*')
            .eq('package_id', active.id)
            .order('created_at', { ascending: true })
            .then(({ data: modData }) => {
              setModuleSelections((modData as DbModuleSelection[]) ?? [])
              setLoading(false)
            })
        } else {
          setModuleSelections([])
          setLoading(false)
        }
      })
  }, [clientId, refreshKey])

  if (loading) return <p className="py-8 text-sm text-ink-muted">Loading…</p>
  if (error) return <p className="py-8 text-sm text-amber">Error: {error}</p>
  if (!client) return <p className="py-8 text-sm text-ink-muted">Client not found.</p>

  return (
    <div>
      <div className="mb-6 flex items-baseline gap-3">
        <Link to="/admin" className="text-sm text-ink-muted hover:text-amber transition-colors">
          ← All clients
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-medium text-ink">
          {client.business_name || client.name}
        </h1>
        <p className="text-sm text-ink-muted">{client.email}</p>
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 border-b border-[var(--color-border)] overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.08em] transition-colors ${
              tab === t.id
                ? 'border-amber text-amber'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {tab === 'overview' && (
        <OverviewTab client={client} onRefresh={refresh} />
      )}
      {tab === 'package' && (
        <PackageTab
          pkg={activePackage}
          allPackages={packages}
          moduleSelections={moduleSelections}
          onRefresh={refresh}
        />
      )}
      {tab === 'payments' && (
        <PaymentsTab
          payments={payments}
          clientId={clientId}
          packageId={activePackage?.id ?? null}
          onRefresh={refresh}
        />
      )}
      {tab === 'updates' && (
        <UpdatesTab
          updates={updates}
          clientId={clientId}
          packageId={activePackage?.id ?? null}
          currentStage={(updates[0]?.stage as ProjectStage) ?? null}
          onRefresh={refresh}
        />
      )}
      {tab === 'emails' && (
        <EmailsTab
          emails={emails}
          clientId={clientId}
          defaultToEmail={client.email}
          onRefresh={refresh}
        />
      )}
    </div>
  )
}

// =============================================================
// Tab: Overview
// =============================================================

function OverviewTab({
  client,
  onRefresh,
}: {
  client: DbClient
  onRefresh: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: client.name,
    business_name: client.business_name ?? '',
    email: client.email,
    phone: client.phone ?? '',
    website_url: client.website_url ?? '',
    status: client.status as ClientStatus,
    notes: client.notes ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function save() {
    if (!supabase) return
    setSaving(true)
    setError(null)
    const { error: err } = await supabase
      .from('clients')
      .update({
        name: form.name.trim(),
        business_name: form.business_name.trim() || null,
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
        website_url: form.website_url.trim() || null,
        status: form.status,
        notes: form.notes.trim() || null,
      })
      .eq('id', client.id)
    setSaving(false)
    if (err) { setError(err.message); return }
    setEditing(false)
    onRefresh()
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-ink">Client details</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className={A_BTN_GHOST}>
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" required>
              <input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} className={A_INPUT} />
            </Field>
            <Field label="Business name">
              <input type="text" value={form.business_name} onChange={(e) => set('business_name', e.target.value)} className={A_INPUT} />
            </Field>
            <Field label="Email" required>
              <input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} className={A_INPUT} />
            </Field>
            <Field label="Phone">
              <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={A_INPUT} />
            </Field>
            <Field label="Website URL" full>
              <input type="url" placeholder="https://" value={form.website_url} onChange={(e) => set('website_url', e.target.value)} className={A_INPUT} />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => set('status', e.target.value as ClientStatus)} className={A_SELECT}>
                <option value="lead">Lead</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <Field label="Notes" full>
              <textarea rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} className={A_INPUT} />
            </Field>
          </div>
          {error && <p className="border border-amber/60 bg-amber/5 px-3 py-2 text-sm text-amber">{error}</p>}
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className={A_BTN_PRIMARY}>{saving ? 'Saving…' : 'Save'}</button>
            <button onClick={() => setEditing(false)} className={A_BTN_GHOST}>Cancel</button>
          </div>
        </div>
      ) : (
        <dl className="divide-y divide-[var(--color-border)]">
          {[
            ['Name', client.name],
            ['Business', client.business_name ?? '—'],
            ['Email', client.email],
            ['Phone', client.phone ?? '—'],
            ['Website', client.website_url ?? '—'],
            ['Status', <StatusBadge key="s" status={client.status} />],
            ['Notes', client.notes ?? '—'],
            ['Created', fmtDate(client.created_at)],
          ].map(([label, value]) => (
            <div key={String(label)} className="flex gap-6 py-3 text-sm">
              <dt className="w-28 shrink-0 text-ink-subtle">{label}</dt>
              <dd className="text-ink-muted">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}

// =============================================================
// Tab: Package
// =============================================================

function PackageTab({
  pkg,
  allPackages,
  moduleSelections,
  onRefresh,
}: {
  pkg: DbPackage | null
  allPackages: DbPackage[]
  moduleSelections: DbModuleSelection[]
  onRefresh: () => void
}) {
  const [editForm, setEditForm] = useState<{
    status: PackageStatus
    payment_url: string
    next_payment_due_at: string
  } | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function startEdit() {
    if (!pkg) return
    setEditForm({
      status: pkg.status as PackageStatus,
      payment_url: pkg.payment_url ?? '',
      next_payment_due_at: pkg.next_payment_due_at ?? '',
    })
  }

  async function saveEdit() {
    if (!supabase || !pkg || !editForm) return
    setSaving(true)
    setError(null)
    const { error: err } = await supabase
      .from('client_packages')
      .update({
        status: editForm.status,
        payment_url: editForm.payment_url.trim() || null,
        next_payment_due_at: editForm.next_payment_due_at || null,
      })
      .eq('id', pkg.id)
    setSaving(false)
    if (err) { setError(err.message); return }
    setEditForm(null)
    onRefresh()
  }

  if (!pkg) {
    return (
      <EmptyState
        message="No active package for this client."
        sub="Packages are created from the /checkout flow or added in Supabase."
      />
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="border border-[var(--color-border)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="mb-1 text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">
              {pkg.package_type}
            </p>
            <h3 className="text-base font-medium text-ink">{pkg.package_name}</h3>
          </div>
          {!editForm && (
            <button onClick={startEdit} className={A_BTN_GHOST}>Edit</button>
          )}
        </div>

        {editForm ? (
          <div className="space-y-4">
            <Field label="Status">
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as PackageStatus })}
                className={A_SELECT}
              >
                {(['requested', 'scoped', 'in_progress', 'active', 'complete', 'cancelled'] as PackageStatus[]).map(
                  (s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>,
                )}
              </select>
            </Field>
            <Field label="Payment URL">
              <input
                type="url"
                placeholder="https://buy.stripe.com/..."
                value={editForm.payment_url}
                onChange={(e) => setEditForm({ ...editForm, payment_url: e.target.value })}
                className={A_INPUT}
              />
            </Field>
            <Field label="Next payment due">
              <input
                type="date"
                value={editForm.next_payment_due_at}
                onChange={(e) => setEditForm({ ...editForm, next_payment_due_at: e.target.value })}
                className={A_INPUT}
              />
            </Field>
            {error && <p className="text-sm text-amber border border-amber/60 bg-amber/5 px-3 py-2">{error}</p>}
            <div className="flex gap-3">
              <button onClick={saveEdit} disabled={saving} className={A_BTN_PRIMARY}>{saving ? 'Saving…' : 'Save'}</button>
              <button onClick={() => setEditForm(null)} className={A_BTN_GHOST}>Cancel</button>
            </div>
          </div>
        ) : (
          <dl className="divide-y divide-[var(--color-border)] text-sm">
            <Row label="Status"><StatusBadge status={pkg.status} /></Row>
            <Row label="Subtotal">{fmtCents(pkg.subtotal_cents)}</Row>
            {pkg.discount_cents > 0 && <Row label="Discount">-{fmtCents(pkg.discount_cents)}</Row>}
            <Row label="Total">{fmtCents(pkg.total_cents)}</Row>
            {pkg.recurring_amount_cents !== null && (
              <Row label="Recurring">{fmtCents(pkg.recurring_amount_cents)}/mo</Row>
            )}
            <Row label="Payment URL">
              {pkg.payment_url ? (
                <a href={pkg.payment_url} target="_blank" rel="noopener noreferrer" className="text-amber hover:underline break-all">
                  {pkg.payment_url}
                </a>
              ) : '—'}
            </Row>
            <Row label="Next payment due">{fmtDate(pkg.next_payment_due_at)}</Row>
          </dl>
        )}
      </div>

      {moduleSelections.length > 0 && (
        <div>
          <h3 className="mb-3 text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">
            Module selections
          </h3>
          <div className="overflow-x-auto border border-[var(--color-border)]">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                  {['Module', 'Qty', 'Unit price', 'Total'].map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-[0.62rem] uppercase tracking-[0.06em] text-ink-subtle font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {moduleSelections.map((m) => (
                  <tr key={m.id} className="border-b border-[var(--color-border)]">
                    <td className="px-4 py-2 text-ink-muted">{m.module_name}</td>
                    <td className="px-4 py-2 text-ink-muted tabular-nums">{m.quantity}</td>
                    <td className="px-4 py-2 text-ink-muted tabular-nums">{fmtCents(m.unit_price_cents)}</td>
                    <td className="px-4 py-2 font-medium text-ink tabular-nums">{fmtCents(m.total_cents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {allPackages.length > 1 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-[0.7rem] uppercase tracking-[0.08em] text-ink-subtle hover:text-ink">
            All packages ({allPackages.length})
          </summary>
          <ul className="mt-3 space-y-2">
            {allPackages.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 border border-[var(--color-border)] px-4 py-2">
                <span className="text-ink-muted">{p.package_name}</span>
                <StatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

// =============================================================
// Tab: Payments
// =============================================================

function PaymentsTab({
  payments,
  clientId,
  packageId,
  onRefresh,
}: {
  payments: DbPayment[]
  clientId: string
  packageId: string | null
  onRefresh: () => void
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({
    label: '',
    amount: '',
    due_date: '',
    status: 'not_started' as PaymentStatus,
    payment_url: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editUrl, setEditUrl] = useState<{ id: string; url: string } | null>(null)

  async function addPayment(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setSaving(true)
    setError(null)
    const { error: err } = await supabase.from('payment_schedules').insert({
      client_id: clientId,
      package_id: packageId,
      label: addForm.label.trim(),
      amount_cents: Math.round(parseFloat(addForm.amount || '0') * 100),
      due_date: addForm.due_date || null,
      status: addForm.status,
      payment_url: addForm.payment_url.trim() || null,
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    setShowAdd(false)
    setAddForm({ label: '', amount: '', due_date: '', status: 'not_started', payment_url: '' })
    onRefresh()
  }

  async function updateStatus(id: string, status: PaymentStatus) {
    if (!supabase) return
    await supabase
      .from('payment_schedules')
      .update({ status, paid_at: status === 'paid' ? new Date().toISOString() : null })
      .eq('id', id)
    onRefresh()
  }

  async function saveUrl(id: string, url: string) {
    if (!supabase) return
    await supabase.from('payment_schedules').update({ payment_url: url || null }).eq('id', id)
    setEditUrl(null)
    onRefresh()
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-ink">Payment schedules</h2>
        <button onClick={() => setShowAdd((v) => !v)} className={A_BTN_GHOST}>
          {showAdd ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addPayment} className="mb-6 border border-[var(--color-border)] p-4 space-y-3">
          <p className="text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">New payment</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Label" required>
              <input type="text" required placeholder="Deposit" value={addForm.label} onChange={(e) => setAddForm({ ...addForm, label: e.target.value })} className={A_INPUT} />
            </Field>
            <Field label="Amount (CAD)" required>
              <input type="number" required min="0" step="0.01" placeholder="0" value={addForm.amount} onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })} className={A_INPUT} />
            </Field>
            <Field label="Due date">
              <input type="date" value={addForm.due_date} onChange={(e) => setAddForm({ ...addForm, due_date: e.target.value })} className={A_INPUT} />
            </Field>
            <Field label="Status">
              <select value={addForm.status} onChange={(e) => setAddForm({ ...addForm, status: e.target.value as PaymentStatus })} className={A_SELECT}>
                {(['not_started', 'pending', 'paid', 'overdue', 'cancelled'] as PaymentStatus[]).map(
                  (s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>,
                )}
              </select>
            </Field>
            <Field label="Payment URL" full>
              <input type="url" placeholder="https://buy.stripe.com/..." value={addForm.payment_url} onChange={(e) => setAddForm({ ...addForm, payment_url: e.target.value })} className={A_INPUT} />
            </Field>
          </div>
          {error && <p className="text-sm text-amber border border-amber/60 bg-amber/5 px-3 py-2">{error}</p>}
          <button type="submit" disabled={saving} className={A_BTN_PRIMARY}>{saving ? 'Saving…' : 'Add payment'}</button>
        </form>
      )}

      {payments.length === 0 ? (
        <EmptyState message="No payment schedules yet." />
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <div key={p.id} className="border border-[var(--color-border)] p-4">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-ink">{p.label}</p>
                  <p className="text-sm text-ink-muted">
                    {fmtCents(p.amount_cents)} · Due {fmtDate(p.due_date)}
                    {p.paid_at && ` · Paid ${fmtDate(p.paid_at)}`}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </div>

              <div className="mb-3 grid gap-2 text-xs text-ink-subtle sm:grid-cols-3">
                <Meta label="Stripe session" value={p.stripe_session_id} />
                <Meta label="Payment intent" value={p.stripe_payment_intent_id} />
                <Meta label="Invoice" value={p.stripe_invoice_id} />
              </div>

              {/* Payment URL row */}
              {editUrl?.id === p.id ? (
                <div className="mb-3 flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editUrl.url}
                    onChange={(e) => setEditUrl({ id: p.id, url: e.target.value })}
                    className={A_INPUT}
                  />
                  <button onClick={() => saveUrl(p.id, editUrl.url)} className={A_BTN_PRIMARY}>Save</button>
                  <button onClick={() => setEditUrl(null)} className={A_BTN_GHOST}>✕</button>
                </div>
              ) : (
                <div className="mb-3 flex items-center gap-3 text-sm">
                  {p.payment_url ? (
                    <a href={p.payment_url} target="_blank" rel="noopener noreferrer" className="text-amber hover:underline truncate max-w-[30ch]">
                      {p.payment_url}
                    </a>
                  ) : (
                    <span className="text-ink-subtle">No payment URL</span>
                  )}
                  <button onClick={() => setEditUrl({ id: p.id, url: p.payment_url ?? '' })} className="text-[0.65rem] uppercase tracking-[0.06em] text-ink-subtle hover:text-amber">
                    {p.payment_url ? 'Edit URL' : 'Add URL'}
                  </button>
                </div>
              )}

              {/* Status actions */}
              <div className="flex gap-2">
                {p.status !== 'paid' && (
                  <button onClick={() => updateStatus(p.id, 'paid')} className={A_BTN_DANGER}>
                    Mark paid
                  </button>
                )}
                {p.status !== 'overdue' && p.status !== 'paid' && p.status !== 'cancelled' && (
                  <button onClick={() => updateStatus(p.id, 'overdue')} className={A_BTN_DANGER}>
                    Mark overdue
                  </button>
                )}
                {p.status !== 'not_started' && p.status !== 'paid' && (
                  <button onClick={() => updateStatus(p.id, 'not_started')} className={A_BTN_DANGER}>
                    Reset
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// =============================================================
// Tab: Stage & Updates
// =============================================================

const PROJECT_STAGES: ProjectStage[] = ['audit', 'scope', 'build', 'launch', 'support', 'complete']

function UpdatesTab({
  updates,
  clientId,
  packageId,
  currentStage,
  onRefresh,
}: {
  updates: DbUpdate[]
  clientId: string
  packageId: string | null
  currentStage: ProjectStage | null
  onRefresh: () => void
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    stage: (currentStage ?? 'audit') as ProjectStage,
    title: '',
    body: '',
    visible_to_client: true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function addUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setSaving(true)
    setError(null)
    const { error: err } = await supabase.from('project_updates').insert({
      client_id: clientId,
      package_id: packageId,
      stage: form.stage,
      title: form.title.trim(),
      body: form.body.trim() || null,
      visible_to_client: form.visible_to_client,
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    setShowAdd(false)
    setForm({ stage: form.stage, title: '', body: '', visible_to_client: true })
    onRefresh()
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-ink">Stage & updates</h2>
          {currentStage && (
            <p className="mt-1 text-sm text-ink-muted">
              Current stage: <span className="text-amber">{currentStage}</span>
            </p>
          )}
        </div>
        <button onClick={() => setShowAdd((v) => !v)} className={A_BTN_GHOST}>
          {showAdd ? 'Cancel' : '+ Add update'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addUpdate} className="mb-6 border border-[var(--color-border)] p-4 space-y-3">
          <p className="text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">New update</p>
          <Field label="Stage">
            <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value as ProjectStage })} className={A_SELECT}>
              {PROJECT_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Title" required>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={A_INPUT} />
          </Field>
          <Field label="Body">
            <textarea rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className={A_INPUT} placeholder="Details, next steps, links…" />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
            <input
              type="checkbox"
              checked={form.visible_to_client}
              onChange={(e) => setForm({ ...form, visible_to_client: e.target.checked })}
              className="h-3.5 w-3.5 accent-amber"
            />
            Visible to client in portal
          </label>
          {error && <p className="text-sm text-amber border border-amber/60 bg-amber/5 px-3 py-2">{error}</p>}
          <button type="submit" disabled={saving} className={A_BTN_PRIMARY}>{saving ? 'Saving…' : 'Add update'}</button>
        </form>
      )}

      {updates.length === 0 ? (
        <EmptyState message="No updates yet." />
      ) : (
        <div className="space-y-3">
          {updates.map((u) => (
            <div key={u.id} className="border border-[var(--color-border)] p-4">
              <div className="mb-2 flex items-start justify-between gap-4">
                <div>
                  <span className="mr-2 text-[0.62rem] uppercase tracking-[0.06em] text-amber">
                    {u.stage}
                  </span>
                  <span className="text-sm font-medium text-ink">{u.title}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!u.visible_to_client && (
                    <span className="text-[0.62rem] uppercase tracking-[0.06em] text-ink-subtle border border-[var(--color-border)] px-1.5 py-0.5">
                      internal
                    </span>
                  )}
                  <span className="text-xs text-ink-subtle">{fmtDate(u.created_at)}</span>
                </div>
              </div>
              {u.body && (
                <p className="text-sm leading-relaxed text-ink-muted whitespace-pre-line">{u.body}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// =============================================================
// Tab: Emails
// =============================================================

function EmailsTab({
  emails,
  clientId,
  defaultToEmail,
  onRefresh,
}: {
  emails: DbEmailLog[]
  clientId: string
  defaultToEmail: string
  onRefresh: () => void
}) {
  const [showCompose, setShowCompose] = useState(false)
  const [form, setForm] = useState({
    to_email: defaultToEmail,
    subject: '',
    body: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function saveDraft(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setSaving(true)
    setError(null)
    const { error: err } = await supabase.from('email_logs').insert({
      client_id: clientId,
      to_email: form.to_email.trim(),
      subject: form.subject.trim(),
      body: form.body.trim() || null,
      status: 'draft',
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    setShowCompose(false)
    setForm({ to_email: defaultToEmail, subject: '', body: '' })
    onRefresh()
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-ink">Emails</h2>
          <p className="mt-1 text-xs text-ink-subtle">
            Saved as drafts. Real sending wires up in a later pass.
          </p>
        </div>
        <button onClick={() => setShowCompose((v) => !v)} className={A_BTN_GHOST}>
          {showCompose ? 'Cancel' : '+ Compose'}
        </button>
      </div>

      {showCompose && (
        <form onSubmit={saveDraft} className="mb-6 border border-[var(--color-border)] p-4 space-y-3">
          <p className="text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">Compose email</p>
          <Field label="To" required>
            <input type="email" required value={form.to_email} onChange={(e) => setForm({ ...form, to_email: e.target.value })} className={A_INPUT} />
          </Field>
          <Field label="Subject" required>
            <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={A_INPUT} />
          </Field>
          <Field label="Body">
            <textarea rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className={A_INPUT} placeholder="Write the email…" />
          </Field>
          {error && <p className="text-sm text-amber border border-amber/60 bg-amber/5 px-3 py-2">{error}</p>}
          <button type="submit" disabled={saving} className={A_BTN_PRIMARY}>
            {saving ? 'Saving…' : 'Save as draft'}
          </button>
        </form>
      )}

      {emails.length === 0 ? (
        <EmptyState message="No emails logged yet." />
      ) : (
        <div className="space-y-3">
          {emails.map((e) => (
            <div key={e.id} className="border border-[var(--color-border)] p-4">
              <div className="mb-1 flex items-start justify-between gap-4">
                <p className="text-sm font-medium text-ink">{e.subject}</p>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={e.status} />
                  <span className="text-xs text-ink-subtle">{fmtDate(e.created_at)}</span>
                </div>
              </div>
              <p className="text-xs text-ink-subtle">To: {e.to_email}</p>
              {e.body && (
                <p className="mt-2 text-sm leading-relaxed text-ink-muted whitespace-pre-line line-clamp-3">
                  {e.body}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// =============================================================
// Shared small components
// =============================================================

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-6 py-2.5 text-sm">
      <dt className="w-32 shrink-0 text-ink-subtle">{label}</dt>
      <dd className="text-ink-muted">{children}</dd>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="border border-[var(--color-border)] px-3 py-2">
      <p className="mb-1 text-[0.62rem] uppercase tracking-[0.06em] text-ink-subtle">{label}</p>
      <p className="break-all text-ink-muted">{value ?? '—'}</p>
    </div>
  )
}

function EmptyState({ message, sub }: { message: string; sub?: string }) {
  return (
    <div className="border border-[var(--color-border)] px-6 py-10 text-center">
      <p className="text-sm text-ink-muted">{message}</p>
      {sub && <p className="mt-2 text-xs text-ink-subtle">{sub}</p>}
    </div>
  )
}
