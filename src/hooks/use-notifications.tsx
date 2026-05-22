import { useEffect, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNotificationStore } from '@/stores/notification-store'
import { isSupabaseEnabled, createApi } from '@/lib/supabase'
import { useSubscription } from '@/lib/supabase/realtime'
import { generateNotifications } from '@/mock'
import type { Notification } from '@/models'

const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const

export function useNotifications() {
  const notifications = useNotificationStore((s) => s.notifications)
  const setNotifications = useNotificationStore((s) => s.setNotifications)
  const addNotification = useNotificationStore((s) => s.addNotification)
  const markReadFromStore = useNotificationStore((s) => s.markRead)
  const markAllReadFromStore = useNotificationStore((s) => s.markAllRead)
  const removeFromStore = useNotificationStore((s) => s.removeNotification)

  const queryClient = useQueryClient()
  const toastShownRef = useRef(new Set<string>())
  const syncedRef = useRef(false)

  const query = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: fetchNotifications,
    staleTime: 30 * 1000,
  })

  useEffect(() => {
    if (query.data && !syncedRef.current) {
      syncedRef.current = true
      setNotifications(query.data)
    }
  }, [query.data, setNotifications])

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isSupabaseEnabled()) {
        const api = createApi<Notification>('notifications')
        await api.update(id, { read: true } as Partial<Notification>)
      }
      markReadFromStore(id)
    },
  })

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      if (isSupabaseEnabled()) {
        const api = createApi<Notification>('notifications')
        for (const n of notifications) {
          if (!n.read) await api.update(n.id, { read: true } as Partial<Notification>)
        }
      }
      markAllReadFromStore()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isSupabaseEnabled()) {
        const api = createApi<Notification>('notifications')
        await api.remove(id)
      }
      removeFromStore(id)
    },
  })

  const handleRealtimeEvent = useCallback(
    (payload: { eventType: string; new: Notification; old: Notification }) => {
      const { eventType, new: newRecord } = payload

      switch (eventType) {
        case 'INSERT': {
          addNotification(newRecord)
          showRealtimeToast(newRecord, toastShownRef)
          queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
          break
        }
        case 'UPDATE':
          if (newRecord.read) {
            markReadFromStore(newRecord.id)
          }
          break
        case 'DELETE':
          removeFromStore(payload.old?.id)
          break
      }
    },
    [addNotification, markReadFromStore, removeFromStore, queryClient]
  )

  useSubscription<Notification>('notifications', handleRealtimeEvent)

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    isLoading: query.isLoading,
    error: query.error,
    markRead: markReadMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
    deleteNotification: deleteMutation.mutate,
  }
}

async function fetchNotifications(): Promise<Notification[]> {
  if (isSupabaseEnabled()) {
    const api = createApi<Notification>('notifications')
    const { data, error } = await api.getAll({ limit: 50 })
    if (!error && data) return data
  }
  return generateNotifications(12)
}

function showRealtimeToast(
  notification: Notification,
  shown: React.MutableRefObject<Set<string>>
) {
  if (shown.current.has(notification.id)) return
  shown.current.add(notification.id)

  const isUrgent = notification.priority === 'urgent'
  const icon = getNotificationIcon(notification.type)

  toast(
    <div className='flex items-start gap-3'>
      <span className='mt-0.5 shrink-0'>{icon}</span>
      <div className='min-w-0'>
        <p className='text-sm font-medium leading-tight'>
          {notification.title}
        </p>
        <p className='mt-0.5 text-xs text-muted-foreground line-clamp-2'>
          {notification.description}
        </p>
      </div>
    </div>,
    {
      duration: isUrgent ? 8000 : 4000,
      style: isUrgent
        ? { borderLeft: '3px solid hsl(var(--destructive))' }
        : undefined,
      action:
        notification.actionUrl && notification.actionLabel
          ? { label: notification.actionLabel, onClick: () => {} }
          : undefined,
    }
  )
}

function getNotificationIcon(type: string): string {
  switch (type) {
    case 'alert':
      return '\u26A0\uFE0F'
    case 'reminder':
      return '\u23F0'
    case 'appointment':
      return '\uD83D\uDCC5'
    case 'message':
      return '\uD83D\uDCAC'
    case 'lab_result':
      return '\uD83D\uDD2C'
    default:
      return '\uD83D\uDCC5'
  }
}
