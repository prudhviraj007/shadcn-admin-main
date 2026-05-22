import { useMemo, useCallback } from 'react'
import { useLocation } from '@tanstack/react-router'
import {
  BotMessageSquare,
  CalendarCheck,
  Clock3,
  FileDown,
  Inbox,
  MessageSquareText,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { NotificationBell } from '@/components/notification-bell'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAppointmentsList } from '@/features/appointments'
import { usePatientsList } from '@/features/patients'
import { useDoctorsList } from '@/features/doctors'

export function Dashboard() {
  const location = useLocation()
  const { data: appointments = [] } = useAppointmentsList()
  const { data: patients = [] } = usePatientsList()
  const { data: doctors = [] } = useDoctorsList()

  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = useMemo(
    () => appointments.filter((a) => a.date === today),
    [appointments, today]
  )
  const checkedIn = useMemo(
    () => todayAppointments.filter((a) => a.status === 'checked-in' || a.status === 'in-progress').length,
    [todayAppointments]
  )

  const topNavLinks = useMemo(
    () => [
      { title: 'Overview', href: '/', isActive: location.pathname === '/', disabled: false },
      { title: 'Appointments', href: '/tasks', isActive: false, disabled: false },
      { title: 'Patients', href: '/patients', isActive: false, disabled: false },
      { title: 'AI Assistant', href: '/ai-assistant', isActive: false, disabled: false },
    ],
    [location.pathname]
  )

  const recentPatients = useMemo(
    () =>
      patients
        .filter((p) => p.lastVisit)
        .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
        .slice(0, 4)
        .map((p) => ({
          name: `${p.firstName} ${p.lastName}`,
          detail: `${p.status === 'active' ? 'Active' : p.status === 'inactive' ? 'Inactive' : 'Archived'} patient`,
          meta: p.lastVisit ? timeAgo(new Date(p.lastVisit)) : '',
        })),
    [patients]
  )

  const handleExport = useCallback(() => {
    const departmentData = doctors.reduce<Record<string, number>>((acc, d) => {
      acc[d.department] = (acc[d.department] || 0) + 1
      return acc
    }, {})

    const sections: { label: string; rows: string[][] }[] = [
      {
        label: 'Summary',
        rows: [
          ['Metric', 'Value'],
          ['Appointments Today', String(todayAppointments.length)],
          ['Checked In', String(checkedIn)],
          ['Total Doctors', String(doctors.length)],
          ['Available Now', String(doctors.filter((d) => d.availability === 'available').length)],
          ['Total Patients', String(patients.length)],
          ['Active Patients', String(patients.filter((p) => p.status === 'active').length)],
          ['Upcoming Appointments', String(appointments.filter((a) => a.date >= today && a.status !== 'cancelled').length)],
        ],
      },
      {
        label: "Today's Appointments",
        rows: [
          ['Time', 'Patient', 'Doctor', 'Type', 'Status'],
          ...todayAppointments.map((a) => [a.time, a.patient.name, a.doctor, a.type, a.status]),
        ],
      },
      {
        label: 'Recent Patients',
        rows: [
          ['Name', 'Status', 'Last Visit'],
          ...recentPatients.map((p) => [p.name, p.detail, p.meta]),
        ],
      },
      {
        label: 'Department Overview',
        rows: [
          ['Department', 'Doctors'],
          ...Object.entries(departmentData).map(([dept, count]) => [dept, String(count)]),
        ],
      },
    ]

    const csv = sections
      .map((s) => `=== ${s.label} ===\n${s.rows.map((r) => r.map(csvEscape).join(',')).join('\n')}`)
      .join('\n\n')

    downloadCsv(csv, `dashboard-export-${today}.csv`)
  }, [todayAppointments, checkedIn, doctors, patients, appointments, today, recentPatients])

  return (
    <>
      <Header>
        <TopNav links={topNavLinks} className='me-auto' />
        <Search />
        <NotificationBell />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='space-y-5'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
            <p className='text-sm text-muted-foreground'>
              Clinic operations, patient communication, and AI assistant
              workload.
            </p>
          </div>
          <Button className='gap-2' onClick={handleExport}>
            <FileDown className='size-4' />
            Export Data
          </Button>
        </div>

        <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          <MetricCard
            title='Appointments Today'
            value={String(todayAppointments.length)}
            detail={`${checkedIn} currently checked in`}
            icon={CalendarCheck}
          />
          <MetricCard
            title='Total Doctors'
            value={String(doctors.length)}
            detail={`${doctors.filter((d) => d.availability === 'available').length} available now`}
            icon={Inbox}
          />
          <MetricCard
            title='Total Patients'
            value={String(patients.length)}
            detail={`${patients.filter((p) => p.status === 'active').length} active records`}
            icon={UsersRound}
          />
          <MetricCard
            title='Upcoming Appointments'
            value={String(appointments.filter((a) => a.date >= today && a.status !== 'cancelled').length)}
            detail='Across all providers'
            icon={BotMessageSquare}
          />
        </section>

        <section className='grid gap-4 xl:grid-cols-7'>
          <Card className='xl:col-span-4'>
            <CardHeader>
              <div className='flex flex-wrap items-start justify-between gap-2'>
                <div>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>
                    Live schedule for front desk and clinical staff.
                  </CardDescription>
                </div>
                <Badge variant='outline'>{todayAppointments.length} visits</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <p className='py-8 text-center text-sm text-muted-foreground'>
                  No appointments scheduled for today.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayAppointments.slice(0, 8).map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell className='font-medium'>{apt.time}</TableCell>
                        <TableCell>{apt.patient.name}</TableCell>
                        <TableCell>{apt.doctor}</TableCell>
                        <TableCell>{apt.type}</TableCell>
                        <TableCell>
                          <Badge variant='secondary' className='capitalize'>{apt.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className='xl:col-span-3'>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                All appointments today by time.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {todayAppointments.length === 0 ? (
                <p className='py-8 text-center text-sm text-muted-foreground'>
                  No appointments today.
                </p>
              ) : (
                todayAppointments.slice(0, 5).map((apt) => (
                  <div
                    key={apt.id}
                    className='flex items-start gap-3 rounded-lg p-2 -mx-2 transition-colors duration-150 hover:bg-accent/50'
                  >
                    <div className='mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-muted'>
                      <MessageSquareText className='size-4 text-muted-foreground' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center justify-between gap-2'>
                        <p className='truncate text-sm font-medium'>
                          {apt.patient.name}
                        </p>
                        <Badge variant='outline' className='capitalize text-xs'>{apt.status}</Badge>
                      </div>
                      <p className='line-clamp-1 text-sm text-muted-foreground'>
                        {apt.doctor} &middot; {apt.type}
                      </p>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        {apt.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <section className='grid gap-4 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>
                New and recently updated patient records.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {recentPatients.length === 0 ? (
                <p className='py-8 text-center text-sm text-muted-foreground'>
                  No patient records yet.
                </p>
              ) : (
                recentPatients.map((patient) => (
                  <div
                    key={patient.name}
                    className='flex items-center justify-between gap-4 rounded-lg p-2 -mx-2 transition-colors duration-150 hover:bg-accent/50'
                  >
                    <div className='flex min-w-0 items-center gap-3'>
                      <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <UserRound className='size-5' />
                      </div>
                      <div className='min-w-0'>
                        <p className='truncate text-sm font-medium'>{patient.name}</p>
                        <p className='truncate text-sm text-muted-foreground'>{patient.detail}</p>
                      </div>
                    </div>
                    <span className='shrink-0 text-xs text-muted-foreground'>{patient.meta}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
              <CardDescription>
                Doctors by department.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {doctors.length === 0 ? (
                <p className='py-8 text-center text-sm text-muted-foreground'>
                  No doctors registered yet.
                </p>
              ) : (
                Object.entries(
                  doctors.reduce<Record<string, number>>((acc, d) => {
                    acc[d.department] = (acc[d.department] || 0) + 1
                    return acc
                  }, {})
                )
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 6)
                  .map(([dept, count]) => (
                    <div key={dept} className='flex gap-3 rounded-lg p-2 -mx-2 transition-colors duration-150 hover:bg-accent/50'>
                      <div className='flex size-9 shrink-0 items-center justify-center rounded-md bg-muted'>
                        <Clock3 className='size-4 text-muted-foreground' />
                      </div>
                      <div className='flex flex-1 items-center justify-between'>
                        <p className='text-sm font-medium'>{dept}</p>
                        <p className='text-sm text-muted-foreground'>{count} doctor{count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </section>
      </Main>
    </>
  )
}

type MetricCardProps = {
  title: string
  value: string
  detail: string
  icon: React.ElementType
}

function MetricCard({ title, value, detail, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='size-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>{detail}</p>
      </CardContent>
    </Card>
  )
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function timeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
