<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { userService } from '@/services/user.service'
import type { Worker } from '@/types/user.types'
import AppAvatar from '@/components/common/AppAvatar.vue'
import AppRating from '@/components/common/AppRating.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import { SERVICE_CATEGORIES } from '@/utils/seed'
import { formatCurrency } from '@/utils/formatters'

const route = useRoute()
const worker = ref<Worker | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  const id = parseInt(route.params['id'] as string)
  const result = await userService.fetchWorkerById(id)
  if (result.success) worker.value = result.data
  isLoading.value = false
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <div class="bg-primary-600 h-32 relative">
      <button
        @click="$router.back()"
        class="absolute top-4 left-4 w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white"
      >←</button>
    </div>

    <div v-if="isLoading" class="px-5 -mt-12 space-y-4">
      <AppSkeleton height="h-24" rounded="rounded-2xl" />
      <AppSkeleton height="h-32" rounded="rounded-2xl" />
    </div>

    <div v-else-if="worker" class="px-5 -mt-12 pb-8">
      <div class="card p-5 mb-4">
        <div class="flex items-end gap-4 -mt-8 mb-4">
          <AppAvatar
            :src="worker.avatar"
            :name="`${worker.firstName} ${worker.lastName}`"
            size="xl"
            :online="worker.isAvailable"
          />
          <AppBadge :variant="worker.isAvailable ? 'success' : 'default'">
            {{ worker.isAvailable ? 'Available' : 'Busy' }}
          </AppBadge>
        </div>
        <h1 class="text-xl font-display font-bold text-slate-900 dark:text-white">
          {{ worker.firstName }} {{ worker.lastName }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          {{ SERVICE_CATEGORIES[worker.category]?.icon }}
          {{ SERVICE_CATEGORIES[worker.category]?.title }}
        </p>
        <AppRating :value="worker.rating" class="mt-2" />
        <div class="grid grid-cols-3 gap-3 mt-4">
          <div class="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <p class="font-bold text-primary-600">{{ worker.completedJobs }}</p>
            <p class="text-xs text-slate-400">Jobs</p>
          </div>
          <div class="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <p class="font-bold text-primary-600">{{ worker.yearsExperience }}y</p>
            <p class="text-xs text-slate-400">Experience</p>
          </div>
          <div class="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <p class="font-bold text-primary-600">{{ worker.totalReviews }}</p>
            <p class="text-xs text-slate-400">Reviews</p>
          </div>
        </div>
      </div>

      <div class="card p-5 mb-4">
        <h2 class="font-semibold text-slate-900 dark:text-white mb-2">About</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">{{ worker.bio }}</p>
      </div>

      <div class="card p-5 mb-4">
        <h2 class="font-semibold text-slate-900 dark:text-white mb-3">Specializations</h2>
        <div class="flex flex-wrap gap-2">
          <AppBadge v-for="spec in worker.specializations" :key="spec" variant="info">
            {{ spec }}
          </AppBadge>
        </div>
      </div>

      <div class="card p-5 flex items-center justify-between">
        <div>
          <p class="text-xs text-slate-400">Hourly Rate</p>
          <p class="text-2xl font-bold text-primary-600">{{ formatCurrency(worker.hourlyRate) }}</p>
        </div>
        <button @click="$router.push('/customer/services')" class="btn-primary">
          Book Now
        </button>
      </div>
    </div>
  </div>
</template>