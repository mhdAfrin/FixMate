<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { useNotificationStore } from '@/stores/notification.store'
import AppAvatar from '@/components/common/AppAvatar.vue'
import NotificationBell from '@/components/notifications/NotificationBell.vue'

const authStore = useAuthStore()
const uiStore = useUiStore()
const notificationStore = useNotificationStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800" style="max-width:480px;margin:0 auto;">
    <div class="flex items-center justify-between px-5 py-3">
      <div class="flex items-center gap-3">
        <AppAvatar
          :src="authStore.currentUser?.avatar"
          :name="`${authStore.currentUser?.firstName} ${authStore.currentUser?.lastName}`"
          size="sm"
        />
        <div>
          <p class="text-xs text-slate-400">{{ greeting }},</p>
          <p class="text-sm font-semibold text-slate-900 dark:text-white">
            {{ authStore.currentUser?.firstName }} 👋
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="uiStore.toggleDark()"
          class="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 transition-all hover:scale-105"
        >
          <span class="text-base">{{ uiStore.isDarkMode ? '☀️' : '🌙' }}</span>
        </button>
        <NotificationBell :count="notificationStore.unreadCount" />
      </div>
    </div>
  </header>
</template>