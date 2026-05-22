import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  signIn,
  signUp,
  signOut,
  getCurrentSession,
  getCurrentUser,
  sendPasswordResetEmail,
  updatePassword,
  onAuthChange,
  type SupabaseSession,
} from '@/lib/supabase/auth'
import { useAuthStore } from '@/stores/auth-store'
import { hasClerk, hasSupabase, isDev } from '@/lib/env'

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: string[]
  clinicId?: string
  app_metadata?: Record<string, unknown>
  user_metadata?: Record<string, unknown>
}

interface AuthContextType {
  user: AuthUser | null
  session: SupabaseSession
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ error: Error | null }>
  register: (email: string, password: string, data?: { fullName?: string; clinicName?: string }) => Promise<{ error: Error | null }>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<{ error: Error | null }>
  resetPassword: (password: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function mapUserToAuthUser(user: { id: string; email: string } | null): AuthUser | null {
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    role: ['user'],
  }
}

function useAuthLogic(): AuthContextType {
  const [session, setSession] = useState<SupabaseSession>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const queryClient = useQueryClient()
  const { auth } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (hasClerk) {
      setIsLoading(false)
      return
    }

    if (!hasSupabase) {
      const token = auth.accessToken
      if (token) {
        setUser({
          id: 'mock-user-id',
          email: 'mock@example.com',
          role: ['user'],
        })
        setSession({
          access_token: token,
          refresh_token: '',
          expires_in: 3600,
          expires_at: Date.now() / 1000 + 3600,
          token_type: 'bearer',
          user: null,
        })
      }
      setIsLoading(false)
      return
    }

    let mounted = true

    async function initAuth() {
      try {
        const { session: currentSession, error } = await getCurrentSession()
        if (!mounted) return

        if (error) {
          console.error('[Auth] Failed to get session:', error)
          setSession(null)
          setUser(null)
          return
        }

        setSession(currentSession)

        if (currentSession?.user) {
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email ?? '',
            role: ['user'],
            app_metadata: currentSession.user.app_metadata,
            user_metadata: currentSession.user.user_metadata,
          })
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('[Auth] Initialization error:', err)
        setSession(null)
        setUser(null)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initAuth()

    const unsubscribe = onAuthChange(async (_event, newSession) => {
      if (!mounted) return

      setSession(newSession)

      if (newSession?.user) {
        setUser({
          id: newSession.user.id,
          email: newSession.user.email ?? '',
          role: ['user'],
          app_metadata: newSession.user.app_metadata,
          user_metadata: newSession.user.user_metadata,
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [hasClerk, hasSupabase, auth.accessToken])

  const login = useCallback(async (email: string, password: string) => {
    if (hasClerk) {
      return { error: new Error('Clerk is enabled - use Clerk auth') }
    }

    if (!hasSupabase) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockUser = {
        id: 'ACC001',
        email: email,
        role: ['user'],
      }
      setUser(mockUser)
      setSession({
        access_token: 'mock-access-token',
        refresh_token: '',
        expires_in: 3600,
        expires_at: Date.now() / 1000 + 3600,
        token_type: 'bearer',
        user: null,
      })
      auth.setUser({
        accountNo: 'ACC001',
        email: email,
        role: ['user'],
        exp: Date.now() + 24 * 60 * 60 * 1000,
      })
      auth.setAccessToken('mock-access-token')
      return { error: null }
    }

    setIsLoading(true)
    try {
      const result = await signIn(email, password)
      if (result.error) {
        toast.error(result.error.message || 'Login failed')
        return { error: result.error }
      }
      toast.success(`Welcome back, ${result.user?.email}!`)
      return { error: null }
    } finally {
      setIsLoading(false)
    }
  }, [hasClerk, hasSupabase, auth])

  const register = useCallback(async (email: string, password: string, data?: { fullName?: string; clinicName?: string }) => {
    if (hasClerk) {
      return { error: new Error('Clerk is enabled - use Clerk auth') }
    }

    if (!hasSupabase) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success(`Account created for ${email}. Please sign in.`)
      return { error: null }
    }

    setIsLoading(true)
    try {
      const result = await signUp(email, password, {
        data: {
          full_name: data?.fullName,
          clinic_name: data?.clinicName,
        },
      })
      if (result.error) {
        toast.error(result.error.message || 'Registration failed')
        return { error: result.error }
      }
      toast.success(`Account created. Please check your email for verification.`)
      return { error: null }
    } finally {
      setIsLoading(false)
    }
  }, [hasClerk, hasSupabase])

  const logout = useCallback(async () => {
    queryClient.clear()
    auth.reset()

    if (hasClerk) {
      navigate({ to: '/clerk/sign-in', replace: true })
      return
    }

    if (hasSupabase) {
      await signOut()
    }

    setSession(null)
    setUser(null)

    toast.success('Signed out successfully')
    navigate({ to: '/sign-in', replace: true })
  }, [queryClient, auth, hasClerk, hasSupabase, navigate])

  const forgotPassword = useCallback(async (email: string) => {
    if (hasClerk) {
      return { error: new Error('Clerk is enabled - use Clerk auth') }
    }

    if (!hasSupabase) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success(`Password reset email sent to ${email}`)
      return { error: null }
    }

    try {
      const result = await sendPasswordResetEmail(email)
      if (result.error) {
        toast.error(result.error.message || 'Failed to send reset email')
        return { error: result.error }
      }
      toast.success(`Password reset email sent to ${email}`)
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send reset email')
      toast.error(error.message)
      return { error }
    }
  }, [hasClerk, hasSupabase])

  const resetPassword = useCallback(async (password: string) => {
    if (hasClerk) {
      return { error: new Error('Clerk is enabled - use Clerk auth') }
    }

    if (!hasSupabase) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Password reset successfully. Please sign in.')
      return { error: null }
    }

    try {
      const result = await updatePassword(password)
      if (result.error) {
        toast.error(result.error.message || 'Failed to reset password')
        return { error: result.error }
      }
      toast.success('Password reset successfully')
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reset password')
      toast.error(error.message)
      return { error }
    }
  }, [hasClerk, hasSupabase])

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const authLogic = useAuthLogic()
  return <AuthContext.Provider value={authLogic}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
