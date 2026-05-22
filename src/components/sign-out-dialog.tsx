import { useClerk } from '@clerk/react'
import { useAuthStore } from '@/stores/auth-store'
import { useAuth } from '@/hooks/use-auth'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { hasClerk, hasSupabase } from '@/lib/env'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  if (hasClerk) return <ClerkSignOutDialog open={open} onOpenChange={onOpenChange} />
  if (hasSupabase) return <SupabaseSignOutDialog open={open} onOpenChange={onOpenChange} />

  return <MockSignOutDialog open={open} onOpenChange={onOpenChange} />
}

function ClerkSignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const { signOut } = useClerk()

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Sign out'
      desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
      confirmText='Sign out'
      destructive
      handleConfirm={() => signOut()}
      className='sm:max-w-sm'
    />
  )
}

function SupabaseSignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const { logout } = useAuth()

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Sign out'
      desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
      confirmText='Sign out'
      destructive
      handleConfirm={() => logout()}
      className='sm:max-w-sm'
    />
  )
}

function MockSignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const { auth } = useAuthStore()
  const { logout } = useAuth()

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Sign out'
      desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
      confirmText='Sign out'
      destructive
      handleConfirm={() => logout()}
      className='sm:max-w-sm'
    />
  )
}
