export type UserRole = 'customer' | 'worker'

export type ServiceCategory =
  | 'mechanic'
  | 'ac-technician'
  | 'plumber'
  | 'electrician'
  | 'carpenter'
  | 'cleaner'
  | 'painter'
  | 'general'

export interface BaseUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  username: string
  avatar: string
  role: UserRole
  city: string
  createdAt: string
}

export interface Customer extends BaseUser {
  role: 'customer'
  bookingIds: number[]
  totalBookings: number
  preferredCategories: ServiceCategory[]
}

export interface Worker extends BaseUser {
  role: 'worker'
  category: ServiceCategory
  specializations: string[]
  hourlyRate: number
  rating: number
  totalReviews: number
  completedJobs: number
  isAvailable: boolean
  bio: string
  yearsExperience: number
  jobIds: number[]
}

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  avatar: string
  token: string
  role: UserRole
}