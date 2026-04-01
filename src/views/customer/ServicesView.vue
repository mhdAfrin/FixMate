<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useServiceStore } from '@/stores/service.store'
import type { Service } from '@/types/service.types'
import ServiceCard from '@/components/services/ServiceCard.vue'
import ServiceSearch from '@/components/services/ServiceSearch.vue'
import ServiceFilterBar from '@/components/services/ServiceFilterBar.vue'
import BookingModal from '@/components/booking/BookingModal.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppButton from '@/components/common/AppButton.vue'

const serviceStore = useServiceStore()
const selectedService = ref<Service | null>(null)
const showModal = ref(false)

onMounted(async () => {
  if (serviceStore.services.length === 0) await serviceStore.fetchAll()
})

function selectService(service: Service) {
  selectedService.value = service
  showModal.value = true
}
</script>

<template>
  <div class="px-5 py-4 space-y-4">
    <h1 class="text-xl font-display font-bold text-slate-900 dark:text-white">Services</h1>

    <ServiceSearch />
    <ServiceFilterBar />

    <!-- Loading state -->
    <div v-if="serviceStore.isLoading" class="grid grid-cols-2 gap-3">
      <AppSkeleton height="h-52" rounded="rounded-3xl" :count="6" />
    </div>

    <!-- Error state -->
    <div
      v-else-if="serviceStore.error"
      class="text-center py-12"
    >
      <p class="text-5xl mb-3">😕</p>
      <p class="text-slate-700 dark:text-slate-300 font-semibold mb-1">Failed to load services</p>
      <p class="text-xs text-slate-400 mb-5">{{ serviceStore.error }}</p>
      <AppButton variant="primary" @click="serviceStore.fetchAll()">
        Try Again
      </AppButton>
    </div>

    <!-- Empty search results -->
    <div v-else-if="serviceStore.filteredServices.length === 0" class="text-center py-12">
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

    <!-- Services grid -->
    <div v-else class="grid grid-cols-2 gap-3">
      <ServiceCard
        v-for="service in serviceStore.filteredServices"
        :key="service.id"
        :service="service"
        @select="selectService"
      />
    </div>
  </div>

  <BookingModal
    :show="showModal"
    :service="selectedService"
    @close="showModal = false"
  />
</template>