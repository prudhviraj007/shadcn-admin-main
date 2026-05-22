import {
  CalendarCheck2,
  CheckCircle2,
  CircleDashed,
  Clock3,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { type AppointmentStatus } from '../types'

const statusConfig: Record<
  AppointmentStatus,
  {
    label: string
    className: string
    icon: React.ComponentType<{ className?: string }>
  }
> = {
  scheduled: {
    label: 'Scheduled',
    icon: CalendarCheck2,
    className:
      'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300',
  },
  'checked-in': {
    label: 'Checked in',
    icon: CheckCircle2,
    className:
      'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300',
  },
  'in-progress': {
    label: 'In progress',
    icon: Clock3,
    className:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
  },
  completed: {
    label: 'Completed',
    icon: CircleDashed,
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    className:
      'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300',
  },
}

type AppointmentStatusBadgeProps = {
  status: AppointmentStatus
  className?: string
}

export function AppointmentStatusBadge({
  status,
  className,
}: AppointmentStatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge
      variant='outline'
      className={cn('gap-1.5 whitespace-nowrap', config.className, className)}
    >
      <Icon className='size-3.5' />
      {config.label}
    </Badge>
  )
}

export { statusConfig as appointmentStatusConfig }
