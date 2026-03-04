import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { StoredSession, LoginPayload } from '@/types/auth.types'
import type { UserRole } from '@/types/user.types'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const session = ref<StoredSession | null>(null)

  const isAuthenticated = computed(() => !!session.value)
  const isCustomer = computed(() => session.value?.role === 'customer')
  const isWorker = computed(() => session.value?.role === 'worker')
  const currentUser = computed(() => session.value)
  const token = computed(() => session.value?.token ?? null)

  function restoreSession(): void {
    const stored = authService.getSession()
    if (stored) session.value = stored
  }

  async function login(payload: LoginPayload): Promise<{ success: boolean; message?: string }> {
    const result = await authService.login(payload)
    if (!result.success) {
      return { success: false, message: result.error.message }
    }
    session.value = result.data
    authService.saveSession(result.data)
    return { success: true }
  }

  function logout(): void {
    session.value = null
    authService.clearSession()
  }

  function getUserId(): number | null {
    return session.value?.userId ?? null
  }

  function getRole(): UserRole | null {
    return session.value?.role ?? null
  }

  return {
    session,
    isAuthenticated,
    isCustomer,
    isWorker,
    currentUser,
    token,
    restoreSession,
    login,
    logout,
    getUserId,
    getRole,
  }
})