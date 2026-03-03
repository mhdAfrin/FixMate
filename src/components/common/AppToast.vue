<script setup lang="ts">
import { useUiStore } from '@/stores/ui.store'
const uiStore = useUiStore()
const icons: Record<string, string> = {
  success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[90%] max-w-[400px]">
      <TransitionGroup name="toast">
        <div
          v-for="toast in uiStore.toasts"
          :key="toast.id"
          class="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-xl border border-slate-100 dark:border-slate-700"
        >
          <span class="text-base">{{ icons[toast.type] }}</span>
          <p class="text-sm font-medium text-slate-800 dark:text-slate-200 flex-1">{{ toast.message }}</p>
          <button @click="uiStore.removeToast(toast.id)" class="text-slate-400 hover:text-slate-600 text-lg">×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateY(-20px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateX(100%); }
</style>