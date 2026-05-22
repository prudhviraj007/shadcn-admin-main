import { ClipboardList, Calendar, User, Building2, Activity, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { type Visit } from '../data/schema'

type PatientVisitHistoryProps = {
  visits: Visit[]
}

const visitStatusConfig: Record<string, { dot: string; badge: string; line: string }> = {
  completed: {
    dot: 'bg-teal-500',
    badge: 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
    line: 'bg-teal-200 dark:bg-teal-800',
  },
  cancelled: {
    dot: 'bg-destructive',
    badge: 'bg-destructive/10 text-destructive border-destructive/10',
    line: 'bg-destructive/20',
  },
  no_show: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200',
    line: 'bg-amber-200 dark:bg-amber-800',
  },
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
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

  const sortedVisits = [...visits].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <ClipboardList size={18} />
          Visit History ({visits.length})
        </CardTitle>
      </CardHeader>
      <CardContent className='-mx-1'>
        <ScrollArea className='max-h-96 px-1'>
          <div className='relative'>
            <div className='absolute left-[11px] top-2 bottom-2 w-0.5 bg-muted' />

            <div className='space-y-1'>
              {sortedVisits.map((visit, index) => {
                const config = visitStatusConfig[visit.status] ?? visitStatusConfig.completed
                const isLast = index === sortedVisits.length - 1

                return (
                  <div key={visit.id} className='relative pl-8 pb-2'>
                    <div className={cn(
                      'absolute left-[5px] top-1.5 z-10 h-3.5 w-3.5 rounded-full border-2 border-background',
                      config.dot
                    )} />

                    {!isLast && (
                      <div className={cn(
                        'absolute left-[11px] top-5 bottom-0 w-0.5',
                        config.line
                      )} />
                    )}

                    <Card className='overflow-hidden border shadow-sm transition-shadow hover:shadow'>
                      <CardContent className='p-4'>
                        <div className='flex flex-col gap-3'>
                          <div className='flex flex-wrap items-center justify-between gap-2'>
                            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                              <Calendar className='size-4' />
                              <span className='font-medium text-foreground'>
                                {formatDate(visit.date)}
                              </span>
                            </div>
                            <Badge
                              variant='outline'
                              className={cn('capitalize text-xs', config.badge)}
                            >
                              {visit.status.replace('_', ' ')}
                            </Badge>
                          </div>

                          <div>
                            <h4 className='font-medium text-foreground mb-1 flex items-center gap-2'>
                              <Activity className='size-4 text-muted-foreground' />
                              {visit.reason}
                            </h4>
                            <Badge variant='secondary' className='text-xs'>
                              {visit.type}
                            </Badge>
                          </div>

                          <div className='grid grid-cols-2 gap-2 text-sm'>
                            <div className='flex items-center gap-2 text-muted-foreground'>
                              <User className='size-4' />
                              <span>{visit.doctor}</span>
                            </div>
                            <div className='flex items-center gap-2 text-muted-foreground'>
                              <Building2 className='size-4' />
                              <span>{visit.department}</span>
                            </div>
                          </div>

                          {visit.diagnosis && (
                            <div className='rounded-lg bg-muted/50 p-3'>
                              <div className='flex items-start gap-2'>
                                <FileText className='size-4 text-muted-foreground mt-0.5 shrink-0' />
                                <div>
                                  <p className='text-xs font-medium text-muted-foreground mb-1'>
                                    Diagnosis
                                  </p>
                                  <p className='text-sm text-foreground'>
                                    {visit.diagnosis}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {visit.notes && (
                            <div className='rounded-lg bg-muted/50 p-3'>
                              <div className='flex items-start gap-2'>
                                <FileText className='size-4 text-muted-foreground mt-0.5 shrink-0' />
                                <div>
                                  <p className='text-xs font-medium text-muted-foreground mb-1'>
                                    Notes
                                  </p>
                                  <p className='text-sm text-foreground italic'>
                                    {visit.notes}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
