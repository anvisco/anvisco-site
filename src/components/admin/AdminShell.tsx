import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdmin } from '@/hooks/useAdmin'
import {
  isSupabaseConfigured,
  SUPABASE_NOT_CONFIGURED_MESSAGE,
} from '@/lib/supabase'

export const A_INPUT =
  'w-full border border-[var(--color-border-strong)] bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-amber focus:outline-none'
export const A_SELECT =
  'w-full border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3 py-2 text-sm text-ink focus:border-amber focus:outline-none'
export const A_BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 border border-amber px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-amber transition-all duration-150 hover:bg-amber/10 disabled:opacity-50 disabled:cursor-not-allowed'
export const A_BTN_GHOST =
  'inline-flex items-center gap-2 border border-[var(--color-border-strong)] px-4 py-2 text-[0.7rem] uppercase tracking-[0.08em] text-ink-muted transition-colors hover:border-amber hover:text-amber disabled:opacity-50'
export const A_BTN_DANGER =
  'inline-flex items-center gap-2 border border-[var(--color-border-strong)] px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.06em] text-ink-subtle transition-colors hover:border-amber/60 hover:text-amber'

interface AdminShellProps {
  children: React.ReactNode
  title?: string
}

export function AdminShell({ children, title }: AdminShellProps) {
  if (!isSupabaseConfigured) {
    return (
      <Page>
        <div className="max-w-lg border border-amber/60 bg-amber/5 p-6">
          <p className="mb-2 text-[0.7rem] uppercase tracking-[0.1em] text-amber">
            Backend not configured
          </p>
          <p className="text-sm leading-relaxed text-ink-muted">
            {SUPABASE_NOT_CONFIGURED_MESSAGE} See{' '}
            <code className="text-ink">BACKEND_SETUP.md</code> for the setup walkthrough.
          </p>
        </div>
      </Page>
    )
  }
  return <AuthGate title={title}>{children}</AuthGate>
}

function AuthGate({ children, title }: AdminShellProps) {
  const { loading, session, isAdmin, signIn, signOut } = useAdmin()

  if (loading) {
    return (
      <Page>
        <p className="text-sm text-ink-muted">Loading…</p>
      </Page>
    )
  }

  if (!session) {
    return (
      <Page>
        <LoginForm signIn={signIn} />
      </Page>
    )
  }

  if (!isAdmin) {
    return (
      <Page>
        <div className="max-w-sm">
          <p className="mb-2 text-[0.7rem] uppercase tracking-[0.1em] text-amber">
            Not authorized
          </p>
          <p className="mb-4 text-sm leading-relaxed text-ink-muted">
            This account does not have admin access. Sign in with the Anvis admin account.
          </p>
          <button onClick={signOut} className={A_BTN_GHOST}>
            Sign out
          </button>
        </div>
      </Page>
    )
  }

  return (
    <div className="dark min-h-screen bg-bg">
      <AdminHeader email={session.user.email ?? ''} signOut={signOut} title={title} />
      <main className="mx-auto max-w-screen-xl px-6 py-8 lg:px-12">{children}</main>
    </div>
  )
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen bg-bg">
      <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-12">{children}</div>
    </div>
  )
}

export function AdminHeader({
  email,
  signOut,
  title,
}: {
  email: string
  signOut: () => void
  title?: string
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-sm">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-12 h-14 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="shrink-0 text-sm font-medium text-ink hover:text-amber transition-colors"
          >
            Anvis
          </Link>
          <span className="text-ink-subtle text-sm">/</span>
          <Link
            to="/admin"
            className="shrink-0 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            admin
          </Link>
          {title && (
            <>
              <span className="text-ink-subtle text-sm">/</span>
              <span className="truncate max-w-[24ch] text-sm text-ink-subtle">{title}</span>
            </>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden text-xs text-ink-subtle sm:block truncate max-w-[22ch]">
            {email}
          </span>
          <button
            onClick={signOut}
            className="text-[0.7rem] uppercase tracking-[0.08em] text-ink-subtle hover:text-ink transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}

function LoginForm({
  signIn,
}: {
  signIn: (e: string, p: string) => Promise<string | null>
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = await signIn(email, password)
    setLoading(false)
    if (err) setError(err)
  }

  return (
    <div className="max-w-sm">
      <div className="mb-8">
        <p className="mb-2 text-[0.7rem] uppercase tracking-[0.1em] text-ink-subtle">
          Admin login
        </p>
        <h1 className="text-2xl font-medium tracking-tight text-ink">Sign in to admin.</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col gap-2">
          <span className="text-[0.7rem] uppercase tracking-[0.1em] text-ink-subtle">
            Email
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={A_INPUT}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[0.7rem] uppercase tracking-[0.1em] text-ink-subtle">
            Password
          </span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={A_INPUT}
          />
        </label>
        {error && (
          <p className="border border-amber/60 bg-amber/5 px-3 py-2 text-sm text-amber">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className={A_BTN_PRIMARY}>
          {loading ? 'Signing in…' : 'Sign in →'}
        </button>
      </form>
    </div>
  )
}
