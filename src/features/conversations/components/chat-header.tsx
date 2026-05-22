import {
  ChevronLeft,
  Phone,
  Video,
  MoreVertical,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './status-badge'
import { PriorityBadge } from './priority-badge'
import { type Conversation } from '../types/conversation'

type ChatHeaderProps = {
  conversation: Conversation
  onBack: () => void
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
  return (
    <div className='flex shrink-0 items-center justify-between gap-3 border-b bg-background/80 p-3 sm:p-4'>
      <div className='flex min-w-0 items-center gap-3'>
        <Button
          variant='ghost'
          size='icon'
          className='shrink-0 sm:hidden'
          onClick={onBack}
        >
          <ChevronLeft className='size-5' />
        </Button>
        <Avatar className='size-11'>
          <AvatarImage
            src={conversation.avatar}
            alt={conversation.patient}
          />
          <AvatarFallback>
            {getInitials(conversation.patient)}
          </AvatarFallback>
        </Avatar>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <h2 className='truncate font-semibold'>
              {conversation.patient}
            </h2>
            <StatusBadge status={conversation.status} />
            <PriorityBadge priority={conversation.priority} />
          </div>
          <p className='truncate text-sm text-muted-foreground'>
            {conversation.subtitle} &middot; {conversation.messages.length} messages
          </p>
        </div>
      </div>
      <div className='flex shrink-0 items-center gap-1'>
        <Button variant='ghost' size='icon' className='hidden sm:inline-flex'>
          <Phone className='size-4' />
          <span className='sr-only'>Call patient</span>
        </Button>
        <Button variant='ghost' size='icon' className='hidden sm:inline-flex'>
          <Video className='size-4' />
          <span className='sr-only'>Start video visit</span>
        </Button>
        <Button variant='ghost' size='icon'>
          <MoreVertical className='size-4' />
          <span className='sr-only'>More actions</span>
        </Button>
      </div>
    </div>
  )
}
