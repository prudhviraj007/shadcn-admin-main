import { CalendarDays } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { type Appointment, type AppointmentStatus } from '@/features/appointments'

const appointmentStatusColors: Record<AppointmentStatus, string> = {
  scheduled: 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300',
  'checked-in': 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  'in-progress': 'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200',
  completed: 'bg-neutral-300/40 border-neutral-300',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/10',
}

type PatientAppointmentHistoryProps = {
  appointments: Appointment[]
}

export function PatientAppointmentHistory({
  appointments,
}: PatientAppointmentHistoryProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <CalendarDays size={18} />
            Appointment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground py-4 text-center'>
            No appointments found.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <CalendarDays size={18} />
          Appointment History ({appointments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='max-h-96'>
          <div className='space-y-1'>
            {appointments.map((apt, index) => (
              <div key={apt.id}>
                <div className='flex items-start gap-4 py-3'>
                  <div className='flex min-w-0 flex-1 flex-col gap-1'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <span className='text-sm font-medium'>
                        {apt.type} — {apt.specialty}
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
                      <span>{apt.doctor}</span>
                    </div>
                    {apt.notes && (
                      <span className='text-xs text-muted-foreground italic'>
                        {apt.notes}
                      </span>
                    )}
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
