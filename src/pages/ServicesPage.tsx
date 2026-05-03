import { motion } from 'motion/react'
import { Link, useNavigate } from 'react-router-dom'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { ModuleCard } from '@/components/sections/ModuleCard'
import { BuildTierCard } from '@/components/sections/BuildTierCard'
import { PlanCard } from '@/components/sections/PlanCard'
import { modules } from '@/data/modules'

const buildTiers = [
  {
    name: 'Essentials',
    publicPrice: '$2,200',
    foundingPrice: '$1,500',
    delivery: '7 to 10 days',
    features: [
      'Up to 5 pages.',
      'Mobile-first.',
      'Booking-focused.',
      'Basic AI-ready content structure.',
      'Local SEO foundations.',
    ],
  },
  {
    name: 'Standard',
    publicPrice: '$3,800',
    foundingPrice: '$2,600',
    delivery: '10 to 14 days',
    recommended: true,
    features: [
      'Up to 10 pages.',
      'Full AI-ready content architecture.',
      'Schema setup.',
      'Booking integration.',
      'One additional language.',
      'Conversion tracking.',
    ],
  },
  {
    name: 'Premium',
    publicPrice: '$6,500',
    foundingPrice: '$4,500',
    delivery: '14 to 21 days',
    features: [
      'Custom features.',
      'Portals, APIs, advanced flows.',
      'Up to two additional languages.',
      'Premium animations.',
      'CMS or easy editing layer.',
    ],
  },
]

const plans = [
  {
    name: 'Care Plan',
    price: '$149',
    features: [
      'Hosting and deployment support.',
      'Small content and image updates, up to 1 hour/month, rolls over up to 2 hours.',
      'Bug fixes.',
      'Security and uptime monitoring.',
      'Backups.',
      'Priority email support.',
      'Larger work scoped separately.',
    ],
  },
  {
    name: 'Growth Plan',
    price: '$449',
    features: [
      'Everything in Care Plan.',
      'Up to 3 hours of content or page updates monthly.',
      'One new or rebuilt service page per quarter.',
      'Monthly AI visibility check.',
      'GBP alignment review.',
      'Quarterly analytics review.',
      'Conversion improvements based on real traffic data.',
      'Caps reset monthly with one-month rollover.',
    ],
  },
]

export function ServicesPage() {
  const navigate = useNavigate()
  const goToBuild = () => navigate('/checkout?path=build')
  const goToRecurring = () => navigate('/checkout?path=recurring')
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="bg-[var(--color-bg)] py-24 md:py-32">
          <div className="mx-auto max-w-screen-xl px-6 lg:px-12">
            <BracketLabel>Services</BracketLabel>
            <h1 className="mb-8 mt-10 max-w-[14ch] text-[2.35rem] font-medium leading-[1.04] tracking-[-0.02em] text-ink sm:max-w-[15ch] sm:text-[3.5rem] md:max-w-4xl md:leading-[0.98] md:tracking-[-0.04em] md:text-[5rem]">
              <span className="block">Built modular.</span>
              <span className="block">Buy only the layer</span>
              <span className="block">your business needs.</span>
            </h1>
            <p className="max-w-[62ch] text-base leading-relaxed text-ink-muted sm:text-[1.125rem]">
              Anvis offers four ways to work together: an audit to start, modules to upgrade specific parts, a full custom build, and recurring plans to keep the site improving.
            </p>
            <Link
              to="/checkout"
              className="group mt-8 inline-flex items-center gap-2.5 border border-ink px-6 py-3 text-sm font-medium text-ink transition-all duration-200 hover:border-amber hover:text-amber"
            >
              Build Your Plan
              <span className="text-amber transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-[var(--color-surface)]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <SectionHeader number="01" label="How it works" title="The ladder." />
            <p className="max-w-[62ch] text-base leading-relaxed text-ink-muted sm:text-[1.0625rem]">
              Most agencies sell one thing: a full rebuild, whether or not it is the right move. Anvis is structured differently.
            </p>
            <p className="my-10 flex max-w-full flex-col items-start gap-2 overflow-hidden border-y border-[var(--color-border)] py-8 text-lg tracking-[-0.01em] text-ink sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:text-xl md:text-3xl md:tracking-[-0.02em]">
              <span className="text-amber">Audit</span>
              <span className="hidden text-ink-subtle sm:inline">→</span>
              <span className="text-amber">Modules</span>
              <span className="hidden text-ink-subtle sm:inline">→</span>
              <span className="text-amber">Full Build</span>
              <span className="hidden text-ink-subtle sm:inline">→</span>
              <span>Recurring</span>
            </p>
            <p className="max-w-[62ch] text-base leading-relaxed text-ink-muted sm:text-[1.0625rem]">
              Start where it makes sense. Upgrade when the business is ready.
            </p>
          </div>
        </section>

        <section id="audit" className="scroll-mt-16 bg-[var(--color-bg)] py-20 md:py-28">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <SectionHeader number="02" label="Audit" title="Audit" />
            <div className="grid gap-px bg-[var(--color-border)] md:grid-cols-2">
              <OptionCard
                title="Free AI-Ready Website Snapshot"
                body="Three to five priority findings. A quick first look at where the site may be losing visibility, trust, or bookings."
                cta="Get Free Audit"
                to="/audit"
              />
              <OptionCard
                title="Full Website Audit"
                body="A deeper review with a ranked action plan across visibility, trust, content, speed, and booking flow."
                cta="Start Your Audit"
                to="/checkout?path=audit"
              />
            </div>
          </div>
        </section>

        <section id="modules" className="scroll-mt-16 bg-[var(--color-surface)] py-20 md:py-28">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <SectionHeader number="03" label="Modules" title="Improvement Modules" />
            <p className="mb-12 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink-muted">
              For businesses that do not need a full rebuild yet. Six modules covering content, visuals, booking, motion, service pages, and mobile performance.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module, i) => (
                <div key={module.id} id={module.id} className="scroll-mt-24">
                  <ModuleCard
                    module={module}
                    index={i}
                    href={`/checkout?path=modules&module=${module.id}`}
                  />
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-ink-muted">Any three modules — 15% off the combined price.</p>
            <ContactLink label="Choose Your Upgrades" to="/checkout?path=modules" />
          </div>
        </section>

        <section id="build" className="scroll-mt-16 bg-[var(--color-bg)] py-20 md:py-28">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <SectionHeader number="04" label="Full custom build" title="Full Custom Build" />
            <p className="mb-12 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink-muted">
              Built around how your business actually operates, not around a template. Public rates start at $2,200, with founding rates available while founding slots remain.
            </p>
            <div className="grid grid-cols-1 border-t border-[var(--color-border)] lg:grid-cols-3">
              {buildTiers.map((tier, i) => (
                <BuildTierCard
                  key={tier.name}
                  {...tier}
                  index={i}
                  ctaLabel="Choose Your Build"
                  onCta={goToBuild}
                />
              ))}
            </div>
            <p className="mt-8 text-sm text-ink-muted">Payment: 50% deposit to start. Balance due before launch.</p>
          </div>
        </section>

        <section id="recurring" className="scroll-mt-16 bg-[var(--color-surface)] py-20 md:py-28">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <SectionHeader number="05" label="Recurring plans" title="Recurring Plans" />
            <p className="mb-12 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink-muted">
              Two plans depending on whether the goal is ongoing care or active growth.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {plans.map((plan, i) => (
                <PlanCard key={plan.name} {...plan} index={i} onCta={goToRecurring} />
              ))}
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
      <div className="mb-12 flex items-center gap-4 border-t border-[var(--color-border)] pt-7">
        <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">{number}</span>
        <BracketLabel>{label}</BracketLabel>
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-6 max-w-[18ch] text-[2rem] font-medium leading-[1.08] tracking-[-0.02em] text-ink md:text-[2.5rem]"
      >
        {title}
      </motion.h2>
    </>
  )
}

function OptionCard({ title, body, footnote, cta, to }: { title: string; body: string; footnote?: string; cta: string; to: string }) {
  return (
    <div className="flex min-h-[300px] flex-col bg-[var(--color-surface)] p-8">
      <h3 className="mb-4 text-lg font-medium tracking-[-0.01em] text-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-muted">{body}</p>
      {footnote && <p className="mt-5 text-sm leading-relaxed text-ink-muted">{footnote}</p>}
      <div className="mt-auto">
        <ContactLink label={cta} to={to} />
      </div>
    </div>
  )
}

function ContactLink({ label, to }: { label: string; to: string }) {
  return (
    <Link
      to={to}
      className="group mt-8 inline-flex items-center gap-2.5 border border-[var(--color-border-strong)] px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink transition-all duration-200 hover:border-amber hover:text-amber"
    >
      {label}
      <span className="text-amber transition-transform duration-200 group-hover:translate-x-0.5">→</span>
    </Link>
  )
}
