<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useServiceStore } from '@/stores/service.store'
import { useRouter } from 'vue-router'
import type { Service } from '@/types/service.types'
import type { ServiceCategory } from '@/types/user.types'
import { SERVICE_CATEGORIES } from '@/utils/seed'
import ServiceCard from '@/components/services/ServiceCard.vue'
import ServiceSearch from '@/components/services/ServiceSearch.vue'
import ServiceFilterBar from '@/components/services/ServiceFilterBar.vue'
import BookingModal from '@/components/booking/BookingModal.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppButton from '@/components/common/AppButton.vue'
import WorkerCard from '@/components/workers/WorkerCard.vue'
import type { Worker } from '@/types/user.types'

const router = useRouter()
const serviceStore = useServiceStore()
const selectedService = ref<Service | null>(null)
const showModal = ref(false)
const activeTab = ref<'services' | 'workers'>('services')

const filteredWorkers = computed(() => {
  const q = serviceStore.searchQuery.toLowerCase()
  const cat = serviceStore.filter.category

  return serviceStore.workers.filter((w) => {
    const matchesSearch = !q ||
      w.firstName.toLowerCase().includes(q) ||
      w.lastName.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q) ||
      SERVICE_CATEGORIES[w.category]?.title.toLowerCase().includes(q) ||
      w.specializations.some((s) => s.toLowerCase().includes(q)) ||
      w.city.toLowerCase().includes(q)

    const matchesCategory = cat === 'all' || w.category === cat
    return matchesSearch && matchesCategory
  })
})

const activeCategory = computed(() =>
  serviceStore.filter.category !== 'all'
    ? SERVICE_CATEGORIES[serviceStore.filter.category as ServiceCategory]
    : null
)

onMounted(async () => {
  if (serviceStore.services.length === 0) await serviceStore.fetchAll()
})

function selectService(service: Service) {
  selectedService.value = service
  showModal.value = true
}

function selectWorker(worker: Worker) {
  router.push(`/worker-profile/${worker.id}`)
}
</script>

<template>
  <div class="px-5 py-4 space-y-4">

    <!-- Header -->
    <div>
      <h1 class="text-xl font-display font-bold text-slate-900 dark:text-white">
        Find Services
      </h1>
      <p class="text-xs text-slate-400 mt-0.5">
        {{ serviceStore.workers.length }} professionals available
      </p>
    </div>

    <!-- Search -->
    <ServiceSearch />

    <!-- Filter Bar -->
    <ServiceFilterBar />

    <!-- Active category banner -->
    <div
      v-if="activeCategory"
      :class="['rounded-2xl p-4 flex items-center gap-3', activeCategory.bgColor]"
    >
      <span class="text-3xl">{{ activeCategory.icon }}</span>
      <div>
        <p :class="['font-bold text-sm', activeCategory.color]">{{ activeCategory.title }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">{{ activeCategory.description }}</p>
      </div>
      <button
        @click="serviceStore.resetFilter()"
        class="ml-auto text-xs text-slate-400 hover:text-slate-600"
      >✕</button>
    </div>

    <!-- Tab switcher -->
    <div class="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
      <button
        @click="activeTab = 'services'"
        :class="[
          'flex-1 py-2 rounded-xl text-xs font-medium transition-all',
          activeTab === 'services'
            ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
            : 'text-slate-500',
        ]"
      >
        🔧 Services ({{ serviceStore.filteredServices.length }})
      </button>
      <button
        @click="activeTab = 'workers'"
        :class="[
          'flex-1 py-2 rounded-xl text-xs font-medium transition-all',
          activeTab === 'workers'
            ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
            : 'text-slate-500',
        ]"
      >
        👷 Workers ({{ filteredWorkers.length }})
      </button>
    </div>

    <!-- Loading -->
    <div v-if="serviceStore.isLoading" class="grid grid-cols-2 gap-3">
      <AppSkeleton height="h-52" rounded="rounded-3xl" :count="6" />
    </div>

    <!-- Error -->
    <div v-else-if="serviceStore.error" class="text-center py-12">
      <p class="text-5xl mb-3">😕</p>
      <p class="text-slate-700 dark:text-slate-300 font-semibold mb-1">
        Failed to load services
      </p>
      <p class="text-xs text-slate-400 mb-5">{{ serviceStore.error }}</p>
      <AppButton variant="primary" @click="serviceStore.fetchAll()">
        Try Again
      </AppButton>
    </div>

    <div v-else>

      <!-- Services Tab -->
      <div v-if="activeTab === 'services'">
        <div v-if="serviceStore.filteredServices.length === 0" class="text-center py-12">
          <p class="text-4xl mb-3">🔍</p>
          <p class="text-slate-500 font-medium">No services found</p>
          <p class="text-xs text-slate-400 mt-1">Try a different search or category</p>
          <button
            @click="serviceStore.resetFilter()"
            class="mt-4 text-primary-600 text-sm font-semibold"
          >
            Clear filters
          </button>
        </div>
        <div v-else class="grid grid-cols-2 gap-3">
          <ServiceCard
            v-for="service in serviceStore.filteredServices"
            :key="service.id"
            :service="service"
            @select="selectService"
          />
        </div>
      </div>

      <!-- Workers Tab -->
      <div v-else>
        <div v-if="filteredWorkers.length === 0" class="text-center py-12">
          <p class="text-4xl mb-3">👷</p>
          <p class="text-slate-500 font-medium">No workers found</p>
          <p class="text-xs text-slate-400 mt-1">Try a different search or category</p>
          <button
            @click="serviceStore.resetFilter()"
            class="mt-4 text-primary-600 text-sm font-semibold"
          >
            Clear filters
          </button>
        </div>
        <div v-else class="space-y-3">
          <WorkerCard
            v-for="worker in filteredWorkers"
            :key="worker.id"
            :worker="worker"
            @select="selectWorker"
          />
        </div>
      </div>

    </div>
  </div>

  <BookingModal
    :show="showModal"
    :service="selectedService"
    @close="showModal = false"
  />
</template>