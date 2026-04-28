import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

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
  {
    key: 'card',
    label: 'Credit / debit card',
    sub: 'Secure payment by card through Stripe.',
  },
  {
    key: 'etransfer',
    label: 'E-transfer',
    sub: 'Available for Canadian clients. Instructions shown below.',
  },
  {
    key: 'paypal',
    label: 'PayPal',
    sub: 'Available on request.',
  },
]

export function CheckoutPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')

  const planParam = searchParams.get('plan')?.toLowerCase() ?? ''
  const selectedKey = PLAN_ORDER.includes(planParam as PlanKey) ? (planParam as PlanKey) : null
  const selectedPlan = selectedKey ? PLANS[selectedKey] : null

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  function selectPlan(plan: PlanKey) {
    setSearchParams({ plan })
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen pt-16">
        <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-12 lg:py-24">
          <Link
            to="/#pricing"
            className="mb-10 inline-flex text-sm text-muted-foreground transition-colors duration-150 hover:text-white"
          >
            ← Back to pricing
          </Link>

          <div className="mb-12 max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Securing your project
            </p>
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Secure your project deposit
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              Choose your package, review the payment schedule, then pay the 50% deposit to secure your project slot.
            </p>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[1fr_420px]">
            {/* Left column: step 1 + step 2 */}
            <div className="self-start space-y-10">

              {/* Step 1 — Package selection */}
              <section>
                <h2 className="mb-5 text-sm font-semibold text-white">1. Choose your package</h2>

                <div className="grid gap-3">
                  {PLAN_ORDER.map((key) => {
                    const plan = PLANS[key]
                    const selected = key === selectedKey

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => selectPlan(key)}
                        className={`group w-full rounded-md border p-5 text-left transition-colors duration-150 ${
                          selected
                            ? 'border-primary/70 bg-muted/30 ring-1 ring-primary/40'
                            : 'border-border bg-background hover:border-primary/50 hover:bg-muted/20'
                        }`}
                      >
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div>
                            <div className="mb-2 flex items-center gap-3">
                              <span
                                className={`mt-0.5 h-3 w-3 shrink-0 rounded-full border ${
                                  selected ? 'border-primary bg-primary' : 'border-border bg-background'
                                }`}
                              />
                              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">{plan.timeline}</p>
                          </div>

                          {plan.recommended && (
                            <span className="rounded-sm border border-primary/40 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary">
                              Recommended
                            </span>
                          )}
                        </div>

                        <div className="mb-4 flex flex-wrap items-end gap-x-4 gap-y-1">
                          <p className="text-2xl font-bold tracking-tight text-foreground">{plan.total}</p>
                          <p className="pb-1 text-sm text-primary">{plan.deposit} deposit</p>
                        </div>

                        <ul className="grid gap-x-6 gap-y-2 text-sm leading-snug text-muted-foreground md:grid-cols-2">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex gap-2.5">
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/70" />
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
                <h2 className="mb-5 text-sm font-semibold text-white">2. Choose your payment method</h2>

                <div className="grid gap-3">
                  {PAYMENT_METHODS.map(({ key, label, sub }) => {
                    const active = paymentMethod === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPaymentMethod(key)}
                        className={`flex w-full items-center gap-4 rounded-md border p-4 text-left transition-colors duration-150 ${
                          active
                            ? 'border-primary/70 bg-muted/30 ring-1 ring-primary/40'
                            : 'border-border bg-background hover:border-primary/50 hover:bg-muted/20'
                        }`}
                      >
                        <span
                          className={`mt-0.5 h-3 w-3 shrink-0 rounded-full border ${
                            active ? 'border-primary bg-primary' : 'border-border bg-background'
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium text-white">{label}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Step 3 — Care plan */}
              <section className="border-l border-primary/35 pl-5">
                <h2 className="mb-4 text-sm font-semibold text-white">3. Care Plan</h2>
                <p className="mb-2 text-sm font-semibold text-white">Care Plan — $149/month</p>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Available only for existing clients after launch. Includes hosting, monthly content updates up to 2 hours,
                  security monitoring, weekly backups, and priority response.
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  You can add this after your website is launched.
                </p>
              </section>

            </div>

            {/* Right column: order summary + CTA */}
            <aside className="mt-0 self-start rounded-md border border-border bg-muted/10 p-6 lg:sticky lg:top-24 lg:mt-10">
              {selectedPlan ? (
                <>
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Order summary
                      </p>
                      <h2 className="text-xl font-semibold text-white">{selectedPlan.name}</h2>
                    </div>
                    {selectedPlan.recommended && (
                      <span className="rounded-sm border border-primary/40 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Total price</span>
                      <span className="font-semibold text-white">{selectedPlan.total}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Deposit due today</span>
                      <span className="font-semibold text-primary">{selectedPlan.deposit}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Remaining balance</span>
                      <span className="text-muted-foreground">{selectedPlan.remaining}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Timeline</span>
                      <span className="text-muted-foreground">{selectedPlan.timeline}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Payment method</span>
                      <span className="text-muted-foreground">
                        {PAYMENT_METHODS.find((method) => method.key === paymentMethod)?.label}
                      </span>
                    </div>
                  </div>

                  <div className="my-6 border-t border-border" />

                  <div className="mb-6">
                    <p className="mb-3 text-sm font-medium text-white">Payment schedule</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Due on booking</span>
                        <span className="text-white">{selectedPlan.deposit.replace(' CAD', '')}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Due before launch</span>
                        <span className="text-white">{selectedPlan.remaining.replace(' CAD', '')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="my-6 border-t border-border" />

                  {/* CTA — changes by payment method */}
                  {paymentMethod === 'card' && (
                    <>
                      <a
                        href={selectedPlan.stripeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-3 flex min-h-[52px] w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/85"
                      >
                        Pay {selectedPlan.deposit} deposit by card
                      </a>
                      <p className="text-center text-xs text-muted-foreground">
                        Remaining balance is due before launch.
                      </p>
                    </>
                  )}

                  {paymentMethod === 'etransfer' && (
                    <div className="space-y-4">
                      <div className="rounded-md border border-border bg-background p-4">
                        <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Deposit due
                        </p>
                        <p className="text-2xl font-bold tracking-tight text-white">
                          {selectedPlan.deposit}
                        </p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-white">E-transfer instructions</p>
                        <p className="text-muted-foreground">
                          Send your deposit to:{' '}
                          <a
                            href="mailto:nducanhnguyenn@gmail.com"
                            className="font-mono text-primary transition-colors duration-150 hover:underline"
                          >
                            nducanhnguyenn@gmail.com
                          </a>
                        </p>
                        <p className="text-muted-foreground">
                          Use your business name + selected package as the message.
                        </p>
                        <p className="text-muted-foreground">
                          Once sent, email confirmation to{' '}
                          <a
                            href="mailto:nducanhnguyenn@gmail.com"
                            className="text-primary transition-colors duration-150 hover:underline"
                          >
                            nducanhnguyenn@gmail.com
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="space-y-3 text-sm">
                      <p className="font-medium text-white">PayPal available on request</p>
                      <p className="text-muted-foreground">
                        Email{' '}
                        <a
                          href="mailto:brian@anvisco.com"
                          className="text-primary transition-colors duration-150 hover:underline"
                        >
                          brian@anvisco.com
                        </a>{' '}
                        and I'll send the payment details.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-4">
                  <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    No valid package selected
                  </p>
                  <h2 className="mb-3 text-2xl font-bold tracking-tight text-white">
                    Plan not found.
                  </h2>
                  <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                    Choose a package on the left, or return to pricing to review the options.
                  </p>
                  <Link
                    to="/#pricing"
                    className="inline-flex min-h-[52px] items-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/85"
                  >
                    Back to pricing
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
