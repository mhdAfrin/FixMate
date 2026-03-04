<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore } from '@/stores/booking.store'
import { useAuthStore } from '@/stores/auth.store'
import BookingCard from '@/components/booking/BookingCard.vue'

const bookingStore = useBookingStore()
const authStore = useAuthStore()
const userId = computed(() => authStore.getUserId() ?? 0)
const history = computed(() =>
  bookingStore.workerBookings(userId.value).filter((b) =>
    ['completed', 'rejected', 'cancelled'].includes(b.status)
  )
)
</script>

<template>
  <div class="px-5 py-4">
    <h1 class="text-xl font-display font-bold text-slate-900 dark:text-white mb-4">Work History</h1>
    <div v-if="history.length === 0" class="text-center py-16">
      <p class="text-5xl mb-4">📊</p>
      <p class="text-slate-500 font-semibold">No history yet</p>
      <p class="text-xs text-slate-400 mt-1">Completed jobs will appear here</p>
    </div>
    <div v-else class="space-y-3">
      <BookingCard
        v-for="booking in history"
        :key="booking.id"
        :booking="booking"
        view-as="worker"
      />
    </div>
  </div>
</template>