<script setup lang="ts">
import type { AppNotification } from '@/types/notification.types'
import { formatRelativeTime } from '@/utils/formatters'

interface Props { notification: AppNotification }
defineProps<Props>()
defineEmits<{ read: [id: string] }>()

const typeIcons: Record<string, string> = {
  'booking-created':   '📝',
  'booking-accepted':  '✅',
  'booking-rejected':  '❌',
  'booking-completed': '🎉',
  'booking-cancelled': '🚫',
  'new-job-request':   '💼',
  'system':            'ℹ️',
}
</script>

<template>
  <div
    @click="$emit('read', notification.id)"
    :class="[
      'flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all',
      notification.isRead
        ? 'bg-slate-50 dark:bg-slate-800/50'
        : 'bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30',
    ]"
  >
    <div class="w-10 h-10 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center text-xl shrink-0">
      {{ typeIcons[notification.type] ?? '📢' }}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2">
        <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ notification.title }}</p>
        <span class="text-xs text-slate-400 shrink-0">{{ formatRelativeTime(notification.createdAt) }}</span>
      </div>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{{ notification.message }}</p>
    </div>
    <div v-if="!notification.isRead" class="w-2 h-2 bg-primary-500 rounded-full shrink-0 mt-1.5" />
  </div>
</template>