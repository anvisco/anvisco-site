import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { isSupabaseConfigured, supabase, SUPABASE_NOT_CONFIGURED_MESSAGE } from '@/lib/supabase'

type ClaimClientProfileResponse =
  | { linked: true; client_id: string; alreadyLinked?: boolean }
  | { linked: false; reason: 'no_matching_client' }

function hasHashRecoveryTokens(): boolean {
  if (typeof window === 'undefined') return false
  const hash = window.location.hash
  return (
    hash.includes('type=recovery') ||
    hash.includes('access_token=') ||
    hash.includes('refresh_token=')
  )
}

function readRecoveryCode(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('code')
}

export function SetPasswordPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [recovering, setRecovering] = useState(() => isSupabaseConfigured && Boolean(supabase))
  const [recoverySession, setRecoverySession] = useState(hasHashRecoveryTokens())
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('Password created.')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return
    }

    let alive = true
    const client = supabase
    const code = readRecoveryCode()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!alive) return
      setSession(nextSession)
      if (event === 'PASSWORD_RECOVERY') {
        setRecoverySession(true)
      }
    })

    async function verifyRecoverySession() {
      setError(null)

      try {
        if (code) {
          const { error: exchangeError } = await client.auth.exchangeCodeForSession(code)
          if (!alive) return
          if (exchangeError) {
            setError(exchangeError.message)
            setSession(null)
            setRecoverySession(false)
            return
          }
          setRecoverySession(true)
        }

        const { data, error: sessionError } = await client.auth.getSession()
        if (!alive) return

        if (sessionError) {
          setError(sessionError.message)
          setSession(null)
          return
        }

        setSession(data.session)
        if (data.session && hasHashRecoveryTokens()) {
          setRecoverySession(true)
        }
      } catch (thrownError) {
        if (!alive) return
        setError(thrownError instanceof Error ? thrownError.message : 'Could not verify the secure setup link.')
        setSession(null)
      } finally {
        if (alive) setRecovering(false)
      }
    }

    void verifyRecoverySession()

    return () => {
      alive = false
      subscription.unsubscribe()
    }
  }, [])

  const canEditPassword = Boolean(session) && recoverySession
  const passwordError =
    password.length > 0 && password.length < 8
      ? 'Password must be at least 8 characters.'
      : confirmPassword.length > 0 && password !== confirmPassword
        ? 'Passwords do not match.'
        : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSuccessMessage('Password created.')

    if (!canEditPassword) {
      setError('Open the secure password setup link from your email first.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!supabase) {
      setError('Supabase not configured.')
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    try {
      const { data: claimData, error: claimError } = await supabase.functions.invoke<ClaimClientProfileResponse>(
        'claim-client-profile',
        { method: 'POST' },
      )

      if (claimError) {
        setSuccessMessage('Password created. Your portal access may still need to be connected.')
      } else if (claimData?.linked) {
        setSuccessMessage('Password created. Your client profile is connected.')
      } else {
        setSuccessMessage('Password created. Your portal access may still need to be connected.')
      }
    } catch {
      setSuccessMessage('Password created. Your portal access may still need to be connected.')
    }

    setSuccess(true)
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen pt-16 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-12 lg:py-24">
          <div className="max-w-2xl border-t border-[var(--color-border)] pt-7">
            <div className="mb-6 flex items-center gap-4">
              <span className="text-[0.7rem] font-medium tracking-[0.08em] text-amber tabular-nums">
                /set-password
              </span>
              <BracketLabel>Secure setup</BracketLabel>
            </div>

            <h1 className="mb-4 text-[2.5rem] font-medium leading-[1.04] tracking-[-0.03em] text-ink md:text-[3.5rem]">
              Create your portal password.
            </h1>

            <p className="max-w-[62ch] text-base leading-relaxed text-ink-muted md:text-[1.0625rem]">
              {success
                ? successMessage
                : 'Use the secure password setup link from your email to create a new portal password.'}
            </p>

            {!isSupabaseConfigured && (
              <div className="mt-6 border border-amber/60 bg-amber/5 px-5 py-4 text-sm text-amber">
                {SUPABASE_NOT_CONFIGURED_MESSAGE}
              </div>
            )}

            {isSupabaseConfigured && recovering && !success && (
              <div className="mt-6 border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-sm leading-relaxed text-ink-muted">
                Verifying your secure setup link...
              </div>
            )}

            {isSupabaseConfigured && !recovering && !canEditPassword && !success && (
              <div className="mt-6 border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-sm leading-relaxed text-ink-muted">
                Open the secure password setup link from your email first. This page needs the
                Supabase recovery session before you can set a new password.
              </div>
            )}

            {isSupabaseConfigured && !recovering && canEditPassword && !success && (
              <section className="mt-8 border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <div className="mb-5 border-t border-[var(--color-border)] pt-6">
                  <p className="mb-2 text-[0.7rem] uppercase tracking-[0.08em] text-ink-subtle">
                    Password setup
                  </p>
                  <h2 className="text-lg font-medium tracking-[-0.01em] text-ink">
                    Set a new password
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Field label="New password" required>
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <Field label="Confirm password" required>
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </Field>

                  <p className="text-sm text-ink-muted">Password must be at least 8 characters.</p>

                  {passwordError && (
                    <p className="border border-amber/60 bg-amber/5 px-3 py-2 text-sm text-amber">
                      {passwordError}
                    </p>
                  )}

                  {error && (
                    <p className="border border-amber/60 bg-amber/5 px-3 py-2 text-sm text-amber">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 border border-amber px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-amber transition-all duration-200 hover:bg-amber/10 disabled:opacity-60"
                  >
                    {loading ? 'Saving…' : 'Create password'}
                    <span className="text-amber">→</span>
                  </button>
                </form>
              </section>
            )}

            {success && (
              <section className="mt-8 border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <p className="text-sm leading-relaxed text-ink-muted">{successMessage}</p>
                <div className="mt-5">
                  <Link
                    to="/portal"
                    className="inline-flex items-center gap-2 border border-amber px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-amber transition-all duration-200 hover:bg-amber/10"
                  >
                    Go to Client Portal
                    <span className="text-amber">→</span>
                  </Link>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.08em] text-ink-subtle">
        {label}
        {required ? ' *' : ''}
      </span>
      {children}
    </label>
  )
}

const INPUT_CLASS =
  'w-full border border-[var(--color-border-strong)] bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-amber focus:outline-none'
