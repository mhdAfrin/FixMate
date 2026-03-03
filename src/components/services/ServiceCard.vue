<script setup lang="ts">
import type { Service } from '@/types/service.types'
import { SERVICE_CATEGORIES } from '@/utils/seed'
import { formatCurrency } from '@/utils/formatters'
import AppRating from '@/components/common/AppRating.vue'
import AppBadge from '@/components/common/AppBadge.vue'

interface Props { service: Service }
defineProps<Props>()
defineEmits<{ select: [service: Service] }>()
</script>

<template>
  <div
    @click="$emit('select', service)"
    class="card p-0 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
  >
    <div class="relative h-40 overflow-hidden bg-slate-100 dark:bg-slate-700">
      <img
        :src="service.thumbnail"
        :alt="service.title"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <AppBadge variant="info" size="sm" class="absolute top-3 left-3">
        {{ SERVICE_CATEGORIES[service.category]?.icon }} {{ service.category }}
      </AppBadge>
    </div>
    <div class="p-4">
      <h3 class="font-semibold text-slate-900 dark:text-white text-sm leading-tight mb-1">
        {{ service.title }}
      </h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
        {{ service.description }}
      </p>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs text-slate-400">Starting from</p>
          <p class="text-sm font-bold text-primary-600">{{ formatCurrency(service.basePrice) }}</p>
        </div>
        <div class="text-right">
          <AppRating :value="service.rating" size="sm" />
          <p class="text-xs text-slate-400 mt-0.5">{{ service.workersAvailable }} available</p>
        </div>
      </div>
    </div>
  </div>
</template>