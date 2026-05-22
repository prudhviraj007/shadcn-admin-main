import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAiChatStore } from '@/features/ai-assistant/store/ai-chat-store'
import { useAiChatResponse } from './use-ai'

export function useAiChat() {
  const queryClient = useQueryClient()
  const session = useAiChatStore((s) => s.session)
  const inputValue = useAiChatStore((s) => s.inputValue)
  const setInputValue = useAiChatStore((s) => s.setInputValue)
  const sendMessage = useAiChatStore((s) => s.sendMessage)
  const mutation = useAiChatResponse()

  const handleSend = useCallback(async () => {
    const { inputValue, session } = useAiChatStore.getState()
    if (!inputValue.trim()) return

    const history = session.messages.map((m) => ({
      role: (m.author === 'staff' ? 'user' : 'assistant') as 'user' | 'assistant' | 'system',
      content: m.text,
    }))

    await sendMessage()
    await mutation.mutateAsync({ history, message: inputValue.trim() })
    queryClient.invalidateQueries({ queryKey: ['ai', 'suggestions'] })
  }, [sendMessage, mutation, queryClient])

  return {
    session,
    inputValue,
    setInputValue,
    sendMessage: handleSend,
    isSending: mutation.isPending,
  }
}
