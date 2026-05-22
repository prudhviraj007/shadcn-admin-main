import { useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNotificationStore } from '@/stores/notification-store'
import { useSubscription } from '@/lib/supabase/realtime'
import { isSupabaseEnabled, createApi } from '@/lib/supabase'
import { generateAppointments } from '@/mock'
import { generateAiActivities, generateAiSuggestions, generateUrgentSymptoms } from '@/mock'
import type { Notification, Appointment, AiActivity, AiSuggestion, UrgentSymptom } from '@/models'

const REMINDER_CHECK_INTERVAL = 5 * 60 * 1000
const AI_CHECK_INTERVAL = 3 * 60 * 1000

let reminderCounter = 0
let aiCounter = 0
let symptomCounter = 0

export function NotificationSystemProvider({ children }: { children: React.ReactNode }) {
  const addNotification = useNotificationStore((s) => s.addNotification)
  const notifications = useNotificationStore((s) => s.notifications)
  const queryClient = useQueryClient()
  const shownToastIds = useRef(new Set<string>())
  const syncedNotifIds = useRef(new Set<string>())

  const existingIds = new Set(notifications.map((n) => n.id))

  useQuery({
    queryKey: ['appointment-reminders'],
    queryFn: () => pollAppointmentReminders(addNotification, existingIds, shownToastIds),
    refetchInterval: REMINDER_CHECK_INTERVAL,
    staleTime: REMINDER_CHECK_INTERVAL - 10_000,
  })

  useQuery({
    queryKey: ['ai-activity-notifications'],
    queryFn: () => pollAiActivities(addNotification, existingIds, shownToastIds),
    refetchInterval: AI_CHECK_INTERVAL,
    staleTime: AI_CHECK_INTERVAL - 10_000,
  })

  useEffect(() => {
    for (const n of notifications) {
      if (!syncedNotifIds.current.has(n.id)) {
        syncedNotifIds.current.add(n.id)
      }
    }
  }, [notifications])

  useSubscription<Notification>(
    'notifications',
    (_payload) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    []
  )

  return <>{children}</>
}

async function pollAppointmentReminders(
  addNotification: (n: Notification) => void,
  existingIds: Set<string>,
  shownToastIds: React.MutableRefObject<Set<string>>
): Promise<Notification[]> {
  let appointments: Appointment[] = []

  if (isSupabaseEnabled()) {
    const api = createApi<Appointment>('appointments')
    const { data } = await api.getAll({ orderBy: 'date', ascending: true, limit: 20 })
    if (data) appointments = data
  }

  if (appointments.length === 0) {
    appointments = generateAppointments(8, 9000 + reminderCounter)
    reminderCounter++
  }

  const now = new Date()
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const reminders: Notification[] = []

  for (const apt of appointments) {
    const aptDate = new Date(apt.date)
    if (aptDate < now || aptDate > in24h) continue
    if (apt.status === 'completed' || apt.status === 'cancelled') continue
    if (existingIds.has(`reminder-${apt.id}`)) continue

    const isSoon = aptDate.getTime() - now.getTime() < 60 * 60 * 1000
    const priority = isSoon ? 'urgent' as const : 'normal' as const

    const notification: Notification = {
      id: `reminder-${apt.id}`,
      type: 'reminder',
      title: isSoon
        ? `Starting soon: ${apt.patient.name} with ${apt.doctor.name}`
        : `Upcoming: ${apt.patient.name} — ${apt.type}`,
      description: `${apt.date} at ${apt.time} · ${apt.doctor.name} · ${apt.department}`,
      priority,
      read: false,
      patientId: apt.patient.id,
      patientName: apt.patient.name,
      actionUrl: `/appointments`,
      actionLabel: 'View Appointment',
      createdAt: new Date().toISOString(),
    }

    reminders.push(notification)
    existingIds.add(notification.id)
    addNotification(notification)
    showReminderToast(notification, shownToastIds)
  }

  return reminders
}

async function pollAiActivities(
  addNotification: (n: Notification) => void,
  existingIds: Set<string>,
  shownToastIds: React.MutableRefObject<Set<string>>
): Promise<Notification[]> {
  const newNotifications: Notification[] = []
  const now = new Date().toISOString()

  const suggestions: AiSuggestion[] = generateAiSuggestions(2, 7000 + aiCounter)
  aiCounter++

  for (const sug of suggestions) {
    const id = `ai-sug-${sug.id}`
    if (existingIds.has(id)) continue

    const notification: Notification = {
      id,
      type: 'message',
      title: `AI Suggestion: ${sug.category}`,
      description: `${sug.context} — Confidence ${Math.round(sug.confidence * 100)}%`,
      priority: sug.priority,
      read: false,
      patientName: sug.contextPatient,
      actionUrl: '/ai-assistant',
      actionLabel: 'View Suggestion',
      createdAt: now,
    }
    newNotifications.push(notification)
    existingIds.add(id)
    addNotification(notification)
    showReminderToast(notification, shownToastIds)
  }

  const symptoms: UrgentSymptom[] = generateUrgentSymptoms(1, 6000 + symptomCounter)
  symptomCounter++

  for (const sym of symptoms) {
    const id = `ai-sym-${sym.id}`
    if (existingIds.has(id)) continue
    if (sym.urgency !== 'critical' && sym.urgency !== 'high') continue

    const notification: Notification = {
      id,
      type: 'alert',
      title: `Urgent: ${sym.symptom}`,
      description: `${sym.patient} — ${sym.suggestedAction}`,
      priority: 'urgent',
      read: false,
      patientId: sym.patientId,
      patientName: sym.patient,
      actionUrl: '/ai-assistant',
      actionLabel: 'Triage',
      createdAt: now,
    }
    newNotifications.push(notification)
    existingIds.add(id)
    addNotification(notification)
    showReminderToast(notification, shownToastIds)
  }

  const activities: AiActivity[] = generateAiActivities(2, 8000 + aiCounter)

  for (const act of activities) {
    const id = `ai-act-${act.id}`
    if (existingIds.has(id)) continue

    const priority = act.type === 'alert' ? 'urgent' as const : 'normal' as const
    const notifType = act.type === 'alert' ? 'alert' as const : 'system' as const

    const notification: Notification = {
      id,
      type: notifType,
      title: act.title,
      description: `${act.patient} — ${act.description}`,
      priority,
      read: false,
      patientId: act.patientId,
      patientName: act.patient,
      actionUrl: '/ai-assistant',
      actionLabel: 'View Details',
      createdAt: now,
    }
    newNotifications.push(notification)
    existingIds.add(id)
    addNotification(notification)
    showReminderToast(notification, shownToastIds)
  }

  return newNotifications
}

function showReminderToast(
  notification: Notification,
  shown: React.MutableRefObject<Set<string>>
) {
  if (shown.current.has(notification.id)) return
  shown.current.add(notification.id)

  const isUrgent = notification.priority === 'urgent'

  toast(
    <div className='flex items-start gap-3'>
      <span className='mt-0.5 shrink-0 text-lg'>
        {isUrgent ? '\u26A0\uFE0F' : notification.type === 'reminder' ? '\u23F0' : '\uD83E\uDD16'}
      </span>
      <div className='min-w-0 flex-1'>
        <p className='text-sm font-medium leading-tight'>{notification.title}</p>
        <p className='mt-0.5 text-xs text-muted-foreground line-clamp-2'>
          {notification.description}
        </p>
      </div>
    </div>,
    {
      duration: isUrgent ? 10000 : 5000,
      style: isUrgent
        ? { borderLeft: '4px solid hsl(var(--destructive))', background: 'hsl(var(--destructive)/0.08)' }
        : undefined,
      action: {
        label: notification.actionLabel ?? 'Dismiss',
        onClick: () => {},
      },
    }
  )
}
