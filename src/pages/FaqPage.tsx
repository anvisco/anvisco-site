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
      'Brian reviews the findings, confirms the best path, and points you toward a module, a build, or ongoing care. You leave with a clear next step, not a vague recommendation.',
  },
  {
    question: 'Can you improve my existing site?',
    answer:
      'Yes. Modules are built for existing sites that need a stronger layer without starting over. They can improve content, booking flow, speed, or visuals one step at a time.',
  },
]

const aiAndDiscovery = [
  {
    question: 'What makes a website AI-ready?',
    answer:
      'Clear structure for people, Google, AI tools, Maps, and local recommendations. The site should explain the business clearly and consistently so those systems can understand what the business does and where it should show up.',
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
      'Yes. Three or more modules unlock the bundle discount automatically inside the plan builder. That usually makes it easier to improve several weak points without committing to a full rebuild.',
  },
  {
    question: 'What if I already know what I need?',
    answer:
      'You can move straight into the plan builder and choose the offer that fits. If the scope is already clear, that is usually the fastest path.',
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
      'Brian reviews the plan, confirms scope, and sends the next step. That may be Stripe checkout, an invoice, or setup details depending on the path you selected.',
  },
]

const care = [
  {
    question: 'What is the difference between the Care Plan and Growth Plan?',
    answer:
      'Care Plan keeps the site running with small updates, monitoring, and support. Growth Plan adds more monthly page work, monthly visibility checks, and quarterly improvements for sites that need steady ongoing progress.',
  },
]

export function FaqPage() {
  return (
    <>
      <Nav />
      <main className="pt-16 bg-[var(--color-bg)]">
        <section className="py-12 md:py-16 lg:py-20">
          <div className="mx-auto max-w-screen-2xl px-6 lg:px-12 xl:px-16">
            <BracketLabel>FAQ</BracketLabel>
            <h1 className="mb-5 mt-8 max-w-4xl text-[2rem] font-medium leading-[1.02] tracking-[-0.03em] text-ink sm:text-[2.75rem] md:leading-[0.98] md:tracking-[-0.04em] md:text-[5rem]">
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
        <FaqGroup number="05" label="Monthly plans" items={care} />
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
    <section className={tone === 'surface' ? 'bg-[var(--color-surface)] py-6 md:py-8 lg:py-10' : 'bg-[var(--color-bg)] py-6 md:py-8 lg:py-10'}>
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-12 xl:px-16">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
          <div className="border-t border-[var(--color-border)] pt-6">
            <span className="mb-3 block text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">{number}</span>
            <BracketLabel>{label}</BracketLabel>
          </div>
          <div className="max-w-[78ch]">
            <Accordion items={items} />
          </div>
        </div>
      </div>
    </section>
  )
}
