import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FunctionsFetchError, FunctionsHttpError } from '@supabase/supabase-js'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { EMAIL } from '@/data/contact'
import { fmtCents } from '@/lib/adminFormatters'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

type PackageType = 'audit' | 'modules' | 'build' | 'recurring'

interface SummaryModule {
  module_name: string
  quantity: number
  total_cents: number
}

interface CheckoutSummary {
  package_type: PackageType
  package_name: string
  amount_total_cents: number
  currency: string
  payment_status: string
  selected_modules: SummaryModule[]
  next_steps: string[]
  portal_url: string
  support_email: string
}

const FALLBACK_NEXT_STEPS = [
  'Brian will follow up with onboarding details.',
  'Your client portal will be connected after setup.',
]

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [summary, setSummary] = useState<CheckoutSummary | null>(null)
  const [loading, setLoading] = useState(Boolean(sessionId && isSupabaseConfigured && supabase))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    async function loadSummary() {
      if (!sessionId || !isSupabaseConfigured || !supabase) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const { data, error: invokeError } = await supabase.functions.invoke('checkout-session-summary', {
          body: { session_id: sessionId },
          timeout: 15_000,
        })

        if (!alive) return

        if (invokeError) throw invokeError

        if (!data || typeof data !== 'object' || typeof (data as { package_type?: unknown }).package_type !== 'string') {
          throw new Error('Checkout summary was not returned.')
        }

        setSummary(data as CheckoutSummary)
      } catch (invokeError) {
        if (!alive) return

        console.error('checkout-session-summary failed', {
          message: invokeError instanceof Error ? invokeError.message : String(invokeError),
          stack: invokeError instanceof Error ? invokeError.stack : undefined,
        })

        let message = 'We could not load the package summary, but your payment was received.'
        if (invokeError instanceof FunctionsFetchError) {
          message = 'We could not reach the confirmation summary. Your payment was received.'
        } else if (invokeError instanceof FunctionsHttpError) {
          try {
            const body = await invokeError.context.json()
            if (body && typeof body === 'object') {
              const returnedError = typeof (body as { error?: unknown }).error === 'string'
                ? (body as { error: string }).error
                : null
              const debugCode = typeof (body as { debug_code?: unknown }).debug_code === 'string'
                ? (body as { debug_code: string }).debug_code
                : null
              message = returnedError
                ? `${returnedError}${debugCode ? ` (${debugCode})` : ''}`
                : message
            }
          } catch {
            // keep fallback message
          }
        } else if (invokeError instanceof Error && invokeError.message.trim()) {
          message = invokeError.message
        }

        setError(message)
        setSummary(null)
      } finally {
        if (alive) setLoading(false)
      }
    }

    void loadSummary()

    return () => {
      alive = false
    }
  }, [sessionId])

  const copy = useMemo(() => buildCopy(summary?.package_type), [summary?.package_type])
  const nextSteps = summary?.next_steps.length ? summary.next_steps : FALLBACK_NEXT_STEPS
  const hasModules = Boolean(summary?.selected_modules.length)
  const amountDisplay = summary ? fmtCents(summary.amount_total_cents) : null

  return (
    <>
      <Nav />
      <main className="min-h-screen pt-16 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-12 lg:py-24">
          <div className="max-w-3xl border-t border-[var(--color-border)] pt-7">
            <div className="mb-6 flex items-center gap-4">
              <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">
                /
              </span>
              <BracketLabel>Payment received</BracketLabel>
            </div>

            <h1 className="mb-4 text-[2.5rem] font-medium leading-[1.04] tracking-[-0.03em] text-ink md:text-[3.5rem]">
              Payment received.
            </h1>

            <h2 className="mb-4 max-w-[26ch] text-2xl font-medium leading-tight tracking-[-0.02em] text-ink md:text-[2.4rem]">
              {copy.heading}
            </h2>

            <p className="mb-6 max-w-[62ch] text-base leading-relaxed text-ink-muted md:text-[1.0625rem]">
              {copy.body}
            </p>

            {sessionId && loading && (
              <p className="mb-6 text-sm text-ink-muted">Loading your confirmation details…</p>
            )}

            {error && (
              <div className="mb-6 border border-amber/60 bg-amber/5 px-5 py-4 text-sm text-amber">
                {error}
              </div>
            )}

            <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Fact label="Package" value={summary?.package_name ?? 'Checkout complete'} />
              <Fact label="Payment status" value={summary?.payment_status ?? 'paid'} />
              <Fact label="Amount paid" value={amountDisplay ?? '—'} />
              <Fact label="Portal" value="Client portal ready" />
            </div>

            {hasModules && summary && (
              <section className="mb-10 border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <div className="mb-4 flex items-center gap-3">
                  <BracketLabel>Selected modules</BracketLabel>
                </div>
                <div className="space-y-3">
                  {summary.selected_modules.map((module) => (
                    <div key={`${module.module_name}-${module.quantity}`} className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-2 text-sm last:border-b-0 last:pb-0">
                      <span className="text-ink-muted">
                        {module.module_name}
                        {module.quantity > 1 ? ` × ${module.quantity}` : ''}
                      </span>
                      <span className="tabular-nums text-ink">{fmtCents(module.total_cents)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="mb-10 grid gap-6 border-y border-[var(--color-border)] py-8">
              <Step n="01" title={copy.nextStepTitle}>
                {copy.nextStepBody}
              </Step>
              <Step n="02" title="Next steps">
                <ul className="space-y-2">
                  {nextSteps.map((step) => (
                    <li key={step} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 bg-amber" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </Step>
            </div>

            <section className="mb-10 border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <div className="mb-4 flex items-center gap-3">
                <BracketLabel>Client portal access</BracketLabel>
              </div>
              <h3 className="text-lg font-medium tracking-[-0.01em] text-ink">
                Access your client portal
              </h3>
              <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-ink-muted">
                Use the same email you used at checkout. We’ll send you a secure login link so you
                can view your project stage, payment status, next due date, and updates.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/portal"
                  className="inline-flex items-center gap-2.5 border border-amber px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-amber transition-all duration-200 hover:bg-amber/10"
                >
                  Open Client Portal
                  <span className="text-amber">→</span>
                </Link>
                <a
                  href={`mailto:${summary?.support_email ?? EMAIL}`}
                  className="inline-flex items-center gap-2.5 px-2 py-3 font-sans text-sm text-ink-muted transition-colors duration-150 hover:text-amber"
                >
                  Questions? {summary?.support_email ?? EMAIL}
                </a>
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2.5 border border-[var(--color-border-strong)] px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink transition-all duration-200 hover:border-amber hover:text-amber"
              >
                Back to home
                <span className="text-amber">→</span>
              </Link>
              <Link
                to="/checkout"
                className="inline-flex items-center gap-2.5 border border-[var(--color-border)] px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink-muted transition-all duration-200 hover:border-amber hover:text-amber"
              >
                Build Your Plan
                <span className="text-amber">→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function buildCopy(packageType?: PackageType | null) {
  switch (packageType) {
    case 'audit':
      return {
        heading: 'Audit payment received.',
        body:
          'Your Full Website Audit is confirmed. Next, Anvis will review your website across visibility, trust, content, speed, and booking flow.',
        nextStepTitle: 'Audit confirmed',
        nextStepBody:
          'Your audit onboarding details will be sent next, along with the review process and expected timeline.',
      }
    case 'modules':
      return {
        heading: 'Upgrade plan received.',
        body:
          'Your selected website upgrades are confirmed. Anvis will review the selected modules and prepare the next steps for implementation.',
        nextStepTitle: 'Upgrade confirmed',
        nextStepBody:
          'Your selected modules are locked in, and the project will move into the review and setup phase.',
      }
    case 'build':
      return {
        heading: 'Website build confirmed.',
        body:
          'Your website build plan is confirmed. Anvis will follow up with onboarding details, access requirements, and the first project stage.',
        nextStepTitle: 'Build confirmed',
        nextStepBody:
          'Your build tier will be reviewed next, and onboarding details will be prepared for kickoff.',
      }
    case 'recurring':
      return {
        heading: 'Care plan activated.',
        body:
          'Your recurring website care plan is active. Your client portal will show plan details, payment status, and ongoing updates.',
        nextStepTitle: 'Care plan active',
        nextStepBody:
          'Your recurring plan is ready, and your client portal will keep the payment and support details in one place.',
      }
    default:
      return {
        heading: 'Payment received.',
        body:
          'Your Stripe checkout is complete. Brian will follow up with next steps, onboarding details, and your project setup.',
        nextStepTitle: 'What happens next',
        nextStepBody:
          'Brian will follow up with the next step, onboarding details, and any setup that is needed.',
      }
  }
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <span className="mt-0.5 shrink-0 font-mono text-xs font-medium text-amber">{n}</span>
      <div>
        <p className="mb-1 text-sm font-medium text-ink">{title}</p>
        <div className="max-w-[58ch] text-sm leading-relaxed text-ink-muted">{children}</div>
      </div>
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="mb-2 text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">{label}</p>
      <p className="text-sm font-medium leading-relaxed text-ink">{value}</p>
    </div>
  )
}
