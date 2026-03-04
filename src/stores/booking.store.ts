import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Booking, CreateBookingPayload, BookingStatus } from '@/types/booking.types'
import { useNotificationStore } from './notification.store'

const STORAGE_KEY = 'fixmate_bookings'

function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Booking[]) : []
  } catch {
    return []
  }
}

function saveBookings(bookings: Booking[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
}

type NotificationTypeForBooking =
  | 'booking-accepted'
  | 'booking-rejected'
  | 'booking-completed'
  | 'booking-cancelled'

export const useBookingStore = defineStore('bookings', () => {
  const bookings = ref<Booking[]>(loadBookings())

  const customerBookings = computed(() => (customerId: number) =>
    bookings.value.filter((b) => b.customerId === customerId)
  )
  const workerBookings = computed(() => (workerId: number) =>
    bookings.value.filter((b) => b.workerId === workerId)
  )
  const pendingForWorker = computed(() => (workerId: number) =>
    bookings.value.filter((b) => b.workerId === workerId && b.status === 'pending')
  )
  const activeBookings = computed(() => (userId: number, role: 'customer' | 'worker') => {
    const field: keyof Booking = role === 'customer' ? 'customerId' : 'workerId'
    return bookings.value.filter(
      (b) => b[field] === userId && ['pending', 'accepted', 'in-progress'].includes(b.status)
    )
  })

  function createBooking(
    payload: CreateBookingPayload,
    customerId: number,
    customerName: string,
    customerAvatar: string,
    workerName: string,
    workerAvatar: string
  ): Booking {
    const notificationStore = useNotificationStore()
    const booking: Booking = {
      id: `bk_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      customerId,
      workerId: payload.workerId,
      serviceId: payload.serviceId,
      category: payload.category,
      status: 'pending',
      scheduledDate: payload.scheduledDate,
      scheduledTime: payload.scheduledTime,
      address: payload.address,
      description: payload.description,
      price: payload.price,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerName,
      workerName,
      workerAvatar,
      customerAvatar,
    }
    bookings.value = [booking, ...bookings.value]
    saveBookings(bookings.value)
    notificationStore.addNotification({
      type: 'booking-created',
      title: 'Booking Submitted',
      message: `Your booking with ${workerName} is pending confirmation.`,
      bookingId: booking.id,
    })
    return booking
  }

  function updateStatus(bookingId: string, status: BookingStatus): void {
    const notificationStore = useNotificationStore()
    const idx = bookings.value.findIndex((b) => b.id === bookingId)
    if (idx === -1) return
    const booking = { ...bookings.value[idx], status, updatedAt: new Date().toISOString() }
    const updated = [...bookings.value]
    updated[idx] = booking
    bookings.value = updated
    saveBookings(bookings.value)
    const messages: Partial<Record<BookingStatus, string>> = {
      accepted: `Your booking has been accepted by ${booking.workerName}!`,
      rejected: `Your booking with ${booking.workerName} was declined.`,
      completed: `Job completed! Rate your experience with ${booking.workerName}.`,
      cancelled: 'Your booking has been cancelled.',
    }
    if (messages[status]) {
      notificationStore.addNotification({
        type: `booking-${status}` as NotificationTypeForBooking,
        title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: messages[status]!,
        bookingId,
      })
    }
  }

  return {
    bookings, customerBookings, workerBookings,
    pendingForWorker, activeBookings, createBooking, updateStatus,
  }
})