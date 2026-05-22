import { z } from 'zod'
import { NotificationTypeSchema, PrioritySchema } from './enums'

/** An in-app or push notification */
export const NotificationSchema = z.object({
  id: z.string(),
  type: NotificationTypeSchema,
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: PrioritySchema,
  read: z.boolean().default(false),
  patientId: z.string().optional(),
  patientName: z.string().optional(),
  actionUrl: z.string().optional(),
  actionLabel: z.string().optional(),
  createdAt: z.string(),
})
export type Notification = z.infer<typeof NotificationSchema>

/** Per-user notification delivery preferences */
export const NotificationPreferencesSchema = z.object({
  type: z.enum(['all', 'mentions', 'none']).default('all'),
  mobile: z.boolean().default(true),
  email: z.boolean().default(true),
  push: z.boolean().default(true),
})
export type NotificationPreferences = z.infer<
  typeof NotificationPreferencesSchema
>
