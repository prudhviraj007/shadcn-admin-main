import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  Stethoscope,
  UserRound,
  Video,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { type Appointment } from '../types'
import { AppointmentStatusBadge } from './appointment-status-badge'

type AppointmentDetailsDrawerProps = {
  appointment: Appointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (appointment: Appointment) => void
  onDelete: (appointment: Appointment) => void
}

export function AppointmentDetailsDrawer({
  appointment,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: AppointmentDetailsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full p-0 sm:max-w-xl'>
        {appointment ? (
          <>
            <SheetHeader className='border-b p-5 text-start'>
              <div className='flex items-start gap-3 pe-8'>
                <Avatar className='size-12'>
                  <AvatarImage
                    src={appointment.patient.avatar}
                    alt={appointment.patient.name}
                  />
                  <AvatarFallback>
                    {getInitials(appointment.patient.name)}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0 flex-1'>
                  <SheetTitle className='truncate text-xl'>
                    {appointment.patient.name}
                  </SheetTitle>
                  <SheetDescription>
                    {appointment.id} • {formatDate(appointment.date)} at{' '}
                    {appointment.time}
                  </SheetDescription>
                  <div className='mt-3'>
                    <AppointmentStatusBadge status={appointment.status} />
                  </div>
                </div>
              </div>
            </SheetHeader>

            <ScrollArea className='min-h-0 flex-1'>
              <div className='space-y-5 p-5'>
                <section className='grid gap-3 rounded-lg border bg-card p-4'>
                  <SectionTitle icon={UserRound} title='Patient info' />
                  <InfoRow label='Name' value={appointment.patient.name} />
                  <InfoRow
                    label='Email'
                    value={appointment.patient.email}
                    icon={Mail}
                  />
                  <InfoRow
                    label='Phone'
                    value='+1 (555) 014-2098'
                    icon={Phone}
                  />
                </section>

                <section className='grid gap-3 rounded-lg border bg-card p-4'>
                  <SectionTitle icon={Stethoscope} title='Doctor info' />
                  <InfoRow label='Doctor' value={appointment.doctor} />
                  <InfoRow label='Specialty' value={appointment.specialty} />
                  <InfoRow label='Visit type' value={appointment.type} />
                </section>

                <section className='grid gap-3 rounded-lg border bg-card p-4'>
                  <SectionTitle
                    icon={CalendarClock}
                    title='Appointment history'
                  />
                  <HistoryItem
                    title='Appointment created'
                    description='Clinic team added this visit to the schedule.'
                  />
                  <HistoryItem
                    title='AI reminder sent'
                    description='Patient received an automated reminder message.'
                  />
                  <HistoryItem
                    title='Status updated'
                    description={`Current state is ${appointment.status.replace('-', ' ')}.`}
                  />
                </section>

                <section className='grid gap-3 rounded-lg border bg-card p-4'>
                  <SectionTitle icon={MessageCircle} title='Notes' />
                  <p className='text-sm leading-6 text-muted-foreground'>
                    {appointment.notes ||
                      'No clinical notes have been added for this appointment yet.'}
                  </p>
                </section>

                <section className='grid gap-4 rounded-lg border bg-card p-4'>
                  <SectionTitle icon={Clock} title='Timeline activity' />
                  <TimelineItem
                    title='Patient profile reviewed'
                    description='Care coordinator checked demographic and contact details.'
                    time='08:35 AM'
                  />
                  <TimelineItem
                    title='Appointment reminder queued'
                    description='Clinic AI Assistant prepared the reminder workflow.'
                    time='08:40 AM'
                  />
                  <TimelineItem
                    title='Visit ready for intake'
                    description='Front desk can check in the patient when they arrive.'
                    time='Now'
                  />
                </section>
              </div>
            </ScrollArea>

            <SheetFooter className='border-t p-4'>
              <div className='grid w-full gap-2 sm:grid-cols-3'>
                <Button variant='outline' className='gap-2'>
                  <MessageCircle className='size-4' />
                  Message
                </Button>
                <Button
                  variant='outline'
                  className='gap-2'
                  onClick={() => onEdit(appointment)}
                >
                  <CalendarClock className='size-4' />
                  Edit
                </Button>
                <Button className='gap-2'>
                  {appointment.type === 'Telehealth' ? (
                    <Video className='size-4' />
                  ) : (
                    <CheckCircle2 className='size-4' />
                  )}
                  Start
                </Button>
              </div>
              <Button
                variant='destructive'
                className='w-full'
                onClick={() => onDelete(appointment)}
              >
                Delete appointment
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
}) {
  return (
    <div className='flex items-center gap-2 font-medium'>
      <Icon className='size-4 text-primary' />
      <span>{title}</span>
    </div>
  )
}

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className='flex items-start justify-between gap-3 text-sm'>
      <div className='flex items-center gap-2 text-muted-foreground'>
        {Icon ? <Icon className='size-3.5' /> : null}
        <span>{label}</span>
      </div>
      <span className='max-w-60 text-end font-medium'>{value}</span>
    </div>
  )
}

function HistoryItem({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className='rounded-md bg-muted/50 p-3'>
      <p className='text-sm font-medium'>{title}</p>
      <p className='text-sm text-muted-foreground'>{description}</p>
    </div>
  )
}

function TimelineItem({
  title,
  description,
  time,
}: {
  title: string
  description: string
  time: string
}) {
  return (
    <div className='grid grid-cols-[auto_1fr] gap-3'>
      <div className='flex flex-col items-center'>
        <span className='mt-1 size-2.5 rounded-full bg-primary' />
        <Separator orientation='vertical' className='mt-2 min-h-10' />
      </div>
      <div className='pb-2'>
        <div className='flex items-start justify-between gap-3'>
          <p className='text-sm font-medium'>{title}</p>
          <span className='text-xs text-muted-foreground'>{time}</span>
        </div>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>
    </div>
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
