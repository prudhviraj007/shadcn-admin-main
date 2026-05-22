import { create } from 'zustand'
import type { Notification } from '@/models'

type NotificationState = {
  notifications: Notification[]
  setNotifications: (items: Notification[]) => void
  addNotification: (item: Notification) => void
  markRead: (id: string) => void
  markAllRead: () => void
  removeNotification: (id: string) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  setNotifications: (items) => set({ notifications: items }),
  addNotification: (item) =>
    set((state) => ({ notifications: [item, ...state.notifications] })),
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}))
