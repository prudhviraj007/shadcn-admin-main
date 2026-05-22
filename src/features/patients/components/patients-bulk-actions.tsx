import { type Table } from '@tanstack/react-table'
import { Trash2, Tags } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type Patient } from '../data/schema'
import { usePatients } from './patients-provider'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const { setOpen, setCurrentRow } = usePatients()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkTag = () => {
    const firstPatient = selectedRows[0]?.original as Patient | undefined
    if (firstPatient) {
      setCurrentRow(firstPatient)
      setOpen('tags')
    }
  }

  const handleBulkDelete = () => {
    const selectedPatients = selectedRows.map((row) => row.original as Patient)
    toast.promise(sleep(2000), {
      loading: 'Deleting patient records...',
      success: () => {
        table.resetRowSelection()
        return `Deleted ${selectedPatients.length} patient record${selectedPatients.length > 1 ? 's' : ''}`
      },
      error: 'Error deleting patient records',
    })
    table.resetRowSelection()
  }

  return (
    <BulkActionsToolbar table={table} entityName='patient'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            onClick={handleBulkTag}
            className='size-8'
            aria-label='Manage tags for selected patients'
            title='Manage tags for selected patients'
          >
            <Tags />
            <span className='sr-only'>Manage tags for selected patients</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Manage tags for selected patients</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='destructive'
            size='icon'
            onClick={handleBulkDelete}
            className='size-8'
            aria-label='Delete selected patients'
            title='Delete selected patients'
          >
            <Trash2 />
            <span className='sr-only'>Delete selected patients</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete selected patients</p>
        </TooltipContent>
      </Tooltip>
    </BulkActionsToolbar>
  )
}
