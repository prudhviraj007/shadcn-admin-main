import { Calendar, FileText, HeartPulse, Pill } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { quickActions } from '../data/ai-assistant'

const iconMap: Record<string, React.ElementType> = {
  FileText,
  HeartPulse,
  Pill,
  Calendar,
}

export function QuickActionCards() {
  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='border-b py-3'>
        <CardTitle className='text-sm font-medium'>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-2 gap-3 p-4'>
        {quickActions.map((action) => {
          const Icon = iconMap[action.iconName]
          return (
            <Button
              key={action.id}
              variant='outline'
              className='flex h-auto flex-col items-center justify-center gap-2 p-4 transition hover:border-primary/50 hover:bg-primary/5'
            >
              {Icon && <Icon className={`size-6 ${action.color}`} />}
              <div className='space-y-0.5 text-center'>
                <p className='text-xs font-medium'>{action.title}</p>
                <p className='text-[10px] text-muted-foreground leading-tight'>{action.description}</p>
              </div>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
