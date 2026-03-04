import { apiService } from './api.service'
import type { DummyJsonAuthResponse } from '@/types/api.types'
import type { LoginPayload, StoredSession } from '@/types/auth.types'
import type { ApiResult } from '@/types/api.types'

export const authService = {
  async login(payload: LoginPayload): Promise<ApiResult<StoredSession>> {
    const result = await apiService.post<DummyJsonAuthResponse>('/auth/login', {
      username: payload.username,
      password: payload.password,
      expiresInMins: 60,
    })
    if (!result.success) return result
    const session: StoredSession = {
      token: result.data.token,
      userId: result.data.id,
      role: payload.role,
      username: result.data.username,
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      avatar: result.data.image,
      email: result.data.email,
    }
    return { success: true, data: session }
  },

  saveSession(session: StoredSession): void {
    localStorage.setItem('fixmate_session', JSON.stringify(session))
  },

  getSession(): StoredSession | null {
    const raw = localStorage.getItem('fixmate_session')
    if (!raw) return null
    try { return JSON.parse(raw) as StoredSession } catch { return null }
  },

  clearSession(): void {
    localStorage.removeItem('fixmate_session')
  },
}