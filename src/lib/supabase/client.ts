import { createClient } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (!url || !key) {
      console.warn(
        '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them in .env to enable Supabase.'
      )
      return null
    }
    supabaseClient = createClient(url, key)
  }
  return supabaseClient
}

export function isSupabaseEnabled() {
  return import.meta.env.VITE_USE_SUPABASE === 'true'
}
