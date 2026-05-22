import { useRef, useEffect } from 'react'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { MessageBubble } from './message-bubble'
import { MessageInput } from './message-input'
import { type Conversation, type Message } from '../types/conversation'

type ChatPanelProps = {
  conversation: Conversation
  onBack: () => void
}

export function ChatPanel({ conversation, onBack: _onBack }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.id])

  const handleSend = (text: string) => {
    const newMsg: Message = {
      id: `m${Date.now()}`,
      author: 'staff',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    conversation.messages.push(newMsg)
  }

  return (
    <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
      <div className='flex min-h-0 flex-1 flex-col overflow-y-auto bg-muted/30'>
        <div className='mx-auto flex w-fit items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground shadow-xs my-3'>
          <ShieldCheck className='size-3.5' />
          Secure clinic conversation
        </div>

        <div className='space-y-3 px-3 sm:px-4 lg:px-6 pb-4'>
          {conversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      <div className='shrink-0 border-t bg-background p-3 sm:p-4'>
        <div className='mb-2 flex items-center gap-2 text-xs text-muted-foreground'>
          <Sparkles className='size-3.5 text-primary' />
          AI can draft a reply, but staff approval is required before sending.
        </div>
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  )
}
