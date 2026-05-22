import { ClipboardList } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { type Visit } from '../data/schema'

type PatientVisitHistoryProps = {
  visits: Visit[]
}

const visitStatusColors: Record<string, string> = {
  completed:
    'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/10',
  no_show: 'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200',
}

export function PatientVisitHistory({ visits }: PatientVisitHistoryProps) {
  if (visits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <ClipboardList size={18} />
            Visit History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground py-4 text-center'>
            No visit history recorded yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <ClipboardList size={18} />
          Visit History ({visits.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='max-h-96'>
          <div className='space-y-1'>
            {visits.map((visit, index) => (
              <div key={visit.id}>
                <div className='flex items-start gap-4 py-3'>
                  <div className='flex min-w-0 flex-1 flex-col gap-1'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <span className='text-sm font-medium'>
                        {visit.reason}
                      </span>
                      <Badge
                        variant='outline'
                        className={`capitalize text-xs ${
                          visitStatusColors[visit.status]
                        }`}
                      >
                        {visit.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className='flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground'>
                      <span>{visit.date}</span>
                      <span>{visit.doctor}</span>
                      <span>{visit.department}</span>
                      <span className='capitalize'>{visit.type}</span>
                    </div>
                    {visit.diagnosis && (
                      <span className='text-xs text-muted-foreground'>
                        Diagnosis: {visit.diagnosis}
                      </span>
                    )}
                    {visit.notes && (
                      <span className='text-xs text-muted-foreground italic'>
                        {visit.notes}
                      </span>
                    )}
                  </div>
                </div>
                {index < visits.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
