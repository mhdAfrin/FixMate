import type { UserRole } from './user.types'

export interface LoginPayload {
  username: string
  password: string
  role: UserRole
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  role: UserRole
  phone: string
}

export interface StoredSession {
  token: string
  userId: number
  role: UserRole
  username: string
  firstName: string
  lastName: string
  avatar: string
  email: string
}