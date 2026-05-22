import {
  type NotificationType,
  type Priority,
} from './enums'

export type Notification = {
  id: string
  type: NotificationType
  title: string
  description: string
  priority: Priority
  read: boolean
  patientId?: string
  patientName?: string
  actionUrl?: string
  actionLabel?: string
  createdAt: string
}

export type NotificationPreferences = {
  type: 'all' | 'mentions' | 'none'
  mobile: boolean
  email: boolean
  push: boolean
}
