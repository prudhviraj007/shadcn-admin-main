import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { priorityColors, priorityLabels } from '../data/data'
import { type Priority } from '../types/conversation'

type PriorityBadgeProps = {
  priority: Priority
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <Badge variant='outline' className={cn('text-xs', priorityColors[priority], className)}>
      {priorityLabels[priority]}
    </Badge>
  )
}
