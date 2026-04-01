import type { ApiResult, ApiError } from '@/types/api.types'

const BASE_URL = 'https://dummyjson.com'

async function request<T>(endpoint: string, options?: RequestInit): Promise<ApiResult<T>> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      signal: controller.signal,
      ...options,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error: ApiError = {
        message: response.status === 401
          ? 'Invalid credentials. Please check your username and password.'
          : response.status === 404
          ? 'Resource not found.'
          : response.status >= 500
          ? 'Server error. Please try again later.'
          : `Request failed (${response.status})`,
        status: response.status,
      }
      return { success: false, error }
    }

    const data = (await response.json()) as T
    return { success: true, data }

  } catch (err) {
    const error: ApiError = {
      message: err instanceof Error
        ? err.name === 'AbortError'
          ? 'Request timed out. Please check your connection.'
          : err.message === 'Failed to fetch'
          ? 'No internet connection. Please check your network.'
          : err.message
        : 'Something went wrong. Please try again.',
      status: 0,
    }
    return { success: false, error }
  }
}

export const apiService = {
  get: <T>(endpoint: string): Promise<ApiResult<T>> => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown): Promise<ApiResult<T>> =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
}