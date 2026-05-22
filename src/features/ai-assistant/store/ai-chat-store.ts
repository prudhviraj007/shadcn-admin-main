import { create } from 'zustand'
import { chatSessions } from '../data/ai-assistant'
import { getAiChatResponse } from '@/lib/ai'
import type { ChatMessage, ChatSession } from '../types'

type AiChatState = {
  session: ChatSession
  inputValue: string
  isLoading: boolean
  setInputValue: (value: string) => void
  sendMessage: () => Promise<void>
}

export const useAiChatStore = create<AiChatState>((set, get) => ({
  session: chatSessions[0],
  inputValue: '',
  isLoading: false,

  setInputValue: (value: string) => set({ inputValue: value }),

  sendMessage: async () => {
    const { inputValue, session } = get()
    if (!inputValue.trim() || get().isLoading) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: 'staff',
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    set((state) => ({
      inputValue: '',
      isLoading: true,
      session: {
        ...state.session,
        messages: [...state.session.messages, userMessage],
      },
    }))

    try {
      const history = session.messages.map((m) => ({
        role: m.author === 'staff' ? 'user' as const : m.author === 'ai' ? 'assistant' as const : 'user' as const,
        content: m.text,
      }))

      const reply = await getAiChatResponse(history, inputValue.trim())

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        author: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      set((state) => ({
        isLoading: false,
        session: {
          ...state.session,
          messages: [...state.session.messages, aiMessage],
          lastMessage: reply,
        },
      }))
    } catch {
      set({ isLoading: false })
    }
  },
}))
