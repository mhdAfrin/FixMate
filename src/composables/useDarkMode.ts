import { computed } from 'vue'
import { useUiStore } from '@/stores/ui.store'

export function useDarkMode() {
  const uiStore = useUiStore()
  const isDark = computed(() => uiStore.isDarkMode)
  const toggle = () => uiStore.toggleDark()
  return { isDark, toggle }
}