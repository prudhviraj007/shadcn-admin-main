import { DoctorsActionDialog } from './doctors-action-dialog'
import { DoctorsDeleteDialog } from './doctors-delete-dialog'
import { useDoctors } from './doctors-provider'

export function DoctorsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDoctors()
  return (
    <>
      <DoctorsActionDialog
        key='doctor-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <DoctorsActionDialog
            key={`doctor-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <DoctorsDeleteDialog
            key={`doctor-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
