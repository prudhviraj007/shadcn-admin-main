import { useEffect, useState, type ReactNode } from 'react'
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type OnChangeFn,
  type PaginationState,
  type Table as TableInstance,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { EmptyState } from '@/components/empty-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import type { DataTableToolbarProps } from '@/components/data-table/toolbar'

type FilterConfig = {
  columnId: string
  searchKey: string
  type?: 'string' | 'array'
}

type GlobalFilterFn<TData> = (row: { original: TData }, columnId: string, filterValue: string) => boolean

type DataTableProps<TData> = {
  data: TData[]
  columns: ColumnDef<TData>[]
  search?: Record<string, unknown>
  navigate?: NavigateFn
  toolbarProps: DataTableToolbarProps<TData>
  renderBulkActions?: (table: TableInstance<TData>) => ReactNode
  filterConfigs?: FilterConfig[]
  globalFilterFn?: GlobalFilterFn<TData>
  globalFilterKey?: string
}

export function DataTable<TData>({
  data,
  columns,
  search,
  navigate,
  toolbarProps,
  renderBulkActions,
  filterConfigs,
  globalFilterFn,
  globalFilterKey,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const hasUrlSync = !!search && !!navigate

  const urlState = hasUrlSync
    ? useTableUrlState({
        search,
        navigate: navigate!,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
        globalFilter: { enabled: !!globalFilterKey, key: globalFilterKey ?? 'filter' },
        columnFilters: (filterConfigs ?? (toolbarProps.filters ?? []).map((f: { columnId: string }) => ({
          columnId: f.columnId,
          searchKey: f.columnId,
          type: 'array' as const,
        }))),
      })
    : null

  const pagination: PaginationState = urlState?.pagination ?? { pageIndex: 0, pageSize: 10 }
  const onPaginationChange: OnChangeFn<PaginationState> =
    urlState?.onPaginationChange ?? (() => {})
  const columnFilters: ColumnFiltersState = urlState?.columnFilters ?? []
  const onColumnFiltersChange = urlState?.onColumnFiltersChange ?? (() => {})

  const globalFilter = urlState?.globalFilter
  const onGlobalFilterChange = urlState?.onGlobalFilterChange

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination, rowSelection, columnFilters, columnVisibility, globalFilter },
    enableRowSelection: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    ...(globalFilterFn ? { globalFilterFn } : {}),
    ...(onGlobalFilterChange ? { onGlobalFilterChange } : {}),
  })

  useEffect(() => {
    urlState?.ensurePageInRange(table.getPageCount())
  }, [table, urlState])

  return (
    <div className={cn('max-sm:has-[div[role="toolbar"]]:mb-16', 'flex flex-1 flex-col gap-4')}>
      <DataTableToolbar table={table} {...toolbarProps} />
      <div className='overflow-x-auto rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-48 p-0'>
                  <EmptyState
                    title='No results found'
                    description='Try adjusting your search or filters.'
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
      {renderBulkActions?.(table)}
    </div>
  )
}
