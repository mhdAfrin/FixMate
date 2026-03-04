import { useUiStore } from '@/stores/ui.store'

export function useToast() {
  const uiStore = useUiStore()
  return {
    success: (msg: string) => uiStore.showToast('success', msg),
    error: (msg: string) => uiStore.showToast('error', msg),
    info: (msg: string) => uiStore.showToast('info', msg),
    warning: (msg: string) => uiStore.showToast('warning', msg),
  }
}