<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore } from '@/stores/booking.store'
import { useAuthStore } from '@/stores/auth.store'
import BookingCard from '@/components/booking/BookingCard.vue'

const bookingStore = useBookingStore()
const authStore = useAuthStore()
const userId = computed(() => authStore.getUserId() ?? 0)
const myBookings = computed(() => bookingStore.customerBookings(userId.value))
</script>

<template>
  <div class="px-5 py-4">
    <h1 class="text-xl font-display font-bold text-slate-900 dark:text-white mb-4">My Bookings</h1>
    <div v-if="myBookings.length === 0" class="text-center py-16">
      <p class="text-5xl mb-4">📋</p>
      <p class="text-slate-500 font-semibold">No bookings yet</p>
      <p class="text-xs text-slate-400 mt-2">Book a service to see it here</p>
    </div>
    <div v-else class="space-y-3">
      <BookingCard
        v-for="booking in myBookings"
        :key="booking.id"
        :booking="booking"
        view-as="customer"
      />
    </div>
  </div>
</template>