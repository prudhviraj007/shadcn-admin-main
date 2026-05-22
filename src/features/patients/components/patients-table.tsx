import { DataTable } from '@/components/data-table'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { patientStatuses, genders } from '../data/data'
import { type Patient } from '../data/schema'
import { DataTableBulkActions } from './patients-bulk-actions'
import { patientsColumns as columns } from './patients-columns'

type PatientsTableProps = {
  data: Patient[]
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function PatientsTable({ data, search, navigate }: PatientsTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      search={search}
      navigate={navigate}
      toolbarProps={{
        searchPlaceholder: 'Filter patients...',
        searchKey: 'name',
        filters: [
          {
            columnId: 'status',
            title: 'Status',
            options: patientStatuses.map(({ label, value }) => ({ label, value })),
          },
          {
            columnId: 'gender',
            title: 'Gender',
            options: genders.map(({ label, value }) => ({ label, value })),
          },
        ],
      }}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
    />
  )
}
