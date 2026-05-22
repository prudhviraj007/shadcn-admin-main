export type MessageAuthor = 'patient' | 'staff' | 'ai'

export type Message = {
  id: string
  author: MessageAuthor
  text: string
  time: string
}

export type ConversationStatus = 'needs-review' | 'ai-drafted' | 'resolved'

export type Priority = 'urgent' | 'normal' | 'low'

export type Conversation = {
  id: string
  patient: string
  patientId?: string
  avatar: string
  subtitle: string
  lastMessage: string
  lastTime: string
  unread: number
  status: ConversationStatus
  priority: Priority
  messages: Message[]
}
