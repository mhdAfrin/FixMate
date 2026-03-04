<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore } from '@/stores/booking.store'
import { useAuthStore } from '@/stores/auth.store'
import BookingCard from '@/components/booking/BookingCard.vue'

const bookingStore = useBookingStore()
const authStore = useAuthStore()
const userId = computed(() => authStore.getUserId() ?? 0)
const jobs = computed(() =>
  bookingStore.workerBookings(userId.value).filter((b) =>
    ['pending', 'accepted', 'in-progress'].includes(b.status)
  )
)

function accept(id: string) { bookingStore.updateStatus(id, 'accepted') }
function reject(id: string) { bookingStore.updateStatus(id, 'rejected') }
function complete(id: string) { bookingStore.updateStatus(id, 'completed') }
</script>

<template>
  <div class="px-5 py-4">
    <h1 class="text-xl font-display font-bold text-slate-900 dark:text-white mb-4">Active Jobs</h1>
    <div v-if="jobs.length === 0" class="text-center py-16">
      <p class="text-5xl mb-4">💼</p>
      <p class="text-slate-500 font-semibold">No active jobs</p>
      <p class="text-xs text-slate-400 mt-1">Job requests will appear here</p>
    </div>
    <div v-else class="space-y-3">
      <BookingCard
        v-for="booking in jobs"
        :key="booking.id"
        :booking="booking"
        view-as="worker"
        @accept="accept"
        @reject="reject"
        @complete="complete"
      />
    </div>
  </div>
</template>