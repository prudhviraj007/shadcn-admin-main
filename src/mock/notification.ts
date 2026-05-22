import { getFaker } from './faker'
import type { Notification, NotificationPreferences } from '@/models'

const notificationTemplates: Record<string, { title: (f: ReturnType<typeof getFaker>) => string; description: (f: ReturnType<typeof getFaker>) => string }> = {
  message: {
    title: (f) => `New message from ${f.person.fullName()}`,
    description: (f) => f.lorem.sentence({ min: 5, max: 12 }),
  },
  alert: {
    title: () => 'Urgent: Abnormal lab result',
    description: (f) => `${f.person.fullName()} — ${f.lorem.sentence({ min: 4, max: 10 })}`,
  },
  reminder: {
    title: (f) => `Appointment reminder: ${f.date.soon({ days: 1 }).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`,
    description: (f) => `You have a ${f.helpers.arrayElement(['Check-up', 'Follow-up', 'Consultation'])} scheduled`,
  },
  lab_result: {
    title: (f) => `Lab results ready — ${f.person.fullName()}`,
    description: (f) => `${f.helpers.arrayElement(['CBC', 'LDL Cholesterol', 'HbA1c', 'Thyroid Panel'])} results are available for review`,
  },
  appointment: {
    title: (f) => `Appointment ${f.helpers.arrayElement(['confirmed', 'rescheduled', 'cancelled'])}`,
    description: (f) => `${f.person.fullName()} — ${f.date.soon({ days: 14 }).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`,
  },
  system: {
    title: () => 'System notification',
    description: (f) => f.lorem.sentence({ min: 5, max: 15 }),
  },
}

export function generateNotification(seed?: number): Notification {
  const f = getFaker(seed)
  const type = f.helpers.arrayElement(['message', 'alert', 'reminder', 'lab_result', 'appointment', 'system'] as const)
  const template = notificationTemplates[type]
  const patientName = f.person.fullName()

  return {
    id: `notif-${f.string.numeric(6)}`,
    type,
    title: template.title(f),
    description: template.description(f),
    priority: f.helpers.arrayElement(['urgent', 'high', 'normal', 'low'] as const),
    read: f.datatype.boolean({ probability: 0.4 }),
    patientId: type !== 'system' ? `PAT-${f.string.numeric(4)}` : undefined,
    patientName: type !== 'system' ? patientName : undefined,
    actionUrl: f.helpers.maybe(() => `/patients/${f.string.numeric(4)}`),
    actionLabel: type === 'message' ? 'View Message' : type === 'lab_result' ? 'View Results' : type === 'appointment' ? 'View Details' : undefined,
    createdAt: f.date.recent({ days: 7 }).toISOString(),
  }
}

export function generateNotifications(count: number, startSeed?: number): Notification[] {
  return Array.from({ length: count }, (_, i) => generateNotification(startSeed !== undefined ? startSeed + i : undefined))
}

export function generateNotificationPreferences(): NotificationPreferences {
  const f = getFaker()
  return {
    type: f.helpers.arrayElement(['all', 'mentions', 'none']),
    mobile: f.datatype.boolean(),
    email: f.datatype.boolean(),
    push: f.datatype.boolean(),
  }
}
