import { Link } from 'react-router-dom'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { EMAIL } from '@/data/contact'

export function CheckoutSuccessPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen pt-16 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-12 lg:py-24">
          <div className="max-w-2xl border-t border-[var(--color-border)] pt-7">
            <div className="mb-6 flex items-center gap-4">
              <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">/</span>
              <BracketLabel>Plan received</BracketLabel>
            </div>

            <h1 className="mb-5 text-[2.5rem] font-medium leading-[1.04] tracking-[-0.03em] text-ink md:text-[3.5rem]">
              Plan received.
            </h1>

            <p className="mb-10 max-w-[58ch] text-base leading-relaxed text-ink-muted md:text-[1.0625rem]">
              Your plan has been received. Brian will follow up with the next step, payment link,
              or setup details based on what you selected.
            </p>

            <div className="mb-10 grid gap-6 border-y border-[var(--color-border)] py-8">
              <Step n="01" title="Confirm scope">
                Brian reviews the plan and replies with a recap, any clarifying questions, and a
                short timeline.
              </Step>
              <Step n="02" title="Payment or setup">
                Audits and modules use a payment link or invoice. Builds use a 50% deposit.
                Recurring plans use a monthly subscription.
              </Step>
              <Step n="03" title="Kickoff">
                Once payment or setup is confirmed, work starts.
              </Step>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2.5 border border-[var(--color-border-strong)] px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink transition-all duration-200 hover:border-amber hover:text-amber"
              >
                Back to home
                <span className="text-amber">→</span>
              </Link>
              <Link
                to="/audit"
                className="inline-flex items-center gap-2.5 border border-[var(--color-border)] px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink-muted transition-all duration-200 hover:border-amber hover:text-amber"
              >
                Read about the audit
                <span className="text-amber">→</span>
              </Link>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2.5 px-2 py-3 font-sans text-sm text-ink-muted transition-colors duration-150 hover:text-amber"
              >
                Questions? {EMAIL}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <span className="mt-0.5 shrink-0 font-mono text-xs font-medium text-amber">{n}</span>
      <div>
        <p className="mb-1 text-sm font-medium text-ink">{title}</p>
        <p className="max-w-[58ch] text-sm leading-relaxed text-ink-muted">{children}</p>
      </div>
    </div>
  )
}
