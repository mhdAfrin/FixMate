import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

export const useUiStore = defineStore('ui', () => {
  const isDarkMode = ref(localStorage.getItem('fixmate_dark') === 'true')
  const toasts = ref<Toast[]>([])

  const hasToasts = computed(() => toasts.value.length > 0)

  function toggleDark(): void {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('fixmate_dark', String(isDarkMode.value))
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }

  function initDarkMode(): void {
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }

  function showToast(type: Toast['type'], message: string, duration = 3000): void {
    const id = `toast_${Date.now()}`
    toasts.value.push({ id, type, message })
    setTimeout(() => removeToast(id), duration)
  }

  function removeToast(id: string): void {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { isDarkMode, toasts, hasToasts, toggleDark, initDarkMode, showToast, removeToast }
})