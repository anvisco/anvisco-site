import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { FREE_AUDIT_URL } from '@/data/contact'
import { Link } from 'react-router-dom'

const reviewAreas = [
  ['AI discovery readiness', 'can AI search tools and Google AI results clearly understand and recommend the business?'],
  ['Local SEO structure', 'is the site structured for local intent and Maps visibility?'],
  ['Service page clarity', 'are services clearly explained, structured, and findable?'],
  ['Schema and structured data', 'is the site giving search systems machine-readable signals?'],
  ['Mobile speed and performance', 'does the site load fast and feel right on mobile?'],
  ['Booking flow', 'how easy is it to go from visitor to appointment?'],
  ['Trust signals', 'reviews, real photos, provider clarity, credentials.'],
  ['Content gaps', 'what is missing that prospects actually search for?'],
]

const snapshotItems = [
  'Three to five priority findings.',
  'A quick first look at where the site may be losing visibility, trust, or bookings.',
]

const fullAuditItems = [
  'A deeper review with a ranked action plan across visibility, trust, content, speed, and booking flow.',
]

export function AuditPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="py-16 md:py-24 lg:py-32 bg-[var(--color-bg)]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <BracketLabel>Audit</BracketLabel>
            <h1 className="mt-8 mb-5 max-w-4xl break-words text-[2.35rem] sm:text-[3.5rem] md:mb-8 md:mt-10 md:text-[5rem] font-medium leading-[1.04] md:leading-[0.98] tracking-[-0.02em] md:tracking-[-0.04em] text-ink">
              Find out what your website is missing.
            </h1>
            <p className="mb-7 max-w-[30ch] break-words text-base leading-relaxed text-ink-muted sm:max-w-[62ch] sm:text-[1.125rem] md:mb-10">
              A focused review of how your site performs on visibility, trust, conversion, and AI-search readiness, so you know exactly where to invest before spending on a rebuild.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <AuditCta label="Get Free Audit" />
              <AuditCta label="Start Your Audit" to="/checkout?path=audit" subtle />
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 lg:py-28 bg-[var(--color-surface)]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <SectionHeader number="01" label="Two ways" title="Two ways to start." />
            <div className="grid items-stretch gap-4 md:grid-cols-2">
              <AuditOption
                title="Free AI-Ready Website Snapshot"
                items={snapshotItems}
                bestFor="Businesses wanting a quick second opinion before committing to anything."
                cta="Get Free Audit"
              />
              <AuditOption
                title="Full Website Audit"
                items={fullAuditItems}
                bestFor="Businesses that want a clear, ranked plan before deciding what to invest in."
                cta="Start Your Audit"
                to="/checkout?path=audit"
              />
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 lg:py-28 bg-[var(--color-bg)]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <SectionHeader number="02" label="Review areas" title="What gets reviewed." />
            <p className="mb-12 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink-muted">
              Eight areas. Each one is a real source of lost visibility, trust, or bookings.
            </p>
            <div className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
              {reviewAreas.map(([title, body]) => (
                <div key={title} className="bg-[var(--color-surface)] p-6">
                  <h3 className="mb-3 text-sm font-medium text-ink">{title}</h3>
                  <p className="text-sm leading-relaxed text-ink-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 lg:py-28 bg-[var(--color-surface)]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <SectionHeader number="03" label="Outcome" title="What you walk away with." />
            <div className="max-w-[68ch] space-y-5 text-base leading-relaxed text-ink-muted md:text-[1.0625rem]">
              <p>
                A clear, ranked list of fixes. Not a redesign pitch. Not a sales document. A practical breakdown of where the site is leaking visibility, trust, or bookings, and what the highest-leverage moves are.
              </p>
              <p>
                If a rebuild is the right move, the audit will say so. If it is not, the audit will say that too.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 lg:py-28 bg-[var(--color-bg)]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <h2 className="mb-5 text-[1.875rem] font-medium tracking-[-0.03em] leading-[1.05] text-ink md:mb-6 md:text-[2.5rem] lg:text-[3rem]">
              Start with the audit.
            </h2>
            <p className="mb-7 max-w-[62ch] text-base leading-relaxed text-ink-muted md:mb-10 md:text-[1.125rem]">
              Most practices spend money on the wrong fix because they never had a clear picture of what was actually broken. The audit fixes that.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <AuditCta label="Get Free Audit" />
              <AuditCta label="Start Your Audit" to="/checkout?path=audit" subtle />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function SectionHeader({ number, label, title }: { number: string; label: string; title: string }) {
  return (
    <>
      <div className="mb-8 flex items-center gap-4 border-t border-[var(--color-border)] pt-7 md:mb-12">
        <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">{number}</span>
        <BracketLabel>{label}</BracketLabel>
      </div>
      <h2 className="mb-5 text-[2rem] md:mb-6 md:text-[2.5rem] font-medium tracking-[-0.02em] text-ink leading-[1.1]">
        {title}
      </h2>
    </>
  )
}

function AuditOption({
  title,
  items,
  bestFor,
  credit,
  cta,
  to,
}: {
  title: string
  items: string[]
  bestFor: string
  credit?: string
  cta: string
  to?: string
}) {
  return (
    <div className="flex min-w-0 flex-col border border-[var(--color-border)] bg-[var(--color-bg)] p-8">
      <h3 className="mb-6 text-lg font-medium tracking-[-0.01em] text-ink">{title}</h3>
      <ul className="mb-6 max-w-[28ch] space-y-3 sm:max-w-none">
        {items.map((item) => (
          <li key={item} className="flex min-w-0 gap-3 text-sm leading-relaxed text-ink-muted">
            <span className="mt-2 h-1 w-1 shrink-0 bg-[var(--color-border-strong)]" />
            <span className="min-w-0 break-words">{item}</span>
          </li>
        ))}
      </ul>
      <p className="max-w-[28ch] break-words text-sm leading-relaxed text-ink-muted sm:max-w-none"><span className="text-ink">Best for:</span> {bestFor}</p>
      {credit && <p className="mt-4 max-w-[28ch] break-words text-sm leading-relaxed text-ink-muted sm:max-w-none"><span className="text-ink">Credit:</span> {credit}</p>}
      <div className="mt-auto">
        <AuditCta label={cta} to={to} compact />
      </div>
    </div>
  )
}

function AuditCta({ label, to, subtle, compact }: { label: string; to?: string; subtle?: boolean; compact?: boolean }) {
  const className = `group inline-flex w-full items-center justify-center gap-2.5 border px-6 py-3 text-sm font-medium tracking-[-0.005em] transition-all duration-200 hover:border-amber hover:text-amber sm:w-auto sm:justify-start ${
    compact ? 'mt-8' : ''
  } ${subtle ? 'border-[var(--color-border-strong)] text-ink-muted' : 'border-ink text-ink'}`

  const content = (
    <>
      {label}
      <span className="text-amber transition-transform duration-200 group-hover:translate-x-0.5">→</span>
    </>
  )

  return to ? (
    <Link to={to} className={className}>
      {content}
    </Link>
  ) : (
    <a
      href={FREE_AUDIT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  )
}
