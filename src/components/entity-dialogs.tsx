import { type ReactNode } from 'react'

type EntityDialogConfig = {
  key: string
  open: boolean
  onOpenChange: (open: boolean) => void
  component: ReactNode
}

type EntityDialogsProps = {
  dialogs: EntityDialogConfig[]
}

export function EntityDialogs({ dialogs }: EntityDialogsProps) {
  return (
    <>
      {dialogs.map((dialog) => (
        <div key={dialog.key}>{dialog.component}</div>
      ))}
    </>
  )
}

export function useDialogHandlers<T>(
  setOpen: (str: T | null) => void,
  setCurrentRow: (row: T | null) => void,
  dialogType: T
) {
  const handleOpenChange = () => {
    setOpen(dialogType)
  }

  const handleEditOpenChange = (_currentRow: T) => {
    return () => {
      setOpen(dialogType)
      setTimeout(() => setCurrentRow(null), 500)
    }
  }

  return { handleOpenChange, handleEditOpenChange }
}
