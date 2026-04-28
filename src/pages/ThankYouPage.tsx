import { Link, useSearchParams } from 'react-router-dom'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

type PlanKey = 'essentials' | 'standard' | 'premium'

const PLAN_ORDER: PlanKey[] = ['essentials', 'standard', 'premium']

const PLANS: Record<PlanKey, { name: string; deposit: string; remaining: string }> = {
  essentials: { name: 'Essentials', deposit: '$600 CAD', remaining: '$600 CAD' },
  standard:   { name: 'Standard',   deposit: '$1,100 CAD', remaining: '$1,100 CAD' },
  premium:    { name: 'Premium',    deposit: '$1,900 CAD', remaining: '$1,900 CAD' },
}

const NEXT_STEPS = [
  {
    n: '01',
    title: 'Confirmation incoming',
    body: 'Brian receives a notification and will email you within 24 hours to confirm your project is underway.',
  },
  {
    n: '02',
    title: 'Onboarding questionnaire',
    body: "You'll receive a short questionnaire covering your services, target clients, brand assets, and any existing content.",
  },
  {
    n: '03',
    title: 'Build begins',
    body: "Once onboarding is complete, your site build starts. You'll get a preview link when it's ready for your review.",
  },
]

export function ThankYouPage() {
  const [searchParams] = useSearchParams()
  const planParam = searchParams.get('plan')?.toLowerCase() ?? ''
  const planKey = PLAN_ORDER.includes(planParam as PlanKey) ? (planParam as PlanKey) : null
  const plan = planKey ? PLANS[planKey] : null

  return (
    <>
      <Nav />
      <main className="min-h-screen pt-16">
        <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-12 lg:py-24">
          {plan ? (
            <div className="max-w-2xl">
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Payment confirmed
              </p>

              <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Your deposit is in.
              </h1>

              <p className="mb-10 text-base leading-relaxed text-muted-foreground">
                You've secured your spot on the{' '}
                <span className="font-medium text-white">{plan.name}</span> plan. A deposit of{' '}
                <span className="font-medium text-white">{plan.deposit}</span> has been received.
                The remaining{' '}
                <span className="font-medium text-white">{plan.remaining}</span> is due before launch.
              </p>

              {/* What happens next */}
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

              {/* Receipt note */}
              <div className="mb-10 rounded-md border border-border bg-muted/10 px-5 py-4">
                <p className="text-sm text-muted-foreground">
                  A payment receipt has been sent to your email by Stripe. Keep it for your records.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to={`/portal?plan=${planKey}&stage=1`}
                  className="inline-flex min-h-[52px] items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/85"
                >
                  View your project portal →
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
                We couldn't read your plan details. If you've already paid, email Brian directly
                and he'll get you sorted.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="mailto:brian@anvisco.com"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/85"
                >
                  Email brian@anvisco.com
                </a>
                <Link
                  to="/#pricing"
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-white"
                >
                  ← Back to pricing
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
