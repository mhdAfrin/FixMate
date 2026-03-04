import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppNotification, NotificationType } from '@/types/notification.types'

const STORAGE_KEY = 'fixmate_notifications'

interface AddNotificationPayload {
  type: NotificationType
  title: string
  message: string
  bookingId?: string
  actionRoute?: string
}

function load(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AppNotification[]) : []
  } catch {
    return []
  }
}

function save(notifications: AppNotification[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<AppNotification[]>(load())
  const unreadCount = computed(() => notifications.value.filter((n) => !n.isRead).length)

  function addNotification(payload: AddNotificationPayload): void {
    const notification: AppNotification = {
      id: `ntf_${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
      ...payload,
    }
    notifications.value = [notification, ...notifications.value]
    save(notifications.value)
  }

  function markRead(id: string): void {
    notifications.value = notifications.value.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    )
    save(notifications.value)
  }

  function markAllRead(): void {
    notifications.value = notifications.value.map((n) => ({ ...n, isRead: true }))
    save(notifications.value)
  }

  function clear(): void {
    notifications.value = []
    save([])
  }

  return { notifications, unreadCount, addNotification, markRead, markAllRead, clear }
})