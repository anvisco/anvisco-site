import { Link, useSearchParams } from 'react-router-dom'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

type PlanKey = 'essentials' | 'standard' | 'premium'
type PaymentMethod = 'stripe' | 'paypal' | 'etransfer'

const PLAN_ORDER: PlanKey[] = ['essentials', 'standard', 'premium']

const PLANS: Record<PlanKey, { name: string; deposit: string; remaining: string }> = {
  essentials: { name: 'Essentials', deposit: '$750 CAD', remaining: '$750 CAD' },
  standard: { name: 'Standard', deposit: '$1,300 CAD', remaining: '$1,300 CAD' },
  premium: { name: 'Premium', deposit: '$2,250 CAD', remaining: '$2,250 CAD' },
}

const METHOD_MESSAGES: Record<PaymentMethod, string> = {
  stripe: 'Your deposit has been submitted through card checkout.',
  paypal: 'Your deposit has been submitted through PayPal.',
  etransfer: 'Your deposit will be confirmed manually once received.',
}

const METHOD_LABELS: Record<PaymentMethod, string> = {
  stripe: 'Card (Stripe)',
  paypal: 'PayPal',
  etransfer: 'E-transfer',
}

const NEXT_STEPS = [
  {
    n: '01',
    title: 'Audit',
    body: 'I confirm the current site, goals, and the highest-priority issues before work starts.',
  },
  {
    n: '02',
    title: 'Scope & recommend',
    body: 'I confirm whether the next move is a module, a bundle, or the full build you selected.',
  },
  {
    n: '03',
    title: 'Build or upgrade',
    body: 'Once scope is confirmed, the selected work starts and updates stay tied to your portal.',
  },
]

export function ThankYouPage() {
  const [searchParams] = useSearchParams()

  const planParam = searchParams.get('plan')?.toLowerCase() ?? ''
  const methodParam = searchParams.get('method')?.toLowerCase() ?? ''

  const planKey = PLAN_ORDER.includes(planParam as PlanKey) ? (planParam as PlanKey) : null
  const plan = planKey ? PLANS[planKey] : null

  const method = (['stripe', 'paypal', 'etransfer'] as const).includes(methodParam as PaymentMethod)
    ? (methodParam as PaymentMethod)
    : null

  return (
    <>
      <Nav />
      <main className="min-h-screen pt-16">
        <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-12 lg:py-24">
          {plan ? (
            <div className="max-w-2xl">
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Deposit update
              </p>

              <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                {plan.name} plan selected.
              </h1>

              <p className="mb-8 text-base leading-relaxed text-muted-foreground">
                Deposit amount: <span className="font-medium text-white">{plan.deposit}</span>.
                The remaining <span className="font-medium text-white">{plan.remaining}</span> is due before launch.
              </p>

              <div className="mb-8 rounded-md border border-border bg-muted/10 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Payment method
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {method ? METHOD_LABELS[method] : 'Manual review'}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {method ? METHOD_MESSAGES[method] : 'Your deposit status will be confirmed manually.'}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  I&apos;ll confirm your deposit and send your project page within 24 hours.
                </p>
              </div>

              <h2 className="mb-6 text-sm font-semibold text-white">What happens next</h2>
              <div className="mb-10 space-y-6">
                {NEXT_STEPS.map(({ n, title, body }) => (
                  <div key={n} className="flex gap-5">
                    <span className="mt-0.5 shrink-0 font-mono text-xs font-semibold text-primary">
                      {n}
                    </span>
                    <div>
                      <p className="mb-1 text-sm font-medium text-white">{title}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/portal"
                className="inline-flex min-h-[52px] items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/85"
              >
                  {'Open client portal ->'}
                </Link>
                <a
                  href="mailto:brian@anvisco.com"
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-white"
                >
                  Questions? brian@anvisco.com
                </a>
              </div>
            </div>
          ) : (
            <div className="max-w-md">
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Something went wrong
              </p>
              <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">
                Plan not found.
              </h1>
              <p className="mb-8 text-base leading-relaxed text-muted-foreground">
                We couldn&apos;t read your plan details. If you&apos;ve already paid, email me directly and I&apos;ll get you sorted.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="mailto:brian@anvisco.com"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/85"
                >
                  Email brian@anvisco.com
                </a>
                <Link
                  to="/services#build"
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-white"
                >
                  {'<- Back to pricing'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
