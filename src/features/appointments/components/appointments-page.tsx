import { useMemo, useState } from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  CalendarPlus,
  Clock,
  Search as SearchIcon,
  Stethoscope,
  Video,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/empty-state'
import { SkeletonTable } from '@/components/skeleton-table'
import { ConfigDrawer } from '@/components/config-drawer'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTablePagination } from '@/components/data-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationBell } from '@/components/notification-bell'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  useAppointmentsList,
  useAppointmentMutations,
} from '../hooks/use-appointment-queries'
import { type Appointment, type AppointmentStatus } from '../types'
import { AppointmentActionsDropdown } from './appointment-actions-dropdown'
import { AppointmentDetailsDrawer } from './appointment-details-drawer'
import { AppointmentStatusBadge } from './appointment-status-badge'
import { AppointmentAiSuggestions } from './appointment-ai-suggestions'
import { CreateAppointmentDialog } from './create-appointment-dialog'
import { EditAppointmentDialog } from './edit-appointment-dialog'

const statusOptions = [
  'all',
  'scheduled',
  'checked-in',
  'in-progress',
  'completed',
  'cancelled',
] as const

const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: 'Scheduled',
  'checked-in': 'Checked in',
  'in-progress': 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export function AppointmentsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null)
  const [deletingAppointment, setDeletingAppointment] =
    useState<Appointment | null>(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusOptions)[number]>('all')
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: false },
  ])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const appointmentsQuery = useAppointmentsList()
  const { createEntity, updateEntity, deleteEntity } = useAppointmentMutations()

  const columns = useMemo<ColumnDef<Appointment>[]>(
    () => [
      {
        accessorKey: 'patient.name',
        id: 'patient',
        header: 'Patient',
        cell: ({ row }) => {
          const appointment = row.original
          return (
            <div className='flex items-center gap-3'>
              <Avatar className='size-10'>
                <AvatarImage
                  src={appointment.patient.avatar}
                  alt={appointment.patient.name}
                />
                <AvatarFallback>
                  {getInitials(appointment.patient.name)}
                </AvatarFallback>
              </Avatar>
              <div className='min-w-0'>
                <div className='truncate font-medium'>
                  {appointment.patient.name}
                </div>
                <div className='truncate text-sm text-muted-foreground'>
                  {appointment.patient.email}
                </div>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'doctor',
        header: 'Doctor',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Stethoscope className='size-4 text-muted-foreground' />
            <div className='min-w-0'>
              <div className='truncate font-medium'>{row.original.doctor}</div>
              <div className='truncate text-sm text-muted-foreground'>
                {row.original.specialty}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Appointment type',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            {row.original.type === 'Telehealth' && (
              <Video className='size-4 text-muted-foreground' />
            )}
            <span>{row.original.type}</span>
          </div>
        ),
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.date),
      },
      {
        accessorKey: 'time',
        header: 'Time',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Clock className='size-4 text-muted-foreground' />
            <span>{row.original.time}</span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <AppointmentStatusBadge status={row.original.status} />
        ),
        filterFn: (row, id, value) => value === row.getValue(id),
      },
      {
        id: 'actions',
        header: () => <span className='sr-only'>Actions</span>,
        cell: ({ row }) => (
          <AppointmentActionsDropdown
            appointment={row.original}
            onView={setSelectedAppointment}
            onEdit={setEditingAppointment}
            onDelete={setDeletingAppointment}
          />
        ),
        enableSorting: false,
      },
    ],
    []
  )

  const table = useReactTable({
    data: appointmentsQuery.data ?? [],
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue).toLowerCase()
      const appointment = row.original

      return [
        appointment.patient.name,
        appointment.patient.email,
        appointment.doctor,
        appointment.specialty,
        appointment.type,
        appointment.id,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const handleStatusFilterChange = (value: (typeof statusOptions)[number]) => {
    setStatusFilter(value)
    table
      .getColumn('status')
      ?.setFilterValue(value === 'all' ? undefined : value)
    table.setPageIndex(0)
  }

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <NotificationBell />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-5'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Appointments</h2>
            <p className='text-muted-foreground'>
              Manage clinic visits, doctor schedules, and appointment status.
            </p>
          </div>
          <div className='flex gap-2'>
            <AppointmentAiSuggestions />
            <Button className='gap-2' onClick={() => setIsCreateOpen(true)}>
              <CalendarPlus className='size-4' />
              New Appointment
            </Button>
          </div>
        </div>

        <section className='flex flex-1 flex-col rounded-lg border bg-card'>
          <div className='flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between'>
            <label className='relative block lg:w-96'>
              <SearchIcon className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                value={globalFilter}
                onChange={(event) => {
                  setGlobalFilter(event.target.value)
                  table.setPageIndex(0)
                }}
                placeholder='Search patient, doctor, type, or ID...'
                className='ps-9'
              />
            </label>

            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className='w-full lg:w-48'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === 'all'
                      ? 'All statuses'
                      : statusLabels[status as AppointmentStatus]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {appointmentsQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='p-0'>
                      <SkeletonTable columns={columns.length} rows={6} />
                    </TableCell>
                  </TableRow>
                ) : appointmentsQuery.isError ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='h-32'>
                      <EmptyState
                        title='Unable to load appointments'
                        description='Please refresh the page or try again in a moment.'
                        icon={CalendarPlus}
                      />
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='h-48'>
                      <EmptyState
                        title='No appointments found'
                        description='Try changing your search or status filter.'
                        icon={CalendarPlus}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className='mt-auto border-t p-4'>
            <DataTablePagination table={table} />
          </div>
        </section>
      </Main>

      <CreateAppointmentDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={async (values) => {
          await createEntity.mutateAsync({
            patient: {
              name: values.patientName,
              email: values.patientName.toLowerCase().replace(/\s+/g, '.') + '@example.com',
              avatar: `/avatars/${Math.floor(Math.random() * 20 + 1).toString().padStart(2, '0')}.png`,
            },
            doctor: values.doctor,
            specialty: '',
            date: values.date,
            time: values.time,
            type: values.appointmentType,
            status: values.status,
            notes: values.notes,
          })
        }}
      />

      <AppointmentDetailsDrawer
        appointment={selectedAppointment}
        open={!!selectedAppointment}
        onOpenChange={(open) => {
          if (!open) setSelectedAppointment(null)
        }}
        onEdit={(appointment) => {
          setSelectedAppointment(null)
          setEditingAppointment(appointment)
        }}
        onDelete={(appointment) => {
          setSelectedAppointment(null)
          setDeletingAppointment(appointment)
        }}
      />

      <EditAppointmentDialog
        appointment={editingAppointment}
        open={!!editingAppointment}
        onOpenChange={(open) => {
          if (!open) setEditingAppointment(null)
        }}
        onSave={async (appointment) => {
          await updateEntity.mutateAsync(appointment)
        }}
      />

      <ConfirmDialog
        open={!!deletingAppointment}
        onOpenChange={(open) => {
          if (!open) setDeletingAppointment(null)
        }}
        title='Delete appointment?'
        desc={
          deletingAppointment
            ? `This will remove ${deletingAppointment.patient.name}'s appointment from the clinic schedule.`
            : 'This appointment will be removed from the clinic schedule.'
        }
        confirmText='Delete appointment'
        destructive
        isLoading={deleteEntity.isPending}
        handleConfirm={async () => {
          if (!deletingAppointment) return
          await deleteEntity.mutateAsync(deletingAppointment.id)
          setDeletingAppointment(null)
        }}
      />
    </>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
