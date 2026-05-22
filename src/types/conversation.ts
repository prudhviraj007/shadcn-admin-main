import {
  type MessageAuthor,
  type ConversationStatus,
  type Priority,
} from './enums'

export type Message = {
  id: string
  author: MessageAuthor
  text: string
  time: string
  readAt?: string
}

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
  createdAt: string
  updatedAt?: string
}
