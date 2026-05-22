import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { weekDays } from '../data/data'
import { type Doctor } from '../data/schema'

type DoctorScheduleProps = {
  doctor: Doctor
}

export function DoctorSchedule({ doctor }: DoctorScheduleProps) {
  const scheduleMap = new Map(
    doctor.weeklySchedule.map((s) => [s.day, s])
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          {weekDays.map((day) => {
            const slot = scheduleMap.get(day)
            if (!slot) return null
            return (
              <div
                key={day}
                className={cn(
                  'flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm',
                  slot.isAvailable
                    ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20'
                    : 'border-muted bg-muted/30 text-muted-foreground'
                )}
              >
                <span className='font-medium'>{day}</span>
                <div className='flex items-center gap-2'>
                  {slot.isAvailable ? (
                    <span>
                      {slot.startTime} - {slot.endTime}
                    </span>
                  ) : (
                    <Badge variant='outline' className='text-xs'>
                      Unavailable
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
