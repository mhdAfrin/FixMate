<script setup lang="ts">
import { ref, watch } from 'vue'
import { useServiceStore } from '@/stores/service.store'
import { useDebounceFn } from '@/composables/useApi'

const serviceStore = useServiceStore()
const query = ref(serviceStore.searchQuery)

const debouncedSearch = useDebounceFn((val: string) => {
  serviceStore.setSearch(val)
}, 300)

watch(query, (val) => debouncedSearch(val))
</script>

<template>
  <div class="relative">
    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">🔍</span>
    <input
      v-model="query"
      type="text"
      placeholder="Search services, plumbers, cleaners..."
      class="input-field pl-11"
    />
    <button
      v-if="query"
      @click="query = ''"
      class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 text-sm"
    >×</button>
  </div>
</template>