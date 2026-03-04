import type { ApiResult, ApiError } from '@/types/api.types'

const BASE_URL = 'https://dummyjson.com'

async function request<T>(endpoint: string, options?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    })
    if (!response.ok) {
      const error: ApiError = { message: `HTTP ${response.status}: ${response.statusText}`, status: response.status }
      return { success: false, error }
    }
    const data = (await response.json()) as T
    return { success: true, data }
  } catch (err) {
    const error: ApiError = { message: err instanceof Error ? err.message : 'Network error', status: 0 }
    return { success: false, error }
  }
}

export const apiService = {
  get: <T>(endpoint: string): Promise<ApiResult<T>> => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown): Promise<ApiResult<T>> =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
}