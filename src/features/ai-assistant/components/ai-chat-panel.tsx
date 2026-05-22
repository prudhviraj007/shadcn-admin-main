import { Bot, Loader2, Send, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { useAiChatStore } from '../store/ai-chat-store'
import { type ChatMessage } from '../types'

function getInitials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isStaff = message.author === 'staff'
  const isAi = message.author === 'ai'
  return (
    <div className={`flex ${isStaff ? 'justify-end' : 'justify-start'} ${isAi ? 'justify-center' : ''}`}>
      <div
        className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
          isStaff
            ? 'rounded-br-md bg-primary text-primary-foreground'
            : message.author === 'patient'
              ? 'rounded-bl-md border bg-background'
              : 'max-w-[95%] border border-primary/20 bg-primary/5'
        }`}
      >
        {isAi && (
          <div className='mb-1.5 flex items-center gap-1.5 text-xs font-medium text-primary'>
            <Bot className='size-3.5' />
            AI Suggestion
          </div>
        )}
        <p className='leading-relaxed whitespace-pre-wrap'>{message.text}</p>
        <p className={`mt-1 text-xs ${isStaff ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
          {message.time}
        </p>
      </div>
    </div>
  )
}

export function AiChatPanel() {
  const { session, inputValue, isLoading, setInputValue, sendMessage } =
    useAiChatStore()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='flex flex-row items-center gap-3 border-b py-3'>
        <Avatar className='size-9'>
          <AvatarImage src={session.avatar} alt={session.patient} />
          <AvatarFallback>{getInitials(session.patient)}</AvatarFallback>
        </Avatar>
        <div className='min-w-0 flex-1'>
          <CardTitle className='text-sm font-medium'>{session.patient}</CardTitle>
          <p className='truncate text-xs text-muted-foreground'>{session.subtitle}</p>
        </div>
        <Sparkles className='size-4 shrink-0 text-primary' />
      </CardHeader>
      <CardContent className='flex min-h-0 flex-1 flex-col p-0'>
        <ScrollArea className='flex-1 px-4 py-3'>
          <div className='space-y-3'>
            {session.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className='flex justify-center'>
                <div className='flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-xs text-muted-foreground shadow-xs'>
                  <Loader2 className='size-3.5 animate-spin' />
                  AI is thinking...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className='flex items-end gap-2 border-t p-3'>
          <Textarea
            placeholder='Type a message...'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className='min-h-9 max-h-24 resize-none text-sm'
            disabled={isLoading}
          />
          <Button
            size='icon'
            className='shrink-0'
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
          >
            <Send className='size-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
