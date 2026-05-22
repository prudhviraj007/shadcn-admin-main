import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Doctor } from '../data/schema'
import { useDoctorMutations } from '../hooks/use-doctors-queries'

type DoctorsDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Doctor
}

export function DoctorsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: DoctorsDeleteDialogProps) {
  const [value, setValue] = useState('')
  const { deleteEntity } = useDoctorMutations()

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return
    deleteEntity.mutateAsync(currentRow.id)
    onOpenChange(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form='doctors-delete-form'
      disabled={value.trim() !== currentRow.name}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Remove Doctor
        </span>
      }
      desc={
        <form
          id='doctors-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            Are you sure you want to remove{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            This action will remove the doctor from the system and cancel all
            upcoming appointments. This cannot be undone.
          </p>

          <Label className='my-2'>
            Doctor Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter doctor name to confirm removal.'
              autoFocus
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              This operation permanently removes the doctor and cannot be
              reversed.
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText='Remove'
      destructive
    />
  )
}
