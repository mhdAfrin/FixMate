<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useServiceStore } from '@/stores/service.store'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingStore } from '@/stores/booking.store'
import { SERVICE_CATEGORIES } from '@/utils/seed'
import WorkerCard from '@/components/workers/WorkerCard.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppButton from '@/components/common/AppButton.vue'
import type { Worker, ServiceCategory } from '@/types/user.types'

const router = useRouter()
const serviceStore = useServiceStore()
const authStore = useAuthStore()
const bookingStore = useBookingStore()

const categories = Object.entries(SERVICE_CATEGORIES).slice(0, 6)
const featuredWorkers = computed(() => serviceStore.workers.slice(0, 4))
const userId = computed(() => authStore.getUserId() ?? 0)
const activeCount = computed(() =>
  bookingStore.activeBookings(userId.value, 'customer').length
)

onMounted(async () => {
  if (serviceStore.workers.length === 0) await serviceStore.fetchAll()
})

function browseCategory(cat: ServiceCategory) {
  serviceStore.setFilter({ category: cat })
  router.push('/customer/services')
}

function selectWorker(worker: Worker) {
  router.push(`/worker-profile/${worker.id}`)
}
</script>

<template>
  <div class="px-5 py-4 space-y-6">

    <!-- Active booking banner -->
    <div
      v-if="activeCount > 0"
      @click="router.push('/customer/activity')"
      class="bg-primary-600 text-white rounded-2xl p-4 flex items-center justify-between cursor-pointer active:scale-95 transition-all"
    >
      <div>
        <p class="font-semibold text-sm">
          {{ activeCount }} Active Booking{{ activeCount > 1 ? 's' : '' }}
        </p>
        <p class="text-primary-200 text-xs">Tap to track your services</p>
      </div>
      <span class="text-2xl">→</span>
    </div>

    <!-- Hero Banner -->
    <div class="bg-gradient-to-r from-primary-500 to-primary-700 rounded-3xl p-5 text-white relative overflow-hidden">
      <div class="absolute -right-4 -top-4 text-8xl opacity-20">🏠</div>
      <p class="text-xs font-medium text-primary-200 mb-1">Welcome to FixMate</p>
      <h2 class="text-xl font-display font-bold leading-tight mb-3">
        Find trusted<br />home professionals
      </h2>
      <button
        @click="router.push('/customer/services')"
        class="bg-white text-primary-700 text-xs font-bold px-4 py-2 rounded-xl active:scale-95 transition-all"
      >
        Browse Services →
      </button>
    </div>

    <!-- Categories -->
    <div>
      <h3 class="font-display font-bold text-slate-900 dark:text-white mb-3">
        Service Categories
      </h3>
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="[key, meta] in categories"
          :key="key"
          @click="browseCategory(key as ServiceCategory)"
          :class="[
            'card p-3 flex flex-col items-center gap-1.5 text-center active:scale-95 transition-all',
            meta.bgColor,
          ]"
        >
          <span class="text-2xl">{{ meta.icon }}</span>
          <span :class="['text-xs font-medium', meta.color]">
            {{ meta.title.split(' ')[0] }}
          </span>
        </button>
      </div>
    </div>

    <!-- Top Workers -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-display font-bold text-slate-900 dark:text-white">
          Top Professionals
        </h3>
        <button
          @click="router.push('/customer/services')"
          class="text-xs text-primary-600 font-medium"
        >
          See all
        </button>
      </div>

      <!-- Loading -->
      <div v-if="serviceStore.isLoading" class="space-y-3">
        <AppSkeleton height="h-24" rounded="rounded-3xl" :count="3" />
      </div>

      <!-- Error -->
      <div
        v-else-if="serviceStore.error"
        class="card p-5 text-center"
      >
        <p class="text-3xl mb-2">😕</p>
        <p class="text-sm text-slate-500 mb-3">Could not load professionals</p>
        <AppButton variant="outline" size="sm" @click="serviceStore.fetchAll()">
          Retry
        </AppButton>
      </div>

      <!-- Workers list -->
      <div v-else class="space-y-3">
        <WorkerCard
          v-for="worker in featuredWorkers"
          :key="worker.id"
          :worker="worker"
          @select="selectWorker"
        />
      </div>
    </div>

  </div>
</template>