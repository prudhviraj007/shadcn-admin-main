import { z } from 'zod'
import {
  MessageAuthorSchema,
  ConversationStatusSchema,
  PrioritySchema,
} from './enums'

/** A single message within a patient conversation */
export const MessageSchema = z.object({
  id: z.string(),
  author: MessageAuthorSchema,
  text: z.string().min(1, 'Message text is required'),
  time: z.string(),
  readAt: z.string().optional(),
})
export type Message = z.infer<typeof MessageSchema>

/** A patient–staff conversation thread */
export const ConversationSchema = z.object({
  id: z.string(),
  patient: z.string().min(1, 'Patient name is required'),
  patientId: z.string().optional(),
  avatar: z.string().optional(),
  subtitle: z.string().optional(),
  lastMessage: z.string().optional(),
  lastTime: z.string().optional(),
  unread: z.number().int().nonnegative().default(0),
  status: ConversationStatusSchema,
  priority: PrioritySchema,
  messages: z.array(MessageSchema).default([]),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
})
export type Conversation = z.infer<typeof ConversationSchema>
