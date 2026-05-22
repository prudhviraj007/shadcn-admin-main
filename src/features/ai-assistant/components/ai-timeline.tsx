import { AlertTriangle, Bot, FileText, Lightbulb, UserCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { aiActivities } from '../data/ai-assistant'
import { type ActivityType } from '../types'

const activityIcons: Record<ActivityType, React.ElementType> = {
  alert: AlertTriangle,
  summary: FileText,
  suggestion: Lightbulb,
  draft: Bot,
  review: UserCheck,
}

const activityColors: Record<ActivityType, string> = {
  alert: 'text-rose-500 bg-rose-50 dark:bg-rose-950',
  summary: 'text-violet-500 bg-violet-50 dark:bg-violet-950',
  suggestion: 'text-amber-500 bg-amber-50 dark:bg-amber-950',
  draft: 'text-primary bg-primary/10',
  review: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950',
}

const activityBadgeStyles: Record<ActivityType, string> = {
  alert: 'border-rose-200 text-rose-600 dark:border-rose-900 dark:text-rose-400',
  summary: 'border-violet-200 text-violet-600 dark:border-violet-900 dark:text-violet-400',
  suggestion: 'border-amber-200 text-amber-600 dark:border-amber-900 dark:text-amber-400',
  draft: 'border-primary/20 text-primary',
  review: 'border-emerald-200 text-emerald-600 dark:border-emerald-900 dark:text-emerald-400',
}

const activityLabels: Record<ActivityType, string> = {
  alert: 'Alert',
  summary: 'Summary',
  suggestion: 'Suggestion',
  draft: 'AI Draft',
  review: 'Review',
}

export function AiTimeline() {
  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='flex flex-row items-center gap-2 border-b py-3'>
        <Bot className='size-4 text-primary' />
        <CardTitle className='text-sm font-medium'>AI Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent className='flex-1 p-0'>
        <ScrollArea className='h-full'>
          <div className='relative p-4'>
            <div className='absolute bottom-4 left-7 top-4 w-px bg-border' />
            <div className='space-y-4'>
              {aiActivities.map((activity) => {
                const Icon = activityIcons[activity.type]
                return (
                  <div key={activity.id} className='relative flex items-start gap-3'>
                    <div className={`z-10 flex size-9 shrink-0 items-center justify-center rounded-full border ${activityColors[activity.type]}`}>
                      <Icon className='size-4' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-medium leading-none'>{activity.title}</p>
                        <Badge variant='outline' className={`text-[10px] ${activityBadgeStyles[activity.type]}`}>
                          {activityLabels[activity.type]}
                        </Badge>
                      </div>
                      <p className='mt-1 text-xs text-muted-foreground'>{activity.description}</p>
                      <div className='mt-1 flex items-center gap-2 text-[10px] text-muted-foreground'>
                        <span>{activity.patient}</span>
                        <span>&middot;</span>
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
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
