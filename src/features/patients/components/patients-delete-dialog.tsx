import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Patient } from '../data/schema'
import { usePatientMutations } from '../hooks/use-patients-queries'

type PatientsDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Patient
}

export function PatientsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: PatientsDeleteDialogProps) {
  const [value, setValue] = useState('')
  const patientName = `${currentRow.firstName} ${currentRow.lastName}`
  const { deleteEntity } = usePatientMutations()

  const handleDelete = () => {
    if (value.trim() !== patientName) return
    deleteEntity.mutateAsync(currentRow.id)
    onOpenChange(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form='patients-delete-form'
      disabled={value.trim() !== patientName}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete Patient Record
        </span>
      }
      desc={
        <form
          id='patients-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{patientName}</span>?
            <br />
            This action will permanently remove the patient record including all
            medical notes, visit history, and associated data. This cannot be
            undone.
          </p>

          <Label className='my-2'>
            Patient Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter full patient name to confirm deletion.'
              autoFocus
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              This operation permanently deletes all patient data and cannot be
              reversed.
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText='Delete'
      destructive
    />
  )
}
