import { AlertTriangle, Clock, HeartPulse, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { urgentSymptoms as fallbackSymptoms } from '../data/ai-assistant'
import { urgencyColors, urgencyLabels } from '../data/data'
import { type UrgentSymptom } from '../types'

const urgencyIcons = { critical: AlertTriangle, moderate: HeartPulse, monitor: Clock }

type SymptomCardsProps = {
  symptoms?: UrgentSymptom[]
  isLoading?: boolean
}

export function SymptomCards({ symptoms, isLoading }: SymptomCardsProps) {
  const items = symptoms ?? fallbackSymptoms
  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='flex flex-row items-center gap-2 border-b py-3'>
        <AlertTriangle className='size-4 text-rose-500' />
        <CardTitle className='text-sm font-medium'>Urgent Symptom Detection</CardTitle>
        <Badge variant='outline' className='ml-auto text-[10px] text-rose-500 border-rose-200'>
          {items.filter((s) => s.urgency === 'critical').length} critical
        </Badge>
      </CardHeader>
      <CardContent className='flex-1 p-0'>
        <ScrollArea className='h-full'>
          {isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='size-5 animate-spin text-muted-foreground' />
            </div>
          ) : (
          <div className='space-y-2 p-4'>
            {items.map((symptom) => {
              const Icon = urgencyIcons[symptom.urgency]
              return (
                <div key={symptom.id} className='rounded-lg border bg-card p-3 transition hover:shadow-sm'>
                  <div className='flex items-start justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                      <Icon className={`size-4 ${symptom.urgency === 'critical' ? 'text-rose-500' : symptom.urgency === 'moderate' ? 'text-amber-500' : 'text-sky-500'}`} />
                      <div>
                        <p className='text-sm font-medium'>{symptom.symptom}</p>
                        <p className='text-xs text-muted-foreground'>{symptom.patient}</p>
                      </div>
                    </div>
                    <Badge variant='outline' className={`text-[10px] shrink-0 ${urgencyColors[symptom.urgency]}`}>
                      {urgencyLabels[symptom.urgency]}
                    </Badge>
                  </div>
                  <p className='mt-2 text-xs text-muted-foreground'>{symptom.description}</p>
                  <div className='mt-2 flex items-center justify-between gap-2'>
                    <span className='text-[10px] text-muted-foreground'>{symptom.detectedAt}</span>
                    <Button variant='ghost' size='sm' className='h-6 text-[10px] gap-1 px-2'>
                      <AlertTriangle className='size-3' />
                      Triage
                    </Button>
                  </div>
                  <div className='mt-1.5 rounded bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground'>
                    {symptom.suggestedAction}
                  </div>
                </div>
              )
            })}
          </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
