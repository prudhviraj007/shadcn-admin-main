import { getSupabaseClient } from './client'
import type { Session, User } from '@supabase/supabase-js'

export type SupabaseAuthResult = {
  user: { id: string; email: string } | null
  error: Error | null
}

export type SupabaseSession = Session | null

export async function signUp(email: string, password: string, options?: {
  data?: Record<string, unknown>
}): Promise<SupabaseAuthResult> {
  const client = getSupabaseClient()
  if (!client) return { user: null, error: new Error('Supabase not configured') }

  const { data, error } = await client.auth.signUp({ 
    email, 
    password,
    options: options ? { data: options.data } : undefined
  })
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

export async function getCurrentSession(): Promise<{ session: SupabaseSession; error: Error | null }> {
  const client = getSupabaseClient()
  if (!client) return { session: null, error: new Error('Supabase not configured') }

  const { data, error } = await client.auth.getSession()
  if (error) return { session: null, error }
  return { session: data.session, error: null }
}

export async function getCurrentUser(): Promise<{ user: User | null; error: Error | null }> {
  const client = getSupabaseClient()
  if (!client) return { user: null, error: new Error('Supabase not configured') }

  const { data: { user }, error } = await client.auth.getUser()
  return { user, error }
}

export async function sendPasswordResetEmail(email: string): Promise<{ error: Error | null }> {
  const client = getSupabaseClient()
  if (!client) return { error: new Error('Supabase not configured') }

  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  return { error }
}

export async function updatePassword(password: string): Promise<{ error: Error | null }> {
  const client = getSupabaseClient()
  if (!client) return { error: new Error('Supabase not configured') }

  const { error } = await client.auth.updateUser({ password })
  return { error }
}

export function onAuthChange(callback: (event: string, session: SupabaseSession) => void): () => void {
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
