import { getRouteApi } from '@tanstack/react-router'
import { DataTable } from '@/components/data-table'
import { priorities, statuses } from '../data/data'
import { type Task } from '../data/schema'
import { DataTableBulkActions } from './tasks-bulk-actions'
import { tasksColumns as columns } from './tasks-columns'

const route = getRouteApi('/_authenticated/tasks/')

type TasksTableProps = {
  data: Task[]
}

export function TasksTable({ data }: TasksTableProps) {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <DataTable
      data={data}
      columns={columns}
      search={search}
      navigate={navigate}
      globalFilterKey='filter'
      globalFilterFn={(row, _columnId, filterValue) => {
        const r = row as { original: Task }
        const id = String(r.original.id).toLowerCase()
        const title = String(r.original.title).toLowerCase()
        const searchValue = String(filterValue).toLowerCase()
        return id.includes(searchValue) || title.includes(searchValue)
      }}
      toolbarProps={{
        searchPlaceholder: 'Filter care tasks...',
        filters: [
          {
            columnId: 'status',
            title: 'Status',
            options: statuses,
          },
          {
            columnId: 'priority',
            title: 'Priority',
            options: priorities,
          },
        ],
      }}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
    />
  )
}
