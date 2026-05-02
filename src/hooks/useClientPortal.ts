import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

interface ClientPortalState {
  loading: boolean
  session: Session | null
}

interface UseClientPortalReturn extends ClientPortalState {
  sendMagicLink: (email: string) => Promise<string | null>
  signOut: () => Promise<void>
}

export function normalizePortalEmailError(message: string | null): string | null {
  if (!message) return null

  const normalized = message.toLowerCase()
  if (
    normalized.includes('rate limit') ||
    normalized.includes('rate-limit') ||
    normalized.includes('too many') ||
    normalized.includes('over_email_send_rate_limit') ||
    normalized.includes('email send rate limit') ||
    normalized.includes('security')
  ) {
    return 'Email sending is temporarily rate-limited. Try again later or contact brian@anvisco.com.'
  }

  return message
}

export function useClientPortal(): UseClientPortalReturn {
  const [state, setState] = useState<ClientPortalState>({
    loading: true,
    session: null,
  })

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      Promise.resolve().then(() => setState({ loading: false, session: null }))
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({ loading: false, session })
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ loading: false, session })
    })

    return () => subscription.unsubscribe()
  }, [])

  async function sendMagicLink(email: string): Promise<string | null> {
    if (!supabase) return 'Supabase not configured.'
    const normalizedEmail = email.trim().toLowerCase()
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/portal`,
      },
    })
    return normalizePortalEmailError(error?.message ?? null)
  }

  async function signOut(): Promise<void> {
    if (supabase) await supabase.auth.signOut()
    setState({ loading: false, session: null })
  }

  return { ...state, sendMagicLink, signOut }
}
