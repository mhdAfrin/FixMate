<script setup lang="ts">
import type { Worker } from '@/types/user.types'
import { SERVICE_CATEGORIES } from '@/utils/seed'
import { formatCurrency } from '@/utils/formatters'
import AppAvatar from '@/components/common/AppAvatar.vue'
import AppRating from '@/components/common/AppRating.vue'
import AppBadge from '@/components/common/AppBadge.vue'

interface Props {
  worker: Worker
  compact?: boolean
}
withDefaults(defineProps<Props>(), { compact: false })
defineEmits<{ select: [worker: Worker] }>()
</script>

<template>
  <div
    @click="$emit('select', worker)"
    class="card p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
  >
    <div class="flex items-start gap-3">
      <div class="relative">
        <AppAvatar
          :src="worker.avatar"
          :name="`${worker.firstName} ${worker.lastName}`"
          size="lg"
        />
        <span :class="[
          'absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800',
          worker.isAvailable ? 'bg-green-400' : 'bg-slate-300',
        ]" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-1">
          <h3 class="font-semibold text-sm text-slate-900 dark:text-white truncate">
            {{ worker.firstName }} {{ worker.lastName }}
          </h3>
          <AppBadge :variant="worker.isAvailable ? 'success' : 'default'" size="sm">
            {{ worker.isAvailable ? 'Available' : 'Busy' }}
          </AppBadge>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {{ SERVICE_CATEGORIES[worker.category]?.icon }}
          {{ SERVICE_CATEGORIES[worker.category]?.title }}
        </p>
        <AppRating :value="worker.rating" size="sm" class="mt-1" />
        <div v-if="!compact" class="flex items-center gap-3 mt-2">
          <span class="text-xs text-slate-400">📍 {{ worker.city }}</span>
          <span class="text-xs text-slate-400">💼 {{ worker.completedJobs }} jobs</span>
        </div>
        <p class="text-sm font-bold text-primary-600 mt-2">
          {{ formatCurrency(worker.hourlyRate) }}
          <span class="text-xs font-normal text-slate-400">/hr</span>
        </p>
      </div>
    </div>
  </div>
</template>