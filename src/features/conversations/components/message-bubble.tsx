import { Bot, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { type Message } from '../types/conversation'

type MessageBubbleProps = {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isStaff = message.author === 'staff'
  const isAi = message.author === 'ai'

  return (
    <div
      className={cn(
        'flex',
        isStaff ? 'justify-end' : 'justify-start',
        isAi && 'justify-center'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-xs',
          isStaff && 'rounded-br-md bg-primary text-primary-foreground',
          message.author === 'patient' &&
            'rounded-bl-md border bg-background text-foreground',
          isAi && 'max-w-[90%] border border-primary/20 bg-primary/5'
        )}
      >
        {isAi && (
          <div className='mb-2 flex items-center gap-2 text-xs font-medium text-primary'>
            <Bot className='size-4' />
            AI Assistant Draft
          </div>
        )}
        <p className='leading-relaxed whitespace-pre-wrap'>{message.text}</p>
        <div
          className={cn(
            'mt-1.5 flex items-center justify-end gap-1 text-xs',
            isStaff ? 'text-primary-foreground/75' : 'text-muted-foreground'
          )}
        >
          <span>{message.time}</span>
          {isStaff && <CheckCheck className='size-3.5' />}
        </div>
        {isAi && (
          <div className='mt-3 flex items-center gap-2 border-t border-primary/10 pt-2'>
            <Button size='sm' variant='default' className='h-7 gap-1 text-xs'>
              <CheckCheck size={13} />
              Accept & Send
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='h-7 text-xs'
            >
              Edit Draft
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
