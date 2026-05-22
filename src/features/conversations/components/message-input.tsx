import { useState } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type MessageInputProps = {
  onSend: (text: string) => void
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex items-end gap-2 rounded-lg border bg-card p-2 shadow-xs'
    >
      <Button
        variant='ghost'
        size='icon'
        type='button'
        className='shrink-0'
      >
        <Paperclip className='size-4' />
        <span className='sr-only'>Attach file</span>
      </Button>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className='max-h-32 min-h-10 w-full min-w-0 flex-1 resize-none border-0 bg-transparent px-2 py-2 shadow-none focus-visible:ring-0'
        placeholder='Type a secure patient message...'
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
      />
      <Button
        type='submit'
        className='shrink-0 gap-2'
        disabled={!text.trim()}
      >
        <Send className='size-4' />
        <span className='hidden sm:inline'>Send</span>
      </Button>
    </form>
  )
}
