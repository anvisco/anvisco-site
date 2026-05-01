import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { BracketLabel } from '@/components/ui/BracketLabel'
import {
  AUDIT_OFFERS,
  BUILD_OFFERS,
  FOUNDING_RATE_NOTE,
  MODULE_OFFERS,
  RECURRING_OFFERS,
  type AuditId,
  type BuildId,
  type ModuleId,
  type RecurringId,
} from '@/data/offers'
import {
  calculateBundleDiscount,
  calculateModuleSubtotal,
  calculateModuleTotal,
  formatCurrency,
  hasBundleDiscount,
  normalizeModuleQuantity,
  type SelectedModule,
} from '@/lib/pricing'
import {
  isSupabaseConfigured,
  supabase,
  SUPABASE_NOT_CONFIGURED_MESSAGE,
} from '@/lib/supabase'

type Path = 'audit' | 'modules' | 'build' | 'recurring'

const PATHS: { id: Path; label: string; blurb: string }[] = [
  { id: 'audit', label: 'Audit', blurb: 'Start with a focused review or a free snapshot.' },
  { id: 'modules', label: 'Modules', blurb: 'Upgrade specific layers. 3+ modules save 15%.' },
  { id: 'build', label: 'Full Build', blurb: 'Custom-coded site, three tiers.' },
  { id: 'recurring', label: 'Care Plan', blurb: 'Care or Growth, monthly.' },
]

interface ClientDetails {
  name: string
  businessName: string
  email: string
  phone: string
  websiteUrl: string
  notes: string
}

const EMPTY_DETAILS: ClientDetails = {
  name: '',
  businessName: '',
  email: '',
  phone: '',
  websiteUrl: '',
  notes: '',
}

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'error'; message: string }

const INPUT_CLASS =
  'w-full border border-[var(--color-border-strong)] bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-amber focus:outline-none'

const CHECKOUT_ERROR_MESSAGE =
  'Stripe checkout could not be created. Please try again or contact brian@anvisco.com.'

export function CheckoutPage() {
  const [searchParams] = useSearchParams()

  // Path selection (deep-linkable: /checkout?path=modules)
  const initialPath = ((): Path => {
    const p = searchParams.get('path')
    return p === 'audit' || p === 'modules' || p === 'build' || p === 'recurring'
      ? p
      : 'modules'
  })()
  const [path, setPath] = useState<Path>(initialPath)

  // Per-path state
  // Keep auditId so the package payload reads cleanly when additional audit
  // options are added.
  const [auditId] = useState<AuditId>('full-audit')
  const [moduleQty, setModuleQty] = useState<Record<string, number>>({})
  const [buildId, setBuildId] = useState<BuildId>('standard')
  const [recurringId, setRecurringId] = useState<RecurringId>('care')

  const [details, setDetails] = useState<ClientDetails>(EMPTY_DETAILS)
  const [submit, setSubmit] = useState<SubmitState>({ kind: 'idle' })

  // ---------- Module helpers ----------
  const selectedModules: SelectedModule[] = useMemo(
    () =>
      Object.entries(moduleQty)
        .filter(([, q]) => q > 0)
        .map(([id, q]) => ({ id, quantity: q })),
    [moduleQty],
  )

  const moduleSubtotal = calculateModuleSubtotal(selectedModules)
  const bundleDiscount = calculateBundleDiscount(selectedModules)
  const moduleTotal = calculateModuleTotal(selectedModules)
  const bundleActive = hasBundleDiscount(selectedModules)

  function toggleModule(id: ModuleId) {
    setModuleQty((prev) => {
      const current = prev[id] ?? 0
      if (current > 0) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: normalizeModuleQuantity(id, 1) }
    })
  }

  function setModuleQuantity(id: ModuleId, raw: number) {
    setModuleQty((prev) => ({ ...prev, [id]: normalizeModuleQuantity(id, raw) }))
  }

  // ---------- Submit ----------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!details.name.trim() || !details.email.trim()) {
      setSubmit({ kind: 'error', message: 'Name and email are required.' })
      return
    }

    if (path === 'modules' && selectedModules.length === 0) {
      setSubmit({ kind: 'error', message: 'Select at least one module.' })
      return
    }

    if (!isSupabaseConfigured || !supabase) {
      setSubmit({ kind: 'error', message: SUPABASE_NOT_CONFIGURED_MESSAGE })
      return
    }

    setSubmit({ kind: 'submitting' })

    let redirected = false
    try {
      const payload = {
        package_type: path,
        selected_audit: path === 'audit' ? 'full-audit' : undefined,
        selected_modules:
          path === 'modules'
            ? selectedModules.map((module) => ({
                module_id: module.id,
                quantity: module.quantity,
              }))
            : undefined,
        selected_build: path === 'build' ? buildId : undefined,
        selected_plan: path === 'recurring' ? recurringId : undefined,
        name: details.name.trim(),
        business_name: details.businessName.trim() || undefined,
        email: details.email.trim().toLowerCase(),
        phone: details.phone.trim() || undefined,
        website_url: details.websiteUrl.trim() || undefined,
        notes: details.notes.trim() || undefined,
        success_url: new URL('/checkout/success', window.location.origin).toString(),
        cancel_url: new URL('/checkout', window.location.origin).toString(),
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: payload,
        timeout: 20_000,
      })

      if (error) throw error

      const sessionUrl = typeof data?.url === 'string' ? data.url : null
      if (!sessionUrl) {
        throw new Error('Stripe checkout URL was not returned.')
      }

      redirected = true
      window.location.assign(sessionUrl)
    } catch (err) {
      console.error('Stripe checkout session creation failed', {
        name: err instanceof Error ? err.name : 'UnknownError',
        message: err instanceof Error ? err.message : String(err),
      })
      setSubmit({ kind: 'error', message: CHECKOUT_ERROR_MESSAGE })
    } finally {
      if (!redirected) {
        setSubmit((current) => (current.kind === 'submitting' ? { kind: 'idle' } : current))
      }
    }
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen pt-16 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-12 lg:py-24">
          <Link
            to="/services"
            className="mb-12 inline-flex items-center gap-2 text-[0.7rem] tracking-[0.1em] uppercase text-ink-muted transition-colors duration-150 hover:text-amber"
          >
            ← Back to services
          </Link>

          <div className="mb-14 border-t border-[var(--color-border)] pt-7">
            <div className="mb-6 flex items-center gap-4">
              <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">/</span>
              <BracketLabel>Build your plan</BracketLabel>
            </div>
            <h1 className="mb-5 max-w-[14ch] text-[2.5rem] font-medium leading-[1.04] tracking-[-0.03em] text-ink md:text-[4rem]">
              Build your plan.
            </h1>
            <p className="max-w-[58ch] text-base leading-relaxed text-ink-muted md:text-[1.0625rem]">
              Choose your path and continue to secure checkout. Payment happens through Stripe.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid items-start gap-10 lg:grid-cols-[1fr_390px]">
            <div className="space-y-10">
              <PathPicker path={path} setPath={setPath} />

              {path === 'audit' && <AuditSection />}

              {path === 'modules' && (
                <ModulesSection
                  moduleQty={moduleQty}
                  toggleModule={toggleModule}
                  setModuleQuantity={setModuleQuantity}
                />
              )}

              {path === 'build' && (
                <BuildSection buildId={buildId} setBuildId={setBuildId} />
              )}

              {path === 'recurring' && (
                <RecurringSection
                  recurringId={recurringId}
                  setRecurringId={setRecurringId}
                />
              )}

              <ClientDetailsSection details={details} setDetails={setDetails} />
            </div>

            <Summary
              path={path}
              auditId={auditId}
              moduleSubtotal={moduleSubtotal}
              bundleDiscount={bundleDiscount}
              moduleTotal={moduleTotal}
              bundleActive={bundleActive}
              selectedModulesCount={selectedModules.length}
              buildId={buildId}
              recurringId={recurringId}
              submit={submit}
            />
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

// =============================================================
// Sub-components
// =============================================================

function PathPicker({ path, setPath }: { path: Path; setPath: (p: Path) => void }) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <BracketLabel>1. Choose a path</BracketLabel>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {PATHS.map((p) => {
          const selected = path === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPath(p.id)}
              className={`min-h-[112px] border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/55 ${
                selected
                  ? 'border-amber/70 bg-[var(--color-surface)]'
                  : 'border-[var(--color-border)] bg-transparent'
              }`}
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <span className="text-base font-medium text-ink">{p.label}</span>
                <span
                  className={`mt-1 h-2.5 w-2.5 shrink-0 border ${
                    selected ? 'border-amber bg-amber' : 'border-[var(--color-border-strong)]'
                  }`}
                  aria-hidden="true"
                />
              </div>
              <p className="text-sm leading-relaxed text-ink-muted">{p.blurb}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function AuditSection() {
  const fullAudit = AUDIT_OFFERS.find((a) => a.id === 'full-audit')!
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <BracketLabel>2. Audit</BracketLabel>
      </div>
      <div className="border border-amber/70 bg-[var(--color-surface)] p-6">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-medium tracking-[-0.01em] text-ink">
            {fullAudit.name} — {formatCurrency(fullAudit.price)}
          </h2>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-ink-muted">{fullAudit.description}</p>
        <p className="text-sm leading-relaxed text-ink-muted">
          <span className="text-ink">Credit:</span> if you move forward with a module or build
          within 30 days, the audit fee is applied to that project.
        </p>
      </div>
      <p className="mt-4 text-sm text-ink-muted">
        Want the free Snapshot instead?{' '}
        <Link to="/audit" className="text-amber hover:underline">
          Get Free Audit →
        </Link>
      </p>
    </section>
  )
}

function ModulesSection({
  moduleQty,
  toggleModule,
  setModuleQuantity,
}: {
  moduleQty: Record<string, number>
  toggleModule: (id: ModuleId) => void
  setModuleQuantity: (id: ModuleId, q: number) => void
}) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-3">
        <BracketLabel>2. Pick modules</BracketLabel>
        <span className="text-[0.7rem] uppercase tracking-[0.08em] text-ink-subtle">
          3+ modules save 15%
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {MODULE_OFFERS.map((offer) => {
          const qty = moduleQty[offer.id] ?? 0
          const selected = qty > 0
          const min = offer.minQuantity ?? 1
          return (
            <div
              key={offer.id}
              className={`min-h-[200px] border p-5 transition-all duration-200 hover:border-amber/55 ${
                selected
                  ? 'border-amber/70 bg-[var(--color-surface)]'
                  : 'border-[var(--color-border)] bg-transparent'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleModule(offer.id)}
                className="mb-3 flex w-full items-start justify-between gap-3 text-left"
              >
                <span className="text-base font-medium text-ink">{offer.name}</span>
                <span
                  className={`mt-1 h-2.5 w-2.5 shrink-0 border ${
                    selected ? 'border-amber bg-amber' : 'border-[var(--color-border-strong)]'
                  }`}
                  aria-hidden="true"
                />
              </button>
              <p className="mb-4 text-sm leading-relaxed text-ink-muted">{offer.description}</p>
              <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3">
                <span className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-amber">
                  {formatCurrency(offer.price)}
                  {offer.unit ? ` ${offer.unit}` : ''}
                </span>
                {selected && offer.unit ? (
                  <label className="flex items-center gap-2 text-xs text-ink-muted">
                    <span>Pages</span>
                    <input
                      type="number"
                      min={min}
                      value={qty}
                      onChange={(e) =>
                        setModuleQuantity(offer.id, parseInt(e.target.value || '0', 10))
                      }
                      className="w-16 border border-[var(--color-border-strong)] bg-transparent px-2 py-1 text-sm text-ink tabular-nums focus:border-amber focus:outline-none"
                    />
                  </label>
                ) : null}
              </div>
              {selected && offer.minQuantity ? (
                <p className="mt-2 text-[0.7rem] text-ink-subtle">
                  Minimum {offer.minQuantity} pages.
                </p>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function BuildSection({
  buildId,
  setBuildId,
}: {
  buildId: BuildId
  setBuildId: (id: BuildId) => void
}) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <BracketLabel>2. Choose a tier</BracketLabel>
      </div>
      <div className="grid gap-3">
        {BUILD_OFFERS.map((tier) => {
          const selected = buildId === tier.id
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => setBuildId(tier.id)}
              className={`border p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/55 ${
                selected
                  ? 'border-amber/70 bg-[var(--color-surface)]'
                  : 'border-[var(--color-border)] bg-transparent'
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-medium text-ink">
                    {tier.name}
                    {tier.recommended && (
                      <span className="ml-3 text-[0.65rem] uppercase tracking-[0.1em] text-amber">
                        recommended
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">{tier.delivery}</p>
                </div>
                <span
                  className={`mt-1 h-2.5 w-2.5 shrink-0 border ${
                    selected ? 'border-amber bg-amber' : 'border-[var(--color-border-strong)]'
                  }`}
                  aria-hidden="true"
                />
              </div>
              <div className="grid gap-3 border-y border-[var(--color-border)] py-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-[0.65rem] uppercase tracking-[0.1em] text-ink-subtle">
                    Founding rate
                  </p>
                  <p className="text-2xl font-medium tracking-[-0.02em] text-amber tabular-nums">
                    {formatCurrency(tier.foundingPrice)}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-[0.65rem] uppercase tracking-[0.1em] text-ink-subtle">
                    Public rate
                  </p>
                  <p className="text-base text-ink tabular-nums">
                    {formatCurrency(tier.publicPrice)}
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-ink-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-[var(--color-border-strong)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>
      <p className="mt-4 text-sm text-ink-muted">{FOUNDING_RATE_NOTE}</p>
    </section>
  )
}

function RecurringSection({
  recurringId,
  setRecurringId,
}: {
  recurringId: RecurringId
  setRecurringId: (id: RecurringId) => void
}) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <BracketLabel>2. Choose a plan</BracketLabel>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {RECURRING_OFFERS.map((plan) => {
          const selected = recurringId === plan.id
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setRecurringId(plan.id)}
              className={`flex flex-col border p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/55 ${
                selected
                  ? 'border-amber/70 bg-[var(--color-surface)]'
                  : 'border-[var(--color-border)] bg-transparent'
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="text-base font-medium text-ink">{plan.name}</p>
                <span
                  className={`mt-1 h-2.5 w-2.5 shrink-0 border ${
                    selected ? 'border-amber bg-amber' : 'border-[var(--color-border-strong)]'
                  }`}
                  aria-hidden="true"
                />
              </div>
              <p className="mb-4">
                <span className="text-2xl font-medium tracking-[-0.02em] text-amber tabular-nums">
                  {formatCurrency(plan.monthlyPrice)}
                </span>
                <span className="ml-2 text-sm text-ink-muted">/ month</span>
              </p>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-ink-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-[var(--color-border-strong)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function ClientDetailsSection({
  details,
  setDetails,
}: {
  details: ClientDetails
  setDetails: (d: ClientDetails) => void
}) {
  function update<K extends keyof ClientDetails>(key: K, value: ClientDetails[K]) {
    setDetails({ ...details, [key]: value })
  }

  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <BracketLabel>3. Your details</BracketLabel>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" required>
          <input
            type="text"
            required
            value={details.name}
            onChange={(e) => update('name', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Business name">
          <input
            type="text"
            value={details.businessName}
            onChange={(e) => update('businessName', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Email" required>
          <input
            type="email"
            required
            value={details.email}
            onChange={(e) => update('email', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Phone (optional)">
          <input
            type="tel"
            value={details.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Website URL" full>
          <input
            type="url"
            placeholder="https://"
            value={details.websiteUrl}
            onChange={(e) => update('websiteUrl', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Notes (optional)" full>
          <textarea
            rows={4}
            value={details.notes}
            onChange={(e) => update('notes', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
      </div>
    </section>
  )
}

function Field({
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
    <label className={`flex flex-col gap-2 ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-[0.7rem] uppercase tracking-[0.1em] text-ink-subtle">
        {label}
        {required && <span className="ml-1 text-amber">*</span>}
      </span>
      {children}
    </label>
  )
}

function Summary(props: {
  path: Path
  auditId: AuditId
  moduleSubtotal: number
  bundleDiscount: number
  moduleTotal: number
  bundleActive: boolean
  selectedModulesCount: number
  buildId: BuildId
  recurringId: RecurringId
  submit: SubmitState
}) {
  const {
    path,
    auditId,
    moduleSubtotal,
    bundleDiscount,
    moduleTotal,
    bundleActive,
    selectedModulesCount,
    buildId,
    recurringId,
    submit,
  } = props

  const { headline, primary, secondary } = useMemo(() => {
    if (path === 'audit') {
      const a = AUDIT_OFFERS.find((x) => x.id === auditId)!
      return {
        headline: a.name,
        primary: { label: 'Audit fee', value: formatCurrency(a.price) },
        secondary: a.note ?? '',
      }
    }
    if (path === 'modules') {
      return {
        headline: `${selectedModulesCount} module${selectedModulesCount === 1 ? '' : 's'} selected`,
        primary: { label: 'Estimated total', value: formatCurrency(moduleTotal) },
        secondary: bundleActive
          ? `Includes 15% bundle discount (-${formatCurrency(bundleDiscount)}).`
          : 'Select 3+ modules to unlock the 15% bundle discount.',
      }
    }
    if (path === 'build') {
      const b = BUILD_OFFERS.find((x) => x.id === buildId)!
      return {
        headline: `${b.name} build`,
        primary: { label: 'Founding rate', value: formatCurrency(b.foundingPrice) },
        secondary: `Public rate ${formatCurrency(b.publicPrice)}. 50% deposit on confirmation.`,
      }
    }
    const r = RECURRING_OFFERS.find((x) => x.id === recurringId)!
      return {
        headline: r.name,
        primary: { label: 'Per month', value: `${formatCurrency(r.monthlyPrice)}/mo` },
        secondary: 'Stripe Checkout starts the recurring subscription.',
      }
  }, [path, auditId, moduleTotal, bundleActive, bundleDiscount, selectedModulesCount, buildId, recurringId])

  const submitDisabled = submit.kind === 'submitting'

  return (
    <aside className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6 lg:sticky lg:top-24">
      <div className="mb-5">
        <BracketLabel>Summary</BracketLabel>
      </div>
      <p className="mb-1 text-[0.7rem] uppercase tracking-[0.1em] text-ink-subtle">
        {path === 'audit'
          ? 'Audit'
          : path === 'modules'
            ? 'Modules'
            : path === 'build'
              ? 'Full build'
              : 'Recurring'}
      </p>
      <h2 className="mb-5 text-lg font-medium tracking-[-0.01em] text-ink">{headline}</h2>

      {path === 'modules' && (
        <div className="mb-5 space-y-2 border-y border-[var(--color-border)] py-4 text-sm">
          <Row label="Subtotal" value={formatCurrency(moduleSubtotal)} />
          <Row
            label="Bundle discount"
            value={bundleActive ? `-${formatCurrency(bundleDiscount)}` : 'Select 3+'}
            highlight={bundleActive}
          />
        </div>
      )}

      <div className="mb-5 border-t border-[var(--color-border)] pt-5">
        <p className="mb-1 text-[0.7rem] uppercase tracking-[0.1em] text-ink-subtle">
          {primary.label}
        </p>
        <p className="text-[2rem] font-medium tracking-[-0.03em] text-amber tabular-nums">
          {primary.value}
        </p>
      </div>

      <p className="mb-5 text-sm leading-relaxed text-ink-muted">{secondary}</p>

      {submit.kind === 'error' && (
        <p className="mb-5 border border-amber/60 bg-amber/10 px-3 py-2 text-sm text-amber">
          {submit.message}
        </p>
      )}

      <button
        type="submit"
        disabled={submitDisabled}
        className="group flex min-h-[52px] w-full items-center justify-center gap-2.5 border border-amber px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-amber transition-all duration-200 hover:bg-amber/10 disabled:opacity-60"
      >
        {submitDisabled ? 'Creating Stripe Checkout...' : submitLabel(path)}
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
      </button>

      <p className="mt-4 text-[0.7rem] leading-relaxed text-ink-subtle">
        Secure Stripe checkout. Build Your Plan and continue to payment through Stripe.
      </p>

      {!isSupabaseConfigured && (
        <p className="mt-4 border border-[var(--color-border)] px-3 py-2 text-[0.7rem] leading-relaxed text-ink-muted">
          Backend not connected yet. Add Supabase env vars to save requests.
        </p>
      )}
    </aside>
  )
}

function submitLabel(path: Path) {
  if (path === 'audit') return 'Start Your Audit'
  if (path === 'modules') return 'Choose Your Upgrades'
  if (path === 'build') return 'Plan Your Build'
  if (path === 'recurring') return 'Choose a Care Plan'
  return 'Build Your Plan'
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-ink-muted">{label}</span>
      <span
        className={`tabular-nums ${highlight ? 'text-amber' : 'text-ink'}`}
      >
        {value}
      </span>
    </div>
  )
}
