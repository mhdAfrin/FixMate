<script setup lang="ts">
import type { Booking } from '@/types/booking.types'
import { formatDate, formatCurrency } from '@/utils/formatters'
import AppAvatar from '@/components/common/AppAvatar.vue'
import BookingStatusBadge from './BookingStatusBadge.vue'
import AppButton from '@/components/common/AppButton.vue'

interface Props {
  booking: Booking
  viewAs: 'customer' | 'worker'
}
defineProps<Props>()
defineEmits<{
  accept: [id: string]
  reject: [id: string]
  complete: [id: string]
}>()
</script>

<template>
  <div class="card p-4">
    <div class="flex items-start gap-3 mb-3">
      <AppAvatar
        :src="viewAs === 'customer' ? booking.workerAvatar : booking.customerAvatar"
        :name="viewAs === 'customer' ? booking.workerName : booking.customerName"
        size="md"
      />
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <p class="font-semibold text-sm text-slate-900 dark:text-white">
            {{ viewAs === 'customer' ? booking.workerName : booking.customerName }}
          </p>
          <BookingStatusBadge :status="booking.status" />
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
          {{ booking.category.replace('-', ' ') }} Service
        </p>
      </div>
    </div>

    <div class="flex gap-3 text-xs text-slate-500 mb-3">
      <span>📅 {{ formatDate(booking.scheduledDate) }}</span>
      <span>⏰ {{ booking.scheduledTime }}</span>
    </div>

    <div class="flex items-center justify-between">
      <span class="text-sm font-bold text-primary-600">
        {{ formatCurrency(booking.price) }}
      </span>
      <div v-if="viewAs === 'worker' && booking.status === 'pending'" class="flex gap-2">
        <AppButton variant="danger" size="sm" @click="$emit('reject', booking.id)">
          Decline
        </AppButton>
        <AppButton variant="primary" size="sm" @click="$emit('accept', booking.id)">
          Accept
        </AppButton>
      </div>
      <div v-else-if="viewAs === 'worker' && booking.status === 'accepted'">
        <AppButton variant="primary" size="sm" @click="$emit('complete', booking.id)">
          Mark Complete
        </AppButton>
      </div>
    </div>
  </div>
</template>