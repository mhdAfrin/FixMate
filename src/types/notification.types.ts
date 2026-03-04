export type NotificationType =
  | 'booking-created'
  | 'booking-accepted'
  | 'booking-rejected'
  | 'booking-completed'
  | 'booking-cancelled'
  | 'new-job-request'
  | 'system'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: string
  bookingId?: string
  actionRoute?: string
}