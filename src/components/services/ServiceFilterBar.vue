<script setup lang="ts">
import { computed } from 'vue'
import { useServiceStore } from '@/stores/service.store'
import type { ServiceCategory } from '@/types/user.types'
import { SERVICE_CATEGORIES } from '@/utils/seed'

const serviceStore = useServiceStore()

const categories: Array<{ key: ServiceCategory | 'all'; label: string; icon: string }> = [
  { key: 'all', label: 'All', icon: '🌐' },
  ...Object.entries(SERVICE_CATEGORIES).map(([key, meta]) => ({
    key: key as ServiceCategory,
    label: meta.title.split(' ')[0],
    icon: meta.icon,
  })),
]

const activeCategory = computed(() => serviceStore.filter.category)

function selectCategory(key: ServiceCategory | 'all') {
  serviceStore.setFilter({ category: key })
}
</script>

<template>
  <div class="overflow-x-auto pb-2">
    <div class="flex gap-2 w-max">
      <button
        v-for="cat in categories"
        :key="cat.key"
        @click="selectCategory(cat.key)"
        :class="[
          'flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-medium transition-all whitespace-nowrap',
          activeCategory === cat.key
            ? 'bg-primary-600 text-white shadow-sm'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
        ]"
      >
        <span>{{ cat.icon }}</span>
        <span>{{ cat.label }}</span>
      </button>
    </div>
  </div>
</template>