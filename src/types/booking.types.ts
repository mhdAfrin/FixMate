import type { ServiceCategory } from './user.types'

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'in-progress'
  | 'completed'
  | 'cancelled'

export interface Booking {
  id: string
  customerId: number
  workerId: number
  serviceId: number
  category: ServiceCategory
  status: BookingStatus
  scheduledDate: string
  scheduledTime: string
  address: string
  description: string
  price: number
  createdAt: string
  updatedAt: string
  customerName: string
  workerName: string
  workerAvatar: string
  customerAvatar: string
}

export interface CreateBookingPayload {
  workerId: number
  serviceId: number
  category: ServiceCategory
  scheduledDate: string
  scheduledTime: string
  address: string
  description: string
  price: number
}

export interface BookingStatusUpdate {
  bookingId: string
  status: BookingStatus
  updatedAt: string
}