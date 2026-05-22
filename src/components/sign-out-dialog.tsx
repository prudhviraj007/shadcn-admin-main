import { useNavigate } from '@tanstack/react-router'
import { useClerk } from '@clerk/react'
import { useAuthStore } from '@/stores/auth-store'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  if (PUBLISHABLE_KEY) return <ClerkSignOutDialog open={open} onOpenChange={onOpenChange} />

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

function MockSignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Sign out'
      desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
      confirmText='Sign out'
      destructive
      handleConfirm={() => {
        auth.reset()
        navigate({ to: '/sign-in', replace: true })
      }}
      className='sm:max-w-sm'
    />
  )
}
