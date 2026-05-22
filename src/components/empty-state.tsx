import { type LucideIcon, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-4 py-12 text-center',
        className
      )}
      role='status'
    >
      <div className='mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60 ring-1 ring-border/50'>
        <Icon className='size-6 text-muted-foreground/60' />
      </div>
      <p className='text-sm font-medium text-foreground'>{title}</p>
      {description && (
        <p className='mt-1 max-w-sm text-sm text-muted-foreground'>
          {description}
        </p>
      )}
      {action && <div className='mt-4'>{action}</div>}
    </div>
  )
}
