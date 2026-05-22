import { isSupabaseEnabled, createApi } from '@/lib/supabase'
import { mockConversations } from '../mock-data/conversations'
import { type Conversation, type Message } from '../types/conversation'

const conversationsApi = createApi<Conversation>('conversations')
const messagesApi = createApi<Message>('messages')

export async function getConversations(): Promise<Conversation[]> {
  if (isSupabaseEnabled()) {
    const { data, error } = await conversationsApi.getAll({ orderBy: 'last_time', ascending: false })
    if (error) throw error
    return data as Conversation[]
  }
  return mockConversations
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  if (isSupabaseEnabled()) {
    const { data, error } = await conversationsApi.getById(id)
    if (error) throw error
    return data as Conversation | null
  }
  return mockConversations.find((c) => c.id === id) ?? null
}

export async function createConversation(conversation: Partial<Conversation>): Promise<Conversation | null> {
  if (isSupabaseEnabled()) {
    const { data, error } = await conversationsApi.create({ ...conversation, id: crypto.randomUUID() } as Partial<Conversation>)
    if (error) throw error
    return data as Conversation | null
  }
  return null
}

export async function getMessagesByConversationId(conversationId: string): Promise<Message[]> {
  if (isSupabaseEnabled()) {
    const { data, error } = await messagesApi.getAll({ orderBy: 'created_at', ascending: true })
    if (error) throw error
    return (data as Message[]).filter((m: Message) => m.id.startsWith(conversationId))
  }
  const conv = mockConversations.find((c) => c.id === conversationId)
  return conv?.messages ?? []
}

export async function sendMessage(message: Partial<Message>): Promise<Message | null> {
  if (isSupabaseEnabled()) {
    const { data, error } = await messagesApi.create({ ...message, id: crypto.randomUUID() } as Partial<Message>)
    if (error) throw error
    return data as Message | null
  }
  return null
}

export function subscribeToConversations(
  callback: (payload: { eventType: string; new: Conversation; old: Conversation }) => void
) {
  if (!isSupabaseEnabled()) return () => {}
  return conversationsApi.subscribe(callback as never)
}

export function subscribeToMessages(
  _conversationId: string,
  callback: (payload: { eventType: string; new: Message; old: Message }) => void
) {
  if (!isSupabaseEnabled()) return () => {}
  return messagesApi.subscribe(callback as never)
}
