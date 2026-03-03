<script setup lang="ts">
import type { BookingStatus } from '@/types/booking.types'
import AppBadge from '@/components/common/AppBadge.vue'

interface Props { status: BookingStatus }
defineProps<Props>()

type VariantType = 'default' | 'success' | 'warning' | 'error' | 'info'

const variants: Record<BookingStatus, VariantType> = {
  pending:     'warning',
  accepted:    'info',
  'in-progress': 'info',
  completed:   'success',
  rejected:    'error',
  cancelled:   'default',
}

const labels: Record<BookingStatus, string> = {
  pending:       '⏳ Pending',
  accepted:      '✅ Accepted',
  'in-progress': '🔧 In Progress',
  completed:     '🎉 Completed',
  rejected:      '❌ Rejected',
  cancelled:     '🚫 Cancelled',
}
</script>

<template>
  <AppBadge :variant="variants[status]" size="sm">
    {{ labels[status] }}
  </AppBadge>
</template>