import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getAppointments, type AppointmentStatus } from '@/features/appointments'

const appointmentStatusColors: Record<AppointmentStatus, string> = {
  scheduled: 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300',
  'checked-in': 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  'in-progress': 'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200',
  completed: 'bg-neutral-300/40 border-neutral-300',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/10',
}

type DoctorAppointmentsOverviewProps = {
  doctorName: string
}

export function DoctorAppointmentsOverview({
  doctorName,
}: DoctorAppointmentsOverviewProps) {
  const { data: allAppointments = [] } = useQuery({
    queryKey: ['appointments', 'list'],
    queryFn: () => getAppointments(),
  })
  const appointments = useMemo(
    () => allAppointments.filter((a) => a.doctor === doctorName),
    [allAppointments, doctorName]
  )

  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='py-4 text-center text-sm text-muted-foreground'>
            No appointments found.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>
          Appointments ({appointments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='max-h-80'>
          <div className='space-y-1'>
            {appointments.map((apt, index) => (
              <div key={apt.id}>
                <div className='flex items-start gap-4 py-3'>
                  <div className='flex min-w-0 flex-1 flex-col gap-1'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <span className='text-sm font-medium'>
                        {apt.patient.name}
                      </span>
                      <Badge
                        variant='outline'
                        className={`capitalize text-xs ${
                          appointmentStatusColors[apt.status]
                        }`}
                      >
                        {apt.status}
                      </Badge>
                    </div>
                    <div className='flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground'>
                      <span>{apt.date}</span>
                      <span>{apt.time}</span>
                      <span>{apt.type}</span>
                    </div>
                  </div>
                </div>
                {index < appointments.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
