import { Link } from 'react-router-dom'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { CONTACT_URL, EMAIL } from '@/data/contact'

type StageKey = 'audit' | 'scope' | 'build' | 'launch'

interface StageContent {
  number: string
  title: string
  meaning: string
  next: string[]
  needs: string[]
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

const STAGES: Record<StageKey, StageContent> = {
  audit: {
    number: '01',
    title: 'Audit',
    meaning:
      'Brian reviews how the current site performs on visibility, trust, conversion, and AI-search readiness. The audit is a clear, ranked picture of what to fix - not a redesign pitch.',
    next: [
      'You receive the audit as a written summary or short Loom.',
      'Brian recommends the next move: a single module, a bundle, or a full build.',
      'Nothing else is committed until you say so.',
    ],
    needs: [
      'Your current website URL.',
      'The services you most want to attract more of.',
      'Any urgent issues on the site or in your booking flow.',
    ],
    primaryCta: { label: 'Book the audit call', href: CONTACT_URL },
    secondaryCta: { label: 'Read about the audit', href: '/audit' },
  },
  scope: {
    number: '02',
    title: 'Scope & recommend',
    meaning:
      'After the audit, scope is the agreement on exactly what gets built. Modules, pages, integrations, and timeline all get pinned down before any production work starts.',
    next: [
      'Brian sends a short recap of the scope and timeline.',
      'You confirm or adjust the scope.',
      'A 50% deposit (or audit fee credit) starts the build.',
    ],
    needs: [
      'Final list of services or pages to feature.',
      'Booking system, CRM, or integrations to connect.',
      'Any brand, copy, or photography you want used.',
    ],
    primaryCta: { label: 'Send a request', href: '/checkout' },
    secondaryCta: { label: 'Email Brian', href: `mailto:${EMAIL}` },
  },
  build: {
    number: '03',
    title: 'Build or upgrade',
    meaning:
      'Production. The selected module, bundle, or full build is made. Updates are short, specific, and tied to the scope.',
    next: [
      'Brian builds the agreed scope and shares a preview link.',
      'You review and request adjustments.',
      'Final balance is settled before launch.',
    ],
    needs: [
      'Timely review of preview links.',
      'Final copy or content where flagged.',
      'Confirmation on launch date.',
    ],
    primaryCta: { label: 'Open client portal', href: '/portal' },
    secondaryCta: { label: 'Email Brian', href: `mailto:${EMAIL}` },
  },
  launch: {
    number: '04',
    title: 'Launch + handover',
    meaning:
      'Go-live. Final QA, deployment, redirects, analytics, and a short handover so you understand what was built and how to update small things yourself.',
    next: [
      'Brian completes QA, redirects, and deployment.',
      'You walk through the site and handover notes.',
      'You decide whether to add a Care or Growth plan for ongoing support.',
    ],
    needs: [
      'Domain or DNS access.',
      'Analytics or tag accounts (if any).',
      'A short window for the launch walkthrough.',
    ],
    primaryCta: { label: 'See recurring plans', href: '/services#recurring' },
    secondaryCta: { label: 'Open client portal', href: '/portal' },
  },
}

export function NextStepsPage({ stage }: { stage: StageKey }) {
  const content = STAGES[stage]
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

          <div className="mb-12 border-t border-[var(--color-border)] pt-7">
            <div className="mb-6 flex items-center gap-4">
              <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">
                {content.number}
              </span>
              <BracketLabel>{`Next steps - ${content.title}`}</BracketLabel>
            </div>
            <h1 className="mb-5 max-w-[14ch] text-[2.5rem] font-medium leading-[1.04] tracking-[-0.03em] text-ink md:text-[3.75rem]">
              {content.title}.
            </h1>
            <p className="max-w-[60ch] text-base leading-relaxed text-ink-muted md:text-[1.0625rem]">
              {content.meaning}
            </p>
          </div>

          <section className="mb-12 grid gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-5 text-[0.7rem] uppercase tracking-[0.1em] text-ink-subtle">
                What happens next
              </p>
              <ul className="space-y-4">
                {content.next.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-ink-muted md:text-[0.95rem]"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 bg-amber" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-5 text-[0.7rem] uppercase tracking-[0.1em] text-ink-subtle">
                What Brian may need from you
              </p>
              <ul className="space-y-4">
                {content.needs.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-ink-muted md:text-[0.95rem]"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 bg-[var(--color-border-strong)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="flex flex-wrap gap-3 border-t border-[var(--color-border)] pt-8">
            <CtaLink href={content.primaryCta.href} primary>
              {content.primaryCta.label}
            </CtaLink>
            {content.secondaryCta && (
              <CtaLink href={content.secondaryCta.href}>{content.secondaryCta.label}</CtaLink>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function CtaLink({
  href,
  primary,
  children,
}: {
  href: string
  primary?: boolean
  children: React.ReactNode
}) {
  const className = `group inline-flex items-center gap-2.5 border px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] transition-all duration-200 ${
    primary
      ? 'border-amber text-amber hover:bg-amber/10'
      : 'border-[var(--color-border-strong)] text-ink hover:border-amber hover:text-amber'
  }`
  if (href.startsWith('http') || href.startsWith('mailto:')) {
    return (
      <a href={href} className={className}>
        {children}
        <span className="text-amber transition-transform duration-200 group-hover:translate-x-0.5">→</span>
      </a>
    )
  }
  return (
    <Link to={href} className={className}>
      {children}
      <span className="text-amber transition-transform duration-200 group-hover:translate-x-0.5">→</span>
    </Link>
  )
}
