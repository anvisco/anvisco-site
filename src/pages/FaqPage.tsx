import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { Accordion } from '@/components/ui/Accordion'

const gettingStarted = [
  {
    question: 'Do I need a full rebuild?',
    answer:
      'Not always. Some businesses should start with an audit or a targeted module before they commit to a rebuild.',
  },
  {
    question: 'What happens after the audit?',
    answer:
      'Brian reviews the findings, confirms the best path, and points you toward a module, a build, or ongoing care.',
  },
  {
    question: 'Can you improve my existing site?',
    answer:
      'Yes. Modules are built for existing sites that need a stronger layer without starting over.',
  },
]

const aiAndDiscovery = [
  {
    question: 'What makes a website AI-ready?',
    answer:
      'Clear structure for people, Google, AI tools, Maps, and local recommendations. The site should explain the business clearly and consistently.',
  },
  {
    question: 'Is this replacing SEO?',
    answer:
      'No. It adds a modern discovery layer on top of SEO, not instead of it.',
  },
]

const servicesAndPricing = [
  {
    question: 'What are website improvement modules?',
    answer:
      'They are focused upgrades for the parts of a site that are holding it back, such as content, visuals, booking flow, speed, or service pages.',
  },
  {
    question: 'Can I bundle modules?',
    answer:
      'Yes. Three or more modules unlock the bundle discount automatically inside the plan builder.',
  },
  {
    question: 'What if I already know what I need?',
    answer:
      'You can skip around. If the path is clear, build your plan directly and choose the offer that fits.',
  },
]

const payments = [
  {
    question: 'Do I pay right away?',
    answer:
      'It depends. If you already know what your business needs, you can move forward and pay. If not, we first go through the right path together so the scope is clear before payment is finalized.',
  },
  {
    question: 'What happens after I build my plan?',
    answer:
      'Brian reviews the plan, confirms scope, and sends the next step, which may be a payment link, invoice, or setup details.',
  },
]

const care = [
  {
    question: 'What is the difference between the Care Plan and Growth Plan?',
    answer:
      'Care Plan keeps the site running with small updates, monitoring, and support. Growth Plan adds more monthly page work, monthly visibility checks, and quarterly improvements.',
  },
]

export function FaqPage() {
  return (
    <>
      <Nav />
      <main className="pt-16 bg-[var(--color-bg)]">
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-screen-xl px-6 lg:px-12">
            <BracketLabel>FAQ</BracketLabel>
            <h1 className="mt-10 mb-6 max-w-4xl text-[2.75rem] sm:text-[3.5rem] md:text-[5rem] font-medium leading-[1.02] md:leading-[0.98] tracking-[-0.03em] md:tracking-[-0.04em] text-ink">
              Common questions.
            </h1>
            <p className="max-w-[62ch] text-base leading-relaxed text-ink-muted sm:text-[1.125rem]">
              Clear answers about audits, modules, builds, payments, and how the process works.
            </p>
          </div>
        </section>

        <FaqGroup number="01" label="Getting started" items={gettingStarted} />
        <FaqGroup number="02" label="AI and discovery" items={aiAndDiscovery} tone="surface" />
        <FaqGroup number="03" label="Services and pricing" items={servicesAndPricing} />
        <FaqGroup number="04" label="Payments" items={payments} tone="surface" />
        <FaqGroup number="05" label="Care" items={care} />
      </main>
      <Footer />
    </>
  )
}

function FaqGroup({
  number,
  label,
  items,
  tone = 'bg',
}: {
  number: string
  label: string
  items: { question: string; answer: string }[]
  tone?: 'bg' | 'surface'
}) {
  return (
    <section className={tone === 'surface' ? 'bg-[var(--color-surface)] py-20 md:py-28' : 'bg-[var(--color-bg)] py-20 md:py-28'}>
      <div className="mx-auto max-w-screen-xl px-6 lg:px-12">
        <div className="mb-12 flex items-center gap-4 border-t border-[var(--color-border)] pt-7">
          <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">{number}</span>
          <BracketLabel>{label}</BracketLabel>
        </div>
        <div className="max-w-[72ch]">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  )
}
