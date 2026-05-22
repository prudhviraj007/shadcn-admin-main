import { z } from 'zod'

const envSchema = z.object({
  MODE: z.enum(['development', 'production', 'test']),
  VITE_CLERK_PUBLISHABLE_KEY: z.string().optional().default(''),
  VITE_USE_SUPABASE: z
    .string()
    .optional()
    .default('false')
    .transform((v) => v === 'true'),
  VITE_SUPABASE_URL: z.string().optional().default(''),
  VITE_SUPABASE_ANON_KEY: z.string().optional().default(''),
  VITE_USE_OPENAI: z
    .string()
    .optional()
    .default('false')
    .transform((v) => v === 'true'),
  VITE_OPENAI_API_KEY: z.string().optional().default(''),
  VITE_OPENAI_MODEL: z.string().optional().default('gpt-4o-mini'),
  VITE_APP_URL: z.string().optional().default('http://localhost:5173'),
  VITE_SENTRY_DSN: z.string().optional().default(''),
  VITE_POSTHOG_KEY: z.string().optional().default(''),
  VITE_POSTHOG_HOST: z.string().optional().default('https://app.posthog.com'),
})

const parsed = envSchema.safeParse({
  MODE: import.meta.env.MODE,
  VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  VITE_USE_SUPABASE: import.meta.env.VITE_USE_SUPABASE,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_USE_OPENAI: import.meta.env.VITE_USE_OPENAI,
  VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  VITE_OPENAI_MODEL: import.meta.env.VITE_OPENAI_MODEL,
  VITE_APP_URL: import.meta.env.VITE_APP_URL,
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  VITE_POSTHOG_KEY: import.meta.env.VITE_POSTHOG_KEY,
  VITE_POSTHOG_HOST: import.meta.env.VITE_POSTHOG_HOST,
})

if (!parsed.success) {
  console.error(
    '[env] Invalid environment variables:',
    parsed.error.flatten().fieldErrors
  )
}

export const env = parsed.success
  ? parsed.data
  : {
      MODE: import.meta.env.MODE as 'development' | 'production' | 'test',
      VITE_CLERK_PUBLISHABLE_KEY: (import.meta.env
        .VITE_CLERK_PUBLISHABLE_KEY as string) ?? '',
      VITE_USE_SUPABASE: import.meta.env.VITE_USE_SUPABASE === 'true',
      VITE_SUPABASE_URL: (import.meta.env.VITE_SUPABASE_URL as string) ?? '',
      VITE_SUPABASE_ANON_KEY: (import.meta.env
        .VITE_SUPABASE_ANON_KEY as string) ?? '',
      VITE_USE_OPENAI: import.meta.env.VITE_USE_OPENAI === 'true',
      VITE_OPENAI_API_KEY: (import.meta.env
        .VITE_OPENAI_API_KEY as string) ?? '',
      VITE_OPENAI_MODEL: (import.meta.env.VITE_OPENAI_MODEL as string) ??
        'gpt-4o-mini',
      VITE_APP_URL: (import.meta.env.VITE_APP_URL as string) ??
        'http://localhost:5173',
      VITE_SENTRY_DSN: (import.meta.env.VITE_SENTRY_DSN as string) ?? '',
      VITE_POSTHOG_KEY: (import.meta.env.VITE_POSTHOG_KEY as string) ?? '',
      VITE_POSTHOG_HOST: (import.meta.env.VITE_POSTHOG_HOST as string) ??
        'https://app.posthog.com',
    }

export const isDev = env.MODE === 'development'
export const isProd = env.MODE === 'production'
export const hasClerk = !!env.VITE_CLERK_PUBLISHABLE_KEY
export const hasSupabase = env.VITE_USE_SUPABASE
export const hasOpenAI = env.VITE_USE_OPENAI
