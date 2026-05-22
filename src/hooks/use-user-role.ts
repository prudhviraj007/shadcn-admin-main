import { useUser } from '@clerk/react'

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'user'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export function useUserRole(): {
  roles: UserRole[]
  isAdmin: boolean
  role: UserRole | null
} {
  if (!PUBLISHABLE_KEY) {
    return { roles: ['user'], isAdmin: false, role: 'user' }
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = useUser()
  const raw = user?.publicMetadata?.roles ?? user?.publicMetadata?.role
  const roles: UserRole[] = Array.isArray(raw)
    ? raw
    : typeof raw === 'string'
      ? [raw as UserRole]
      : ['user']
  const role = roles[0] ?? null

  return {
    roles,
    isAdmin: roles.includes('admin'),
    role,
  }
}
