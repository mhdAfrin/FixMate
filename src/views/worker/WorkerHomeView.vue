<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookingStore } from '@/stores/booking.store'
import { useAuthStore } from '@/stores/auth.store'
import { useServiceStore } from '@/stores/service.store'
import WorkerAvailabilityToggle from '@/components/workers/WorkerAvailabilityToggle.vue'
import BookingCard from '@/components/booking/BookingCard.vue'
import { formatCurrency } from '@/utils/formatters'

const bookingStore = useBookingStore()
const authStore = useAuthStore()
const serviceStore = useServiceStore()

const isAvailable = ref(true)
const userId = computed(() => authStore.getUserId() ?? 0)
const pendingJobs = computed(() => bookingStore.pendingForWorker(userId.value))
const workerBookingsList = computed(() => bookingStore.workerBookings(userId.value))
const completedCount = computed(() =>
  workerBookingsList.value.filter((b) => b.status === 'completed').length
)
const totalEarnings = computed(() =>
  workerBookingsList.value
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + b.price, 0)
)

onMounted(async () => {
  if (serviceStore.workers.length === 0) await serviceStore.fetchAll()
})

function accept(id: string) { bookingStore.updateStatus(id, 'accepted') }
function reject(id: string) { bookingStore.updateStatus(id, 'rejected') }
</script>

<template>
  <div class="px-5 py-4 space-y-5">
    <WorkerAvailabilityToggle :is-available="isAvailable" @toggle="isAvailable = $event" />

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-3">
      <div class="card p-3 text-center">
        <p class="text-2xl font-bold text-primary-600">{{ pendingJobs.length }}</p>
        <p class="text-xs text-slate-400 mt-0.5">Pending</p>
      </div>
      <div class="card p-3 text-center">
        <p class="text-2xl font-bold text-green-500">{{ completedCount }}</p>
        <p class="text-xs text-slate-400 mt-0.5">Completed</p>
      </div>
      <div class="card p-3 text-center">
        <p class="text-sm font-bold text-amber-500">{{ formatCurrency(totalEarnings) }}</p>
        <p class="text-xs text-slate-400 mt-0.5">Earnings</p>
      </div>
    </div>

    <!-- Pending Jobs -->
    <div>
      <h3 class="font-display font-bold text-slate-900 dark:text-white mb-3">
        Pending Requests ({{ pendingJobs.length }})
      </h3>
      <div v-if="pendingJobs.length === 0" class="card p-6 text-center">
        <p class="text-3xl mb-2">💤</p>
        <p class="text-sm text-slate-400">No pending requests</p>
      </div>
      <div v-else class="space-y-3">
        <BookingCard
          v-for="booking in pendingJobs"
          :key="booking.id"
          :booking="booking"
          view-as="worker"
          @accept="accept"
          @reject="reject"
        />
      </div>
    </div>
  </div>
</template>