import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ClerkProvider, useAuth } from '@clerk/react'
import { Loader2 } from 'lucide-react'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { hasClerk, hasSupabase } from '@/lib/env'
import { useAuth as useSupabaseAuth } from '@/hooks/use-auth'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    if (hasClerk) {
      const publicPaths = [
        '/clerk/sign-in',
        '/clerk/sign-up',
        '/sign-in',
        '/sign-up',
      ]
      if (publicPaths.some((p) => location.pathname.startsWith(p))) return
    }
  },
  component: AuthGate,
})

function AuthGate() {
  if (hasClerk) return <ClerkAuthGuardWithProvider />

  return <SupabaseAuthGuard />
}

function ClerkAuthGuardWithProvider() {
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl='/clerk/sign-in'
      signInUrl='/clerk/sign-in'
      signUpUrl='/clerk/sign-up'
      signInFallbackRedirectUrl='/'
      signUpFallbackRedirectUrl='/'
    >
      <ClerkAuthGuard />
    </ClerkProvider>
  )
}

function ClerkAuthGuard() {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({ to: '/clerk/sign-in', replace: true })
    }
  }, [isLoaded, isSignedIn, navigate])

  if (!isLoaded || !isSignedIn) {
    return (
      <div className='flex h-svh items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return <AuthenticatedLayout />
}

function SupabaseAuthGuard() {
  const { isAuthenticated, isLoading } = useSupabaseAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!hasSupabase && !hasClerk) {
      return
    }

    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/sign-in', replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className='flex h-svh items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (!isAuthenticated && hasSupabase) {
    return (
      <div className='flex h-svh items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return <AuthenticatedLayout />
}
