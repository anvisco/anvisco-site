import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { BracketLabel } from '@/components/ui/BracketLabel'
import {
  isSupabaseConfigured,
  SUPABASE_NOT_CONFIGURED_MESSAGE,
} from '@/lib/supabase'

const SECTIONS = [
  {
    title: 'Clients',
    body: 'Lead, active, paused, completed, or archived. Linked to auth users via client_users.',
  },
  {
    title: 'Packages',
    body: 'Audit, modules, build, or recurring. Status flows requested → scoped → in_progress → complete.',
  },
  {
    title: 'Payments',
    body: 'Schedules with hosted Stripe Payment Links. Status flows pending → paid. No card data stored.',
  },
  {
    title: 'Project stages',
    body: 'Audit, scope, build, launch, support, complete. Updates can be flagged visible to clients.',
  },
  {
    title: 'Emails',
    body: 'Logs and templates. Admin only. Sending wires up in a later pass.',
  },
]

export function AdminPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen pt-16 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-12 lg:py-24">
          <div className="mb-12 border-t border-[var(--color-border)] pt-7">
            <div className="mb-6 flex items-center gap-4">
              <span className="text-[0.7rem] tabular-nums text-amber font-medium tracking-[0.08em]">/admin</span>
              <BracketLabel>Internal</BracketLabel>
            </div>
            <h1 className="mb-5 max-w-[18ch] text-[2.5rem] font-medium leading-[1.04] tracking-[-0.03em] text-ink md:text-[3.5rem]">
              Anvisco admin.
            </h1>
            <p className="max-w-[58ch] text-base leading-relaxed text-ink-muted">
              Internal control panel for clients, packages, payments, project stages, and emails.
              Login and full management land in a later pass.
            </p>
          </div>

          {!isSupabaseConfigured ? (
            <NotConfigured />
          ) : (
            <NoSession />
          )}

          <section className="mt-12">
            <p className="mb-5 text-[0.7rem] uppercase tracking-[0.1em] text-ink-subtle">
              Planned sections
            </p>
            <div className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
              {SECTIONS.map((s) => (
                <div key={s.title} className="bg-[var(--color-surface)] p-6">
                  <h2 className="mb-2 text-base font-medium text-ink">{s.title}</h2>
                  <p className="text-sm leading-relaxed text-ink-muted">{s.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

function NotConfigured() {
  return (
    <div className="border border-amber/60 bg-amber/5 p-6">
      <p className="mb-2 text-[0.7rem] uppercase tracking-[0.1em] text-amber">Setup required</p>
      <p className="max-w-[62ch] text-sm leading-relaxed text-ink-muted">
        {SUPABASE_NOT_CONFIGURED_MESSAGE} See <code className="text-ink">BACKEND_SETUP.md</code> for
        the full setup walkthrough.
      </p>
    </div>
  )
}

function NoSession() {
  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <p className="mb-2 text-[0.7rem] uppercase tracking-[0.1em] text-ink-subtle">
        Login coming next pass
      </p>
      <p className="max-w-[62ch] text-sm leading-relaxed text-ink-muted">
        Supabase is configured. Admin auth and dashboard wire up in Pass 2. For now, run admin
        actions in the Supabase SQL editor or table view.
      </p>
    </div>
  )
}
