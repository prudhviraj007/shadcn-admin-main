import { PatientsActionDialog } from './patients-action-dialog'
import { PatientsDeleteDialog } from './patients-delete-dialog'
import { PatientsTagsDialog } from './patients-tags-dialog'
import { usePatients } from './patients-provider'

export function PatientsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePatients()
  return (
    <>
      <PatientsActionDialog
        key='patient-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <PatientsActionDialog
            key={`patient-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <PatientsDeleteDialog
            key={`patient-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <PatientsTagsDialog
            key={`patient-tags-${currentRow.id}`}
            open={open === 'tags'}
            onOpenChange={() => {
              setOpen('tags')
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
