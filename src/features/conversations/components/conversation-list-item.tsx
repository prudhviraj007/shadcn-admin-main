import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StatusBadge } from './status-badge'
import { PriorityBadge } from './priority-badge'
import { type Conversation } from '../types/conversation'

type ConversationListItemProps = {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function ConversationListItem({
  conversation,
  isActive,
  onClick,
}: ConversationListItemProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'flex w-full gap-3 rounded-lg p-3 text-start transition hover:bg-muted',
        isActive && 'bg-muted'
      )}
    >
      <div className='relative shrink-0'>
        <Avatar className='size-11'>
          <AvatarImage src={conversation.avatar} alt={conversation.patient} />
          <AvatarFallback>{getInitials(conversation.patient)}</AvatarFallback>
        </Avatar>
        {conversation.unread > 0 && (
          <span className='absolute -end-1 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground'>
            {conversation.unread > 9 ? '9+' : conversation.unread}
          </span>
        )}
      </div>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center justify-between gap-2'>
          <p className='truncate text-sm font-medium'>{conversation.patient}</p>
          <span className='shrink-0 text-xs text-muted-foreground'>
            {conversation.lastTime}
          </span>
        </div>
        <p className='truncate text-xs text-muted-foreground'>
          {conversation.subtitle}
        </p>
        <p className='mt-0.5 line-clamp-1 text-sm text-muted-foreground'>
          {conversation.lastMessage}
        </p>
        <div className='mt-1.5 flex flex-wrap items-center gap-1.5'>
          <StatusBadge status={conversation.status} className='text-[10px]' />
          <PriorityBadge
            priority={conversation.priority}
            className='text-[10px]'
          />
        </div>
      </div>
    </button>
  )
}
