import { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface AdminState {
  loading: boolean
  session: Session | null
  isAdmin: boolean
}

interface UseAdminReturn extends AdminState {
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
}

export function useAdmin(): UseAdminReturn {
  const [state, setState] = useState<AdminState>({
    loading: true,
    session: null,
    isAdmin: false,
  })

  async function resolveAdminState(session: Session | null) {
    if (!session || !supabase) {
      setState({ loading: false, session: null, isAdmin: false })
      return
    }
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
    setState({ loading: false, session, isAdmin: data?.role === 'admin' })
  }

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setState({ loading: false, session: null, isAdmin: false })
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      resolveAdminState(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      resolveAdminState(session)
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
    setState({ loading: false, session: null, isAdmin: false })
  }

  return { ...state, signIn, signOut }
}
