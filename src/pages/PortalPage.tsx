import { Link, useSearchParams } from 'react-router-dom'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

type PlanKey = 'essentials' | 'standard' | 'premium'

const PLAN_ORDER: PlanKey[] = ['essentials', 'standard', 'premium']

interface PlanInfo {
  name: string
  total: string
  deposit: string
  remaining: string
  timeline: string
}

const PLANS: Record<PlanKey, PlanInfo> = {
  essentials: {
    name: 'Essentials',
    total: '$1,200 CAD',
    deposit: '$600 CAD',
    remaining: '$600 CAD',
    timeline: '7-day delivery',
  },
  standard: {
    name: 'Standard',
    total: '$2,200 CAD',
    deposit: '$1,100 CAD',
    remaining: '$1,100 CAD',
    timeline: '10-day delivery',
  },
  premium: {
    name: 'Premium',
    total: '$3,800 CAD',
    deposit: '$1,900 CAD',
    remaining: '$1,900 CAD',
    timeline: '14-day delivery',
  },
}

const STAGES = [
  { n: 1, label: 'Deposit received' },
  { n: 2, label: 'Onboarding' },
  { n: 3, label: 'Build in progress' },
  { n: 4, label: 'Review' },
  { n: 5, label: 'Final payment' },
  { n: 6, label: 'Launch + handover' },
]

interface StageContent {
  title: string
  items: string[]
}

const STAGE_CONTENT: Record<number, StageContent> = {
  1: {
    title: "You're confirmed — here's what to prepare",
    items: [
      'Brian will reach out within 24 hours to schedule your onboarding call',
      'Prepare your business info: services, target clients, location',
      'Gather brand assets: logo file, brand colors, any existing photos',
      "Start collecting content you'd like on the site (optional at this stage)",
    ],
  },
  2: {
    title: 'Complete your onboarding',
    items: [
      'Complete the onboarding questionnaire Brian sent you',
      'Share your brand assets and any content you want to use',
      'Confirm the site structure and number of pages',
      'Questions? Email brian@anvisco.com',
    ],
  },
  3: {
    title: 'Sit tight — the build is underway',
    items: [
      'No action required right now — Brian is building your site',
      "You'll receive a preview link by email when it's ready for review",
      "Feel free to reply to Brian's last email with any additional notes",
    ],
  },
  4: {
    title: 'Review your preview',
    items: [
      'Open the preview link Brian sent you',
      'Compile your feedback into one clear, organized list',
      'Reply to Brian with your revisions — one round of changes is included',
      'Be specific: note the page, element, and what to change',
    ],
  },
  5: {
    title: 'Arrange your final payment',
    items: [
      "Review the updated site and confirm you're satisfied",
      'Email brian@anvisco.com to receive your final invoice',
      'Pay the remaining balance to unlock your launch',
      'Brian will begin launch prep immediately after payment clears',
    ],
  },
  6: {
    title: "You're live — congratulations",
    items: [
      'Brian will share all credentials and handover documentation',
      'Book a handover call to walk through the site and hosting setup',
      'Consider the Care Plan ($149/month) for hosting, updates, and priority support',
    ],
  },
}

const CALENDLY = 'https://calendly.com/nducanhnguyenn/15-minute-discovery-call'

export function PortalPage() {
  const [searchParams] = useSearchParams()
  const planParam = searchParams.get('plan')?.toLowerCase() ?? ''
  const stageParam = parseInt(searchParams.get('stage') ?? '1', 10)

  const planKey = PLAN_ORDER.includes(planParam as PlanKey) ? (planParam as PlanKey) : null
  const plan = planKey ? PLANS[planKey] : null
  const currentStage = stageParam >= 1 && stageParam <= 6 ? stageParam : 1
  const stageContent = STAGE_CONTENT[currentStage]

  if (!plan) {
    return (
      <>
        <Nav />
        <main className="min-h-screen pt-16">
          <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-12 lg:py-24">
            <div className="max-w-md">
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                No project found
              </p>
              <h1 className="mb-3 text-3xl font-bold tracking-tight text-ink">
                Plan not found.
              </h1>
              <p className="mb-8 text-base leading-relaxed text-ink-muted">
                This portal link looks incomplete. If you've already paid, email Brian and he'll
                send you the correct link.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="mailto:brian@anvisco.com"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-sm border border-amber bg-transparent px-6 py-3 text-sm font-semibold text-amber transition-colors duration-150 hover:underline"
                >
                  Email brian@anvisco.com
                </a>
                <Link
                  to="/#pricing"
                  className="text-sm text-ink-muted transition-colors duration-150 hover:text-ink"
                >
                  ← Back to pricing
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen pt-16">
        <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-12 lg:py-24">

          {/* Back link */}
          <Link
            to="/#pricing"
            className="mb-10 inline-flex text-sm text-ink-muted transition-colors duration-150 hover:text-ink"
          >
            ← Back to pricing
          </Link>

          {/* Header */}
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-ink-subtle">
              Your project portal
            </p>
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              {plan.name} — Project tracker
            </h1>
            <p className="text-base leading-relaxed text-ink-muted">
              This is your live project reference. Brian will update your stage link as your
              project progresses.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">

            {/* Left: stage tracker + next steps + contact */}
            <div className="space-y-12">

              {/* Stage tracker */}
              <section>
                <h2 className="mb-6 text-sm font-semibold text-ink">Project stages</h2>
                <div>
                  {STAGES.map(({ n, label }, i) => {
                    const isCompleted = n < currentStage
                    const isCurrent   = n === currentStage
                    const isLast      = i === STAGES.length - 1

                    return (
                      <div key={n} className="flex gap-4">
                        {/* Dot + connector */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                              isCurrent
                                ? 'border-2 border-amber bg-bg text-amber'
                                : isCompleted
                                ? 'border border-border-strong bg-bg text-amber'
                                : 'border border-border-strong bg-bg text-ink-subtle'
                            }`}
                          >
                            {isCompleted ? '✓' : n}
                          </div>
                          {!isLast && (
                            <div
                              className={`mt-1 w-px flex-1 ${
                                n < currentStage ? 'bg-amber/30' : 'bg-border'
                              }`}
                              style={{ minHeight: '2rem' }}
                            />
                          )}
                        </div>

                        {/* Label */}
                        <div className="pb-7">
                          <p
                            className={`text-sm font-medium leading-7 ${
                              isCurrent
                                ? 'text-ink'
                                : isCompleted
                                ? 'text-ink-muted'
                                : 'text-ink-muted/70'
                            }`}
                          >
                            {label}
                          </p>
                          {isCurrent && (
                            <p className="text-xs text-amber">Current stage</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Next steps */}
              <section>
                <h2 className="mb-5 text-sm font-semibold text-ink">
                  Next steps — {STAGES[currentStage - 1].label}
                </h2>
                <p className="mb-5 text-sm font-medium text-amber">{stageContent.title}</p>
                <ul className="space-y-3">
                  {stageContent.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Contact block */}
              <section className="rounded-sm border border-border bg-surface p-6">
                <h2 className="mb-4 text-sm font-semibold text-ink">Get in touch</h2>
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-xs text-ink-subtle">Email</p>
                    <a
                      href="mailto:brian@anvisco.com"
                      className="text-sm text-amber transition-colors duration-150 hover:underline"
                    >
                      brian@anvisco.com
                    </a>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-ink-subtle">Book a call</p>
                    <a
                      href={CALENDLY}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-amber transition-colors duration-150 hover:underline"
                    >
                      15-minute discovery call →
                    </a>
                  </div>
                </div>
              </section>
            </div>

            {/* Right: plan summary + payment status */}
            <aside className="space-y-5 lg:sticky lg:top-24">

              {/* Plan summary */}
              <div className="rounded-sm border border-border bg-surface p-6">
                <p className="mb-4 text-xs uppercase tracking-[0.2em] text-ink-subtle">
                  Plan summary
                </p>
                <h3 className="mb-5 text-xl font-semibold text-ink">{plan.name}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-ink-muted">Founding price</span>
                    <span className="font-semibold text-ink">{plan.total}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-ink-muted">Deposit paid</span>
                    <span className="font-semibold text-amber">{plan.deposit}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-ink-muted">Remaining balance</span>
                    <span className="text-ink-muted">{plan.remaining}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-ink-muted">Timeline</span>
                    <span className="text-ink-muted">{plan.timeline}</span>
                  </div>
                </div>
              </div>

              {/* Payment status */}
              <div className="rounded-sm border border-border bg-surface p-6">
                <p className="mb-4 text-xs uppercase tracking-[0.2em] text-ink-subtle">
                  Payment status
                </p>
                <div className="space-y-3">
                  {/* Deposit */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-ink-muted">Deposit</span>
                    <span
                      className={`rounded-sm border px-2 py-0.5 text-xs font-medium ${
                        currentStage >= 1
                          ? 'border-amber bg-transparent text-amber'
                          : 'border-border-strong bg-transparent text-ink-muted'
                      }`}
                    >
                      {currentStage >= 1 ? 'Received' : 'Pending'}
                    </span>
                  </div>

                  {/* Final payment */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-ink-muted">Final payment</span>
                    <span
                      className={`rounded-sm border px-2 py-0.5 text-xs font-medium ${
                        currentStage >= 6
                          ? 'border-amber bg-transparent text-amber'
                          : currentStage === 5
                          ? 'border-amber bg-transparent text-amber'
                          : 'border-border-strong bg-transparent text-ink-muted'
                      }`}
                    >
                      {currentStage >= 6 ? 'Received' : currentStage === 5 ? 'Due now' : 'Due before launch'}
                    </span>
                  </div>

                  {/* Care plan */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-ink-muted">Care Plan</span>
                    <span
                      className={`rounded-sm border px-2 py-0.5 text-xs font-medium ${
                        currentStage >= 6
                          ? 'border-border-strong bg-transparent text-ink-muted'
                          : 'border-border-strong bg-transparent text-ink-muted'
                      }`}
                    >
                      {currentStage >= 6 ? 'Available' : 'Available after launch'}
                    </span>
                  </div>
                </div>

                {/* Final payment CTA at stage 5 */}
                {currentStage === 5 && (
                  <>
                    <div className="my-5 border-t border-border" />
                    <p className="mb-3 text-sm text-ink-muted">
                      Ready to pay your final balance of{' '}
                      <span className="font-medium text-ink">{plan.remaining}</span>?
                    </p>
                    <a
                      href="mailto:brian@anvisco.com?subject=Final payment — ready to proceed"
                      className="flex min-h-[48px] w-full items-center justify-center rounded-sm border border-amber bg-transparent px-4 py-3 text-sm font-semibold text-amber transition-colors duration-150 hover:underline"
                    >
                      Request final invoice
                    </a>
                  </>
                )}

                {/* Care plan CTA at stage 6 */}
                {currentStage === 6 && (
                  <>
                    <div className="my-5 border-t border-border" />
                    <p className="mb-3 text-sm text-ink-muted">
                      Keep your site running smoothly with the Care Plan at $149/month.
                    </p>
                    <a
                      href="mailto:brian@anvisco.com?subject=Care Plan — interested"
                      className="flex min-h-[48px] w-full items-center justify-center rounded-sm border border-border-strong bg-transparent px-4 py-3 text-sm font-medium text-ink transition-colors duration-150 hover:border-amber"
                    >
                      Ask about the Care Plan
                    </a>
                  </>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
