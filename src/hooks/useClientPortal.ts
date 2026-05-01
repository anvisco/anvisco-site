import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

interface ClientPortalState {
  loading: boolean
  session: Session | null
}

interface UseClientPortalReturn extends ClientPortalState {
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
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

  async function signIn(email: string, password: string): Promise<string | null> {
    if (!supabase) return 'Supabase not configured.'
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error?.message ?? null
  }

  async function signOut(): Promise<void> {
    if (supabase) await supabase.auth.signOut()
    setState({ loading: false, session: null })
  }

  return { ...state, signIn, signOut }
}
