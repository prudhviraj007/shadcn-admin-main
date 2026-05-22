import { getSupabaseClient } from './client'

export type SupabaseAuthResult = {
  user: { id: string; email: string } | null
  error: Error | null
}

export async function signUp(email: string, password: string): Promise<SupabaseAuthResult> {
  const client = getSupabaseClient()
  if (!client) return { user: null, error: new Error('Supabase not configured') }

  const { data, error } = await client.auth.signUp({ email, password })
  if (error) return { user: null, error }
  return {
    user: data.user ? { id: data.user.id, email: data.user.email ?? '' } : null,
    error: null,
  }
}

export async function signIn(email: string, password: string): Promise<SupabaseAuthResult> {
  const client = getSupabaseClient()
  if (!client) return { user: null, error: new Error('Supabase not configured') }

  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error) return { user: null, error }
  return {
    user: data.user ? { id: data.user.id, email: data.user.email ?? '' } : null,
    error: null,
  }
}

export async function signOut(): Promise<{ error: Error | null }> {
  const client = getSupabaseClient()
  if (!client) return { error: new Error('Supabase not configured') }

  const { error } = await client.auth.signOut()
  return { error }
}

export async function getCurrentSession() {
  const client = getSupabaseClient()
  if (!client) return { session: null, error: new Error('Supabase not configured') }

  const { data, error } = await client.auth.getSession()
  if (error) return { session: null, error }
  return { session: data.session, error: null }
}

export function onAuthChange(callback: (event: string, session: unknown) => void) {
  const client = getSupabaseClient()
  if (!client) {
    console.warn('[Supabase] Auth state changes unavailable — not configured')
    return () => {}
  }

  const {
    data: { subscription },
  } = client.auth.onAuthStateChange(callback)
  return () => subscription.unsubscribe()
}
