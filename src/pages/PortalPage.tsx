import { useEffect, useMemo, useRef, useState } from 'react'
import { FunctionsFetchError, FunctionsHttpError } from '@supabase/supabase-js'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { Field, StatusBadge } from '@/lib/adminUtils'
import { fmtCents, fmtDate } from '@/lib/adminFormatters'
import { CONTACT_URL, EMAIL } from '@/data/contact'
import {
  isSupabaseConfigured,
  SUPABASE_NOT_CONFIGURED_MESSAGE,
  supabase,
} from '@/lib/supabase'
import { useClientPortal } from '@/hooks/useClientPortal'

type ProjectStage = 'audit' | 'scope' | 'build' | 'launch' | 'support' | 'complete'
type PackageStatus = 'requested' | 'scoped' | 'in_progress' | 'active' | 'complete' | 'cancelled'
type PaymentStatus = 'not_started' | 'pending' | 'paid' | 'overdue' | 'cancelled'
type PackageType = 'audit' | 'modules' | 'build' | 'recurring'

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
  package_type: PackageType
  package_name: string
  status: PackageStatus
  subtotal_cents: number
  discount_cents: number
  total_cents: number
  recurring_amount_cents: number | null
  next_payment_due_at: string | null
  payment_url: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
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
  status: PaymentStatus
  payment_url: string | null
  paid_at: string | null
  created_at: string
}

interface DbUpdate {
  id: string
  client_id: string
  package_id: string | null
  stage: ProjectStage
  title: string
  body: string | null
  visible_to_client: boolean
  created_at: string
}

interface PortalData {
  client: DbClient | null
  packages: DbPackage[]
  moduleSelections: DbModuleSelection[]
  payments: DbPayment[]
  updates: DbUpdate[]
  loading: boolean
  error: string | null
}

type PortalMappingState = 'idle' | 'loading' | 'claiming' | 'ready' | 'missing' | 'error'
type ClaimClientProfileResponse =
  | { linked: true; client_id: string; auth_email: string; matched_client_email: string; alreadyLinked?: boolean }
  | { linked: false; reason: 'no_matching_client'; auth_email: string }
  | { linked: false; reason: 'insert_failed'; auth_email: string; error: string; code?: string }

const STAGES: { key: ProjectStage; title: string; hint: string }[] = [
  { key: 'audit', title: 'Audit', hint: 'What needs attention' },
  { key: 'scope', title: 'Scope', hint: 'What gets built or changed' },
  { key: 'build', title: 'Build', hint: 'Work in progress' },
  { key: 'launch', title: 'Launch', hint: 'QA and go-live' },
  { key: 'support', title: 'Support', hint: 'Ongoing care' },
  { key: 'complete', title: 'Complete', hint: 'Wrapped up' },
]

const STAGE_LABELS: Record<ProjectStage, string> = {
  audit: 'Audit',
  scope: 'Scope',
  build: 'Build',
  launch: 'Launch',
  support: 'Support',
  complete: 'Complete',
}

const INPUT_CLASS =
  'w-full border border-[var(--color-border-strong)] bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-amber focus:outline-none'

const STATUS_PRIORITY: PackageStatus[] = ['active', 'in_progress', 'scoped', 'requested']
const PAYMENT_STATUSES: PaymentStatus[] = ['not_started', 'pending', 'overdue']

function getClientDisplayName(client: DbClient | null): string {
  if (!client) return 'your project'
  if (client.business_name?.trim()) return client.business_name.trim()
  const trimmedName = client.name.trim()
  if (!trimmedName) return 'your project'
  const firstName = trimmedName.split(/\s+/)[0]
  return firstName || trimmedName
}

function normalizeStageValue(value: string | null | undefined): ProjectStage | null {
  if (!value) return null

  const trimmed = value.trim().toLowerCase()
  const compact = trimmed.replace(/[\s-]+/g, '_')

  if (compact in STAGE_LABELS) {
    return compact as ProjectStage
  }

  const labelMatch = (Object.entries(STAGE_LABELS) as [ProjectStage, string][]).find(
    ([, label]) => label.toLowerCase() === trimmed,
  )

  if (labelMatch) return labelMatch[0]

  if (trimmed.includes('audit')) return 'audit'
  if (trimmed.includes('scope')) return 'scope'
  if (trimmed.includes('build')) return 'build'
  if (trimmed.includes('launch') || trimmed.includes('handover')) return 'launch'
  if (trimmed.includes('support') || trimmed.includes('care')) return 'support'
  if (trimmed.includes('complete') || trimmed.includes('done')) return 'complete'

  return null
}

export function PortalPage() {
  const { loading: authLoading, session, sendMagicLink, signOut } = useClientPortal()
  const sessionUserId = session?.user.id ?? null
  const sessionEmail = session?.user.email?.trim().toLowerCase() ?? null
  const [portal, setPortal] = useState<PortalData>({
    client: null,
    packages: [],
    moduleSelections: [],
    payments: [],
    updates: [],
    loading: false,
    error: null,
  })
  const [portalState, setPortalState] = useState<PortalMappingState>('idle')
  const claimedUserIdRef = useRef<string | null>(null)
  const activeLoadIdRef = useRef(0)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    let alive = true
    const currentUserId = sessionUserId
    const currentEmail = sessionEmail

    if (!currentUserId) {
      claimedUserIdRef.current = null
      activeLoadIdRef.current += 1
      void Promise.resolve().then(() => {
        if (!alive) return
        setPortal({
          client: null,
          packages: [],
          moduleSelections: [],
          payments: [],
          updates: [],
          loading: false,
          error: null,
        })
        setPortalState('idle')
      })
      return () => {
        alive = false
      }
    }

    const portalLoadId = ++activeLoadIdRef.current
    const canClaimThisUser = claimedUserIdRef.current !== currentUserId
    const client = supabase

    if (import.meta.env.DEV) {
      console.debug('[portal] session check', {
        email: currentEmail,
        canClaimThisUser,
      })
    }

    function safeSetMissing(message?: string) {
      if (!alive || portalLoadId !== activeLoadIdRef.current) return
      setPortal({
        client: null,
        packages: [],
        moduleSelections: [],
        payments: [],
        updates: [],
        loading: false,
        error: message ?? null,
      })
      setPortalState('missing')
    }

    async function getAccessToken(): Promise<string | null> {
      const { data } = await client.auth.getSession()
      return data.session?.access_token ?? null
    }

    async function invokeClaimClientProfile() {
      const token = await getAccessToken()
      if (!token) {
        throw new Error('Missing session token.')
      }

      if (import.meta.env.DEV) {
        console.debug('[portal] claim-client-profile invoked', {
          email: currentEmail,
        })
      }

      const { data, error } = await client.functions.invoke<ClaimClientProfileResponse>(
        'claim-client-profile',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (error) {
        if (error instanceof FunctionsFetchError) {
          throw new Error('We could not reach the client profile claim service.')
        }

        if (error instanceof FunctionsHttpError) {
          try {
            const body = await error.context.json()
            if (body && typeof body === 'object' && typeof (body as { error?: unknown }).error === 'string') {
              throw new Error((body as { error: string }).error)
            }
          } catch {
            // fall through to default message
          }
        }

        throw new Error(error.message || 'We could not connect your client profile.')
      }

      if (import.meta.env.DEV) {
        console.debug('[portal] claim-client-profile result', data)
      }

      return data ?? null
    }

    async function loadPortal() {
      if (!alive || portalLoadId !== activeLoadIdRef.current) return
      setPortal((prev) => ({ ...prev, loading: true, error: null }))
      setPortalState('loading')

      const { data: linkRow, error: linkError } = await client
        .from('client_users')
        .select('client_id')
        .eq('user_id', currentUserId)
        .maybeSingle()

      if (!alive || portalLoadId !== activeLoadIdRef.current) return

      if (import.meta.env.DEV) {
        console.debug('[portal] client_users lookup', {
          email: currentEmail,
          hasMapping: Boolean(linkRow?.client_id),
        })
      }

      if (linkError) {
        setPortal({
          client: null,
          packages: [],
          moduleSelections: [],
          payments: [],
          updates: [],
          loading: false,
          error: linkError.message,
        })
        setPortalState('error')
        return
      }

      if (!linkRow?.client_id) {
        if (!canClaimThisUser) {
          safeSetMissing(currentEmail ? `You are signed in as ${currentEmail}. No matching client profile was found for this email.` : 'No matching client profile was found for this email.')
          return
        }

        claimedUserIdRef.current = currentUserId
        setPortalState('claiming')

        try {
          const claimResult = await invokeClaimClientProfile()
          if (!alive || portalLoadId !== activeLoadIdRef.current) return

          if (claimResult?.linked) {
            if (import.meta.env.DEV) {
              console.debug('[portal] claim linked, refetching portal', {
                email: currentEmail,
              })
            }

            const { data: refreshedLink, error: refreshedError } = await client
              .from('client_users')
              .select('client_id')
              .eq('user_id', currentUserId)
              .maybeSingle()

            if (!alive || portalLoadId !== activeLoadIdRef.current) return

            if (refreshedError) {
              setPortal({
                client: null,
                packages: [],
                moduleSelections: [],
                payments: [],
                updates: [],
                loading: false,
                error: refreshedError.message,
              })
              setPortalState('error')
              return
            }

            if (!refreshedLink?.client_id) {
              safeSetMissing(currentEmail ? `You are signed in as ${currentEmail}. No matching client profile was found for this email.` : 'No matching client profile was found for this email.')
              return
            }

            await loadPortalData(refreshedLink.client_id)
            return
          }

          claimedUserIdRef.current = currentUserId
          safeSetMissing(
            currentEmail
              ? `You are signed in as ${currentEmail}. No matching client profile was found for this email.`
              : 'No matching client profile was found for this email.',
          )
          return
        } catch (claimError) {
          if (!alive || portalLoadId !== activeLoadIdRef.current) return
          setPortal({
            client: null,
            packages: [],
            moduleSelections: [],
            payments: [],
            updates: [],
            loading: false,
            error: claimError instanceof Error ? claimError.message : 'Could not connect your client profile.',
          })
          setPortalState('error')
          return
        }
      }

      await loadPortalData(linkRow.client_id)
    }

    async function loadPortalData(clientId: string) {
      const [clientRes, packagesRes, paymentsRes, updatesRes] = await Promise.all([
        client.from('clients').select('*').eq('id', clientId).maybeSingle(),
        client
          .from('client_packages')
          .select('*')
          .eq('client_id', clientId)
          .order('created_at', { ascending: false }),
        client
          .from('payment_schedules')
          .select('*')
          .eq('client_id', clientId)
          .order('due_date', { ascending: true }),
        client
          .from('project_updates')
          .select('*')
          .eq('client_id', clientId)
          .eq('visible_to_client', true)
          .order('created_at', { ascending: false }),
      ])

      if (!alive || portalLoadId !== activeLoadIdRef.current) return

      if (clientRes.error) {
        setPortal({
          client: null,
          packages: [],
          moduleSelections: [],
          payments: [],
          updates: [],
          loading: false,
          error: clientRes.error.message,
        })
        setPortalState('error')
        return
      }

      const packages = ((packagesRes.data as DbPackage[]) ?? []).filter(Boolean)
      const activePackage = selectActivePackage(packages)
      const moduleSelections = activePackage
        ? (
            (
              await client
                .from('client_module_selections')
                .select('*')
                .eq('package_id', activePackage.id)
                .order('created_at', { ascending: true })
            ).data as DbModuleSelection[]
          ) ?? []
        : []

      if (!alive || portalLoadId !== activeLoadIdRef.current) return

      setPortal({
        client: clientRes.data as DbClient,
        packages,
        moduleSelections,
        payments: ((paymentsRes.data as DbPayment[]) ?? []).filter(Boolean),
        updates: ((updatesRes.data as DbUpdate[]) ?? []).filter(Boolean),
        loading: false,
        error: null,
      })
      setPortalState('ready')
    }

    void loadPortal().catch((error) => {
      if (!alive || portalLoadId !== activeLoadIdRef.current) return
      setPortal({
        client: null,
        packages: [],
        moduleSelections: [],
        payments: [],
        updates: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Could not load the portal.',
      })
      setPortalState('error')
    })

    return () => {
      alive = false
    }
  }, [sessionUserId, sessionEmail])

  const activePackage = useMemo(() => selectActivePackage(portal.packages), [portal.packages])
  const otherPackages = useMemo(
    () => portal.packages.filter((pkg) => pkg.id !== activePackage?.id),
    [activePackage?.id, portal.packages],
  )
  const nextPayment = useMemo(() => selectNextPayment(portal.payments), [portal.payments])
  const packageNextPayment = useMemo(() => {
    if (!activePackage || !activePackage.next_payment_due_at || activePackage.recurring_amount_cents === null) {
      return null
    }
    return {
      id: `${activePackage.id}-recurring`,
      client_id: activePackage.client_id,
      package_id: activePackage.id,
      label: activePackage.package_name,
      amount_cents: activePackage.recurring_amount_cents,
      due_date: activePackage.next_payment_due_at,
      status: 'pending' as PaymentStatus,
      payment_url: activePackage.payment_url,
      paid_at: null,
      created_at: activePackage.updated_at,
    }
  }, [activePackage])
  const displayedNextPayment = nextPayment ?? packageNextPayment
  const currentStage = useMemo(
    () => deriveStage(portal.updates, activePackage),
    [activePackage, portal.updates],
  )
  const currentStageLabel = currentStage ? STAGE_LABELS[currentStage] : 'Not started yet'
  const currentStageIndex = currentStage ? STAGES.findIndex((stage) => stage.key === currentStage) : -1
  const portalLoading = Boolean(session) && portalState === 'loading'
  const portalClaiming = Boolean(session) && portalState === 'claiming'
  const portalMissing = Boolean(session) && portalState === 'missing'

  return (
    <>
      <Nav />
      <main className="min-h-screen pt-16 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-screen-2xl px-6 py-20 lg:px-12 lg:py-24">
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,420px)] lg:items-start">
            <div className="border-t border-[var(--color-border)] pt-7">
              <div className="mb-6 flex items-center gap-4">
                <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">
                  /portal
                </span>
                <BracketLabel>CLIENT PORTAL</BracketLabel>
              </div>
              <h1 className="mb-5 max-w-[16ch] text-[2.5rem] font-medium leading-[1.04] tracking-[-0.03em] text-ink md:text-[4rem]">
                Welcome to your client portal.
              </h1>
              <p className="max-w-[62ch] text-base leading-relaxed text-ink-muted md:text-[1.0625rem]">
                Log in with the same email you used at checkout. We’ll send a secure magic link to
                connect the right account.
              </p>
            </div>

            <AuthPanel
              authLoading={authLoading}
              session={session}
              sendMagicLink={sendMagicLink}
              signOut={signOut}
              portalState={portalState}
              clientConnected={Boolean(portal.client)}
            />
          </section>

          {session && portalLoading ? (
            <PortalLoadingState
              title="Checking your login..."
              body="We are checking your signed-in account and loading your client portal."
            />
          ) : null}

          {session && portalClaiming ? (
            <PortalLoadingState
              title="Looking for your client profile..."
              body="We are matching your portal account to the email used at checkout."
            />
          ) : null}

          {portalMissing ? (
            <EmptyConnectionState />
          ) : null}

          {portal.error && (
            <div className="mt-8 border border-amber/60 bg-amber/5 px-5 py-4 text-sm text-amber">
              {portal.error}
            </div>
          )}

          {session && portal.client && (
            <div className="mt-10 space-y-6">
              <section className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-[0.7rem] uppercase tracking-[0.08em] text-ink-subtle">
                      Project overview
                    </p>
                    <h2 className="text-xl font-medium tracking-[-0.01em] text-ink">
                      {getClientDisplayName(portal.client)}
                    </h2>
                    <p className="mt-1 max-w-[56ch] text-sm leading-relaxed text-ink-muted">
                      Your current package, stage, payments, and updates.
                    </p>
                  </div>
                </div>

                <div className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2 xl:grid-cols-4">
                  {portal.client.business_name && (
                    <InfoTile label="Business" value={portal.client.business_name} />
                  )}
                  <InfoTile
                    label="Contact"
                    value={portal.client.name}
                  />
                  <InfoTile
                    label="Active package"
                    value={activePackage ? activePackage.package_name : 'No active package'}
                    sub={activePackage ? packageTypeLabel(activePackage.package_type) : undefined}
                  />
                  <InfoTile label="Current stage" value={currentStageLabel} />
                </div>

              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                <Card title="Active package" eyebrow="Package">
                  {activePackage ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-medium tracking-[-0.01em] text-ink">
                            {activePackage.package_name}
                          </h3>
                          <p className="mt-1 text-sm text-ink-muted">
                            {packageTypeLabel(activePackage.package_type)} ·{' '}
                            <StatusBadge status={activePackage.status} />
                          </p>
                        </div>
                        <p className="text-xl font-medium tracking-[-0.02em] text-amber tabular-nums">
                          {fmtCents(activePackage.total_cents)}
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <SmallFact label="Subtotal" value={fmtCents(activePackage.subtotal_cents)} />
                        <SmallFact label="Discount" value={activePackage.discount_cents > 0 ? `-${fmtCents(activePackage.discount_cents)}` : '—'} />
                        <SmallFact
                          label="Recurring"
                          value={activePackage.recurring_amount_cents !== null ? `${fmtCents(activePackage.recurring_amount_cents)}/mo` : '—'}
                        />
                        <SmallFact
                          label="Package status"
                          value={activePackage.status.replace(/_/g, ' ')}
                        />
                      </div>

                      {activePackage.package_type === 'modules' && portal.moduleSelections.length > 0 && (
                        <div className="border-t border-[var(--color-border)] pt-4">
                          <p className="mb-3 text-[0.7rem] uppercase tracking-[0.08em] text-ink-subtle">
                            Selected modules
                          </p>
                          <div className="space-y-2">
                            {portal.moduleSelections.map((selection) => (
                              <div
                                key={selection.id}
                                className="flex items-center justify-between gap-4 text-sm"
                              >
                                <span className="text-ink-muted">
                                  {selection.module_name}
                                  {selection.quantity > 1 ? ` × ${selection.quantity}` : ''}
                                </span>
                                <span className="tabular-nums text-ink">
                                  {fmtCents(selection.total_cents)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {otherPackages.length > 0 && (
                        <div className="border-t border-[var(--color-border)] pt-4">
                          <p className="mb-3 text-[0.7rem] uppercase tracking-[0.08em] text-ink-subtle">
                            Other packages
                          </p>
                          <div className="space-y-2">
                            {otherPackages.map((pkg) => (
                              <div
                                key={pkg.id}
                                className="flex items-center justify-between gap-4 border border-[var(--color-border)] px-3 py-2"
                              >
                                <span className="text-sm text-ink-muted">{pkg.package_name}</span>
                                <StatusBadge status={pkg.status} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <EmptyState message="No active package is connected yet." />
                  )}
                </Card>

                <Card title="Next payment due" eyebrow="Payments">
                  {displayedNextPayment ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-medium tracking-[-0.01em] text-ink">
                            {displayedNextPayment.label}
                          </h3>
                          <p className="mt-1 text-sm text-ink-muted">
                            Due {displayedNextPayment.due_date ? fmtDate(displayedNextPayment.due_date) : 'when ready'}
                          </p>
                        </div>
                        <p className="text-xl font-medium tracking-[-0.02em] text-amber tabular-nums">
                          {fmtCents(displayedNextPayment.amount_cents)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <StatusBadge status={displayedNextPayment.status} />
                        {displayedNextPayment.status === 'overdue' && (
                          <span className="text-sm text-amber">This payment is past due.</span>
                        )}
                      </div>

                      {displayedNextPayment.payment_url ? (
                        <a
                          href={displayedNextPayment.payment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 border border-amber px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-amber transition-all duration-200 hover:bg-amber/10"
                        >
                          Open payment link
                          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                            →
                          </span>
                        </a>
                      ) : (
                        <p className="text-sm text-ink-muted">
                          Payment link will appear here when ready.
                        </p>
                      )}
                    </div>
                  ) : (
                    <EmptyState message="No upcoming payment due." />
                  )}
                </Card>

                <Card title="Project timeline" eyebrow="Stages" wide>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-[0.7rem] uppercase tracking-[0.08em] text-ink-subtle">
                        Current stage
                      </p>
                      <p className="mt-1 text-sm text-ink-muted">{currentStageLabel}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto pb-2">
                    <div className="flex min-w-max gap-3">
                    {STAGES.map((stage, index) => {
                      const active = stage.key === currentStage
                      const past = currentStageIndex > -1 && index < currentStageIndex
                      return (
                        <div
                          key={stage.key}
                          className={`min-w-[150px] border p-4 transition-colors ${
                            active
                              ? 'bg-[var(--color-surface)] border-amber/60'
                              : past
                                ? 'bg-[var(--color-surface)]'
                                : 'bg-[var(--color-bg)] opacity-80'
                          }`}
                        >
                          <div className="mb-3 flex items-center justify-between gap-4">
                            <span className="text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            {active && <StatusBadge status="active" />}
                            {!active && past && <StatusBadge status="complete" />}
                            {!active && !past && (
                              <span className="text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">
                                Upcoming
                              </span>
                            )}
                          </div>
                          <p className="mb-2 text-sm font-medium text-ink">{stage.title}</p>
                          <p className="text-sm leading-relaxed text-ink-muted">{stage.hint}</p>
                        </div>
                      )
                    })}
                    </div>
                  </div>
                </Card>

                <Card title="Updates" eyebrow="Visible notes">
                  {portal.updates.length > 0 ? (
                    <div className="space-y-3">
                      {portal.updates.map((update) => (
                        <article key={update.id} className="border border-[var(--color-border)] p-4">
                          <div className="mb-2 flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <span className="mr-2 text-[0.62rem] uppercase tracking-[0.06em] text-amber">
                                {STAGE_LABELS[update.stage]}
                              </span>
                              <h3 className="inline text-sm font-medium text-ink">{update.title}</h3>
                            </div>
                            <span className="text-xs text-ink-subtle">{fmtDate(update.created_at)}</span>
                          </div>
                          {update.body && (
                            <p className="max-w-[60ch] text-sm leading-relaxed text-ink-muted whitespace-pre-line">
                              {update.body}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No client-visible updates yet." />
                  )}
                </Card>

                <Card title="Support" eyebrow="Reach out">
                  <p className="max-w-[56ch] text-sm leading-relaxed text-ink-muted">
                    Questions about your project, payment, or next step? Reach out anytime.
                  </p>
                  <div className="mt-5 space-y-3">
                    <a
                      href={`mailto:${EMAIL}`}
                      className="block font-sans text-sm text-ink-muted transition-colors duration-150 hover:text-amber"
                    >
                      {EMAIL}
                    </a>
                    <a
                      href={CONTACT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-[var(--color-border-strong)] px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink transition-all duration-200 hover:border-amber hover:text-amber"
                    >
                      Book a quick call
                      <span className="text-amber">→</span>
                    </a>
                  </div>
                </Card>
              </section>
            </div>
          )}

          {!session && !authLoading && isSupabaseConfigured && (
            <section className="mt-10 grid gap-6 xl:grid-cols-2">
              <Card title="Portal snapshot" eyebrow="Client view" wide>
                <div className="grid gap-4 sm:grid-cols-2">
                  <PortalPreview label="Active package" value="Package, type, selected modules, total, and recurring amount." />
                  <PortalPreview label="Next payment" value="Due date, amount due, status, and payment link if ready." />
                  <PortalPreview label="Timeline" value="Audit, scope, build, launch, support, complete." />
                  <PortalPreview label="Updates" value="Only notes marked visible to the client." />
                </div>
              </Card>
              <Card title="Portal access" eyebrow="Secure login">
                <p className="max-w-[54ch] text-sm leading-relaxed text-ink-muted">
                  Use the same checkout email, then sign in with the secure link Supabase sends.
                  If the portal does not find a matching client profile, Brian can connect it
                  manually after verifying the email.
                </p>
              </Card>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function AuthPanel({
  authLoading,
  session,
  sendMagicLink,
  signOut,
  portalState,
  clientConnected,
}: {
  authLoading: boolean
  session: { user: { email?: string | null } } | null
  sendMagicLink: (email: string) => Promise<string | null>
  signOut: () => Promise<void>
  portalState: PortalMappingState
  clientConnected: boolean
}) {
  if (!isSupabaseConfigured) {
    return <NotConfigured />
  }

  if (authLoading) {
    return <Card title="Loading" eyebrow="Session"><p className="text-sm text-ink-muted">Checking your login…</p></Card>
  }

  if (!session) {
    return <LoginCard sendMagicLink={sendMagicLink} />
  }

  return (
    <Card title="Account" eyebrow="Signed in">
      <div className="space-y-4">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.08em] text-ink-subtle">Signed in as:</p>
          <p className="mt-1 text-sm text-ink">{session.user.email ?? 'your account'}</p>
        </div>
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.08em] text-ink-subtle">Connection:</p>
          <p className="mt-1 text-sm text-ink">
            {clientConnected
              ? 'Portal connected'
              : portalState === 'loading'
                ? 'Loading your client portal'
                : portalState === 'claiming'
                  ? 'Matching your checkout email to a client profile'
                  : 'Portal connection pending'}
          </p>
        </div>
        <button
          onClick={signOut}
          className="inline-flex items-center gap-2 border border-[var(--color-border-strong)] px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink-muted transition-all duration-200 hover:border-amber hover:text-amber"
        >
          Sign out
          <span className="text-amber">→</span>
        </button>
      </div>
    </Card>
  )
}

function LoginCard({
  sendMagicLink,
}: {
  sendMagicLink: (email: string) => Promise<string | null>
}) {
  const [email, setEmail] = useState('')
  const [sendingLink, setSendingLink] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSendingLink(true)
    const err = await sendMagicLink(email)
    setSendingLink(false)
    if (err) {
      setError(err)
      return
    }
    setSuccess('Check your email for a secure login link.')
  }

  return (
    <Card title="Client portal login" eyebrow="Client access">
      <p className="mb-5 text-sm leading-relaxed text-ink-muted">
        Log in with the same email you used at checkout. We’ll send a secure magic link so your
        portal connects to the right client record.
      </p>
      <form onSubmit={handleSendMagicLink} className="space-y-4">
        <Field label="Email" required>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        {error && (
          <p className="border border-amber/60 bg-amber/5 px-3 py-2 text-sm text-amber">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={sendingLink || !email.trim()}
          className="inline-flex items-center gap-2 border border-amber px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-amber transition-all duration-200 hover:bg-amber/10 disabled:opacity-60"
        >
          {sendingLink ? 'Sending…' : 'Send secure login link'}
          <span className="text-amber">→</span>
        </button>
        {success && <p className="text-sm text-amber">{success}</p>}
      </form>
    </Card>
  )
}

function Card({
  title,
  eyebrow,
  children,
  wide,
}: {
  title: string
  eyebrow: string
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <section
      className={`border border-[var(--color-border)] bg-[var(--color-surface)] p-6 ${
        wide ? 'xl:col-span-2' : ''
      }`}
    >
      <div className="mb-5 border-t border-[var(--color-border)] pt-6">
        <p className="mb-2 text-[0.7rem] uppercase tracking-[0.08em] text-ink-subtle">
          {eyebrow}
        </p>
        <h2 className="text-lg font-medium tracking-[-0.01em] text-ink">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function InfoTile({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="bg-[var(--color-bg)] p-4">
      <p className="mb-2 text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">
        {label}
      </p>
      <p className="text-sm font-medium leading-relaxed text-ink">{value}</p>
      {sub && <p className="mt-2 text-xs text-ink-muted">{sub}</p>}
    </div>
  )
}

function SmallFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">{label}</p>
      <p className="text-sm text-ink tabular-nums">{value}</p>
    </div>
  )
}

function PortalPreview({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--color-border)] p-4">
      <p className="mb-2 text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">{label}</p>
      <p className="text-sm leading-relaxed text-ink-muted">{value}</p>
    </div>
  )
}

function NotConfigured() {
  return (
    <div className="mt-8 border border-amber/60 bg-amber/5 p-6">
      <p className="mb-2 text-[0.7rem] uppercase tracking-[0.1em] text-amber">
        Setup required
      </p>
      <p className="max-w-[62ch] text-sm leading-relaxed text-ink-muted">
        {SUPABASE_NOT_CONFIGURED_MESSAGE}
      </p>
    </div>
  )
}

function EmptyConnectionState() {
  return (
    <section className="mt-8 border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <p className="mb-2 text-[0.7rem] uppercase tracking-[0.1em] text-ink-subtle">
        Connection pending
      </p>
      <h2 className="text-xl font-medium tracking-[-0.01em] text-ink">
        No matching client profile found.
      </h2>
      <p className="mb-4 max-w-[62ch] text-sm leading-relaxed text-ink-muted">
        Make sure you used the same email from checkout. If you paid with a different email,
        contact brian@anvisco.com so Anvis can connect your account.
      </p>
      <a
        href="mailto:brian@anvisco.com"
        className="inline-flex items-center gap-2 border border-[var(--color-border-strong)] px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink-muted transition-all duration-200 hover:border-amber hover:text-amber"
      >
        Email Brian
        <span className="text-amber">→</span>
      </a>
    </section>
  )
}

function PortalLoadingState({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <section className="mt-8 border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <p className="mb-2 text-[0.7rem] uppercase tracking-[0.1em] text-ink-subtle">
        Client portal
      </p>
      <h2 className="text-xl font-medium tracking-[-0.01em] text-ink">{title}</h2>
      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-ink-muted">
        {body}
      </p>
    </section>
  )
}

function EmptyState({ message, sub }: { message: string; sub?: string }) {
  return (
    <div className="border border-[var(--color-border)] px-6 py-8">
      <p className="text-sm text-ink-muted">{message}</p>
      {sub && <p className="mt-2 text-xs text-ink-subtle">{sub}</p>}
    </div>
  )
}

function packageTypeLabel(type: PackageType): string {
  if (type === 'audit') return 'Audit'
  if (type === 'modules') return 'Modules'
  if (type === 'build') return 'Full build'
  return 'Care plan'
}

function selectActivePackage(packages: DbPackage[]): DbPackage | null {
  for (const status of STATUS_PRIORITY) {
    const match = packages.find((pkg) => pkg.status === status)
    if (match) return match
  }
  return packages.find((pkg) => pkg.status !== 'cancelled') ?? null
}

function selectNextPayment(payments: DbPayment[]): DbPayment | null {
  const candidates = payments.filter((payment) => PAYMENT_STATUSES.includes(payment.status))
  if (candidates.length === 0) return null

  return candidates.sort((a, b) => {
    const aDate = a.due_date ? new Date(a.due_date).getTime() : Number.POSITIVE_INFINITY
    const bDate = b.due_date ? new Date(b.due_date).getTime() : Number.POSITIVE_INFINITY
    if (aDate !== bDate) return aDate - bDate
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })[0]
}

function deriveStage(updates: DbUpdate[], activePackage: DbPackage | null): ProjectStage | null {
  const latestUpdateStage = normalizeStageValue(updates[0]?.stage)
  if (latestUpdateStage) return latestUpdateStage
  if (!activePackage) return null

  if (activePackage.package_type === 'audit') return 'audit'
  if (activePackage.package_type === 'modules') return 'scope'
  if (activePackage.package_type === 'build') return 'build'
  if (activePackage.package_type === 'recurring') return 'support'

  if (activePackage.status === 'requested') return 'audit'
  if (activePackage.status === 'scoped') return 'scope'
  if (activePackage.status === 'in_progress') return 'build'
  if (activePackage.status === 'complete') return 'complete'
  return null
}
