import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { BracketLabel } from '@/components/ui/BracketLabel'

type PlanKey = 'essentials' | 'standard' | 'premium'
type PaymentMethod = 'card' | 'etransfer' | 'paypal'

interface CheckoutPlan {
  name: string
  total: string
  deposit: string
  remaining: string
  timeline: string
  recommended?: boolean
  features: string[]
  stripeLink: string
}

const PLAN_ORDER: PlanKey[] = ['essentials', 'standard', 'premium']
const PAYPAL_LINKS: Record<PlanKey, string> = {
  essentials: 'https://www.paypal.com/ncp/payment/CV2ZJKHHFZ4UG',
  standard: 'https://www.paypal.com/ncp/payment/ASTJ8G2TQAH2E',
  premium: 'https://www.paypal.com/ncp/payment/RZMJZW7TEHG3E',
}

const PLANS: Record<PlanKey, CheckoutPlan> = {
  essentials: {
    name: 'Essentials',
    total: '$1,200 CAD',
    deposit: '$600 CAD',
    remaining: '$600 CAD',
    timeline: '7-day delivery',
    features: [
      'Up to 5 pages',
      'Mobile-optimized',
      'Contact form',
      'Basic on-page SEO',
      'Google Business setup',
    ],
    stripeLink: 'https://buy.stripe.com/28EcN4cilgSF9m86mp6sw00',
  },
  standard: {
    name: 'Standard',
    total: '$2,200 CAD',
    deposit: '$1,100 CAD',
    remaining: '$1,100 CAD',
    timeline: '10-day delivery',
    recommended: true,
    features: [
      'Up to 10 pages',
      'Online booking integration',
      '1 additional language',
      'Image refresh',
      'On-page SEO',
      'Google Business optimization',
    ],
    stripeLink: 'https://buy.stripe.com/eVq00i5TXbyl8i49yB6sw02',
  },
  premium: {
    name: 'Premium',
    total: '$3,800 CAD',
    deposit: '$1,900 CAD',
    remaining: '$1,900 CAD',
    timeline: '14-day delivery',
    features: [
      'Everything in Standard',
      'Custom features included',
      '2 additional languages',
      'First month of care plan included',
    ],
    stripeLink: 'https://buy.stripe.com/8x2fZgeqtauh2XK7qt6sw04',
  },
}

const PAYMENT_METHODS: { key: PaymentMethod; label: string; sub: string }[] = [
  { key: 'card', label: 'Card (Stripe)', sub: 'Secure card checkout through Stripe.' },
  { key: 'paypal', label: 'PayPal', sub: 'Direct PayPal checkout for the selected plan.' },
  { key: 'etransfer', label: 'E-transfer', sub: 'Manual transfer instructions shown below.' },
]

export function CheckoutPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')

  const planParam = searchParams.get('plan')?.toLowerCase() ?? ''
  const selectedKey = PLAN_ORDER.includes(planParam as PlanKey) ? (planParam as PlanKey) : null
  const selectedPlan = selectedKey ? PLANS[selectedKey] : null
  const selectedCheckoutLink =
    selectedKey && paymentMethod === 'card'
      ? selectedPlan?.stripeLink
      : selectedKey && paymentMethod === 'paypal'
        ? PAYPAL_LINKS[selectedKey]
        : null

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  function selectPlan(plan: PlanKey) {
    setSearchParams({ plan })
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen pt-16 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-12 lg:py-24">

          {/* Back link */}
          <Link
            to="/#pricing"
            className="mb-12 inline-flex items-center gap-2 text-[0.7rem] tracking-[0.1em] uppercase text-ink-muted transition-colors duration-150 hover:text-amber"
          >
            ← Back to pricing
          </Link>

          {/* Header */}
          <div className="mb-14 border-t border-[var(--color-border)] pt-7">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">—</span>
              <BracketLabel>Securing your project</BracketLabel>
            </div>
            <h1 className="mb-4 text-[2.5rem] font-medium tracking-[-0.03em] text-ink leading-[1.05]">
              Secure your project deposit
            </h1>
            <p className="max-w-[52ch] text-base leading-relaxed text-ink-muted">
              Choose your package, review the payment schedule, then pay the 50% deposit to secure your project slot.
            </p>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[1fr_400px]">

            {/* Left column */}
            <div className="self-start space-y-12">

              {/* Step 1 — Package selection */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">01</span>
                  <p className="text-[0.7rem] tracking-[0.12em] uppercase text-ink-subtle font-medium">Choose your package</p>
                </div>

                <div className="flex flex-col gap-3">
                  {PLAN_ORDER.map((key) => {
                    const plan = PLANS[key]
                    const selected = key === selectedKey

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => selectPlan(key)}
                        className={`group w-full border p-6 text-left transition-all duration-150 ${
                          selected
                            ? 'border-amber/60 bg-[var(--color-surface)]'
                            : 'border-[var(--color-border)] bg-transparent hover:border-[var(--color-border-strong)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1.5">
                              <span
                                className={`h-2 w-2 border transition-colors duration-150 ${
                                  selected ? 'border-amber bg-amber' : 'border-[var(--color-border-strong)] bg-transparent'
                                }`}
                              />
                              <h3 className="text-base font-medium text-ink">{plan.name}</h3>
                            </div>
                            <p className="text-[0.7rem] tracking-[0.08em] uppercase text-ink-subtle pl-5">{plan.timeline}</p>
                          </div>

                          {plan.recommended && (
                            <BracketLabel>recommended</BracketLabel>
                          )}
                        </div>

                        <div className="flex items-baseline gap-2 mb-4 pl-5">
                          <p className="text-2xl font-medium tabular-nums tracking-[-0.02em] text-amber">{plan.total}</p>
                          <p className="text-sm text-ink-muted">— {plan.deposit} deposit</p>
                        </div>

                        <ul className="grid gap-x-6 gap-y-1.5 text-sm leading-snug text-ink-muted md:grid-cols-2 pl-5">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2.5">
                              <span className="mt-2 h-1 w-1 shrink-0 bg-[var(--color-border-strong)]" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Step 2 — Payment method */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">02</span>
                  <p className="text-[0.7rem] tracking-[0.12em] uppercase text-ink-subtle font-medium">Choose your payment method</p>
                </div>

                <div className="flex flex-col gap-2">
                  {PAYMENT_METHODS.map(({ key, label, sub }) => {
                    const active = paymentMethod === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPaymentMethod(key)}
                        className={`flex w-full items-center gap-4 border p-4 text-left transition-all duration-150 ${
                          active
                            ? 'border-amber/60 bg-[var(--color-surface)]'
                            : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
                        }`}
                      >
                        <span
                          className={`mt-0.5 h-2 w-2 shrink-0 border transition-colors duration-150 ${
                            active ? 'border-amber bg-amber' : 'border-[var(--color-border-strong)] bg-transparent'
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium text-ink">{label}</p>
                          <p className="mt-0.5 text-[0.7rem] text-ink-muted">{sub}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Step 3 — Care plan */}
              <section className="border-l border-[var(--color-border)] pl-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">03</span>
                  <p className="text-[0.7rem] tracking-[0.12em] uppercase text-ink-subtle font-medium">Care Plan</p>
                </div>
                <p className="mb-2 text-sm font-medium text-ink">Care Plan — $149/month</p>
                <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">
                  Available only for existing clients after launch. Includes hosting, monthly content updates up to 2 hours,
                  security monitoring, weekly backups, and priority response.
                </p>
                <p className="mt-4 text-[0.7rem] text-ink-subtle">
                  You can add this after your website is launched.
                </p>
              </section>

            </div>

            {/* Right column — order summary */}
            <aside className="self-start border border-[var(--color-border)] bg-[var(--color-surface)] p-6 lg:sticky lg:top-24 lg:mt-10">
              {selectedPlan ? (
                <>
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-3">
                        <BracketLabel>Order summary</BracketLabel>
                      </div>
                      <h2 className="text-xl font-medium text-ink">{selectedPlan.name}</h2>
                    </div>
                    {selectedPlan.recommended && (
                      <BracketLabel>recommended</BracketLabel>
                    )}
                  </div>

                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Total price', value: selectedPlan.total, highlight: false },
                      { label: 'Deposit due today', value: selectedPlan.deposit, highlight: true },
                      { label: 'Remaining balance', value: selectedPlan.remaining, highlight: false },
                      { label: 'Timeline', value: selectedPlan.timeline, highlight: false },
                      {
                        label: 'Payment method',
                        value: PAYMENT_METHODS.find((m) => m.key === paymentMethod)?.label ?? '',
                        highlight: false,
                      },
                    ].map(({ label, value, highlight }) => (
                      <div key={label} className="flex items-center justify-between gap-4">
                        <span className="text-ink-muted">{label}</span>
                        <span className={highlight ? 'font-medium text-amber tabular-nums' : 'text-ink-muted tabular-nums'}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="my-6 border-t border-[var(--color-border)]" />

                  <div className="mb-6">
                    <p className="mb-3 text-[0.7rem] tracking-[0.12em] uppercase text-ink-subtle">Payment schedule</p>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-ink-muted">Due on booking</span>
                        <span className="text-ink tabular-nums">{selectedPlan.deposit.replace(' CAD', '')}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-ink-muted">Due before launch</span>
                        <span className="text-ink tabular-nums">{selectedPlan.remaining.replace(' CAD', '')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="my-6 border-t border-[var(--color-border)]" />

                  {/* CTA — outlined style */}
                  {(paymentMethod === 'card' || paymentMethod === 'paypal') && selectedCheckoutLink && (
                    <>
                      <a
                        href={selectedCheckoutLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mb-3 flex min-h-[52px] w-full items-center justify-center gap-2.5 border border-[var(--color-border-strong)] px-6 py-3 text-[0.7rem] tracking-[0.1em] uppercase font-medium text-ink transition-all duration-200 hover:border-amber hover:text-amber"
                      >
                        {paymentMethod === 'card'
                          ? `Pay ${selectedPlan.deposit} deposit by card`
                          : `Pay ${selectedPlan.deposit} with PayPal`}
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                      </a>
                      <p className="text-center text-[0.65rem] text-ink-subtle">
                        {paymentMethod === 'card'
                          ? 'Remaining balance is due before launch.'
                          : 'PayPal opens directly for the selected plan.'}
                      </p>
                    </>
                  )}

                  {paymentMethod === 'etransfer' && (
                    <div className="space-y-5">
                      <div className="border border-[var(--color-border)] p-4">
                        <p className="mb-1">
                          <BracketLabel>Deposit due</BracketLabel>
                        </p>
                        <p className="text-2xl font-medium tracking-[-0.02em] text-amber tabular-nums mt-2">
                          {selectedPlan.deposit}
                        </p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-ink">E-transfer instructions</p>
                        <p className="text-ink-muted">
                          Send your deposit to:{' '}
                          <a
                            href="mailto:nducanhnguyenn@gmail.com"
                            className="text-amber transition-colors duration-150 hover:underline"
                          >
                            nducanhnguyenn@gmail.com
                          </a>
                        </p>
                        <p className="text-ink-muted">
                          Use your business name + selected package as the message.
                        </p>
                        <p className="text-ink-muted">
                          Once sent, email confirmation to{' '}
                          <a
                            href="mailto:brian@anvisco.com"
                            className="text-amber transition-colors duration-150 hover:underline"
                          >
                            brian@anvisco.com
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-4">
                  <div className="mb-6">
                    <BracketLabel>No package selected</BracketLabel>
                  </div>
                  <h2 className="mb-3 text-xl font-medium text-ink">
                    Plan not found.
                  </h2>
                  <p className="mb-8 text-sm leading-relaxed text-ink-muted">
                    Choose a package on the left, or return to pricing to review the options.
                  </p>
                  <Link
                    to="/#pricing"
                    className="group inline-flex items-center gap-2.5 border border-[var(--color-border-strong)] px-5 py-3 text-[0.7rem] tracking-[0.1em] uppercase font-medium text-ink transition-all duration-200 hover:border-amber hover:text-amber"
                  >
                    Back to pricing
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
