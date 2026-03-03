<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Service } from '@/types/service.types'
import type { Worker } from '@/types/user.types'
import type { CreateBookingPayload } from '@/types/booking.types'
import { useBookingStore } from '@/stores/booking.store'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { useServiceStore } from '@/stores/service.store'
import { formatCurrency } from '@/utils/formatters'
import AppModal from '@/components/common/AppModal.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import WorkerCard from '@/components/workers/WorkerCard.vue'

interface Props {
  show: boolean
  service: Service | null
}
const props = defineProps<Props>()
defineEmits<{ close: [] }>()

const bookingStore = useBookingStore()
const authStore = useAuthStore()
const uiStore = useUiStore()
const serviceStore = useServiceStore()

const step = ref<1 | 2 | 3>(1)
const selectedWorker = ref<Worker | null>(null)
const scheduledDate = ref('')
const scheduledTime = ref('')
const address = ref('')
const description = ref('')
const isSubmitting = ref(false)

const availableWorkers = computed(() =>
  props.service ? serviceStore.workersByCategory(props.service.category) : []
)

const totalPrice = computed(() =>
  props.service && selectedWorker.value
    ? props.service.basePrice + selectedWorker.value.hourlyRate
    : props.service?.basePrice ?? 0
)

const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

function selectWorker(worker: Worker) {
  selectedWorker.value = worker
  step.value = 2
}

async function submitBooking() {
  if (!props.service || !selectedWorker.value) return
  const userId = authStore.getUserId()
  if (!userId) return

  isSubmitting.value = true

  const payload: CreateBookingPayload = {
    workerId: selectedWorker.value.id,
    serviceId: props.service.id,
    category: props.service.category,
    scheduledDate: scheduledDate.value,
    scheduledTime: scheduledTime.value,
    address: address.value,
    description: description.value,
    price: totalPrice.value,
  }

  bookingStore.createBooking(
    payload,
    userId,
    `${authStore.currentUser?.firstName} ${authStore.currentUser?.lastName}`,
    authStore.currentUser?.avatar ?? '',
    `${selectedWorker.value.firstName} ${selectedWorker.value.lastName}`,
    selectedWorker.value.avatar
  )

  isSubmitting.value = false
  uiStore.showToast('success', 'Booking submitted successfully!')

  // reset
  step.value = 1
  selectedWorker.value = null
  scheduledDate.value = ''
  scheduledTime.value = ''
  address.value = ''
  description.value = ''
}
</script>

<template>
  <AppModal
    :show="show"
    :title="step === 1 ? 'Select Worker' : step === 2 ? 'Schedule' : 'Confirm Booking'"
    size="lg"
    @close="$emit('close')"
  >
    <div class="p-5">

      <!-- Step indicator -->
      <div class="flex gap-2 mb-5">
        <div
          v-for="s in [1, 2, 3]"
          :key="s"
          :class="['h-1 rounded-full flex-1 transition-all', s <= step ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700']"
        />
      </div>

      <!-- Step 1: Select Worker -->
      <div v-if="step === 1" class="space-y-3">
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {{ availableWorkers.length }} professionals available
        </p>
        <WorkerCard
          v-for="worker in availableWorkers.slice(0, 5)"
          :key="worker.id"
          :worker="worker"
          compact
          @select="selectWorker"
        />
        <p v-if="availableWorkers.length === 0" class="text-center text-slate-400 py-8">
          No workers available for this service right now
        </p>
      </div>

      <!-- Step 2: Schedule -->
      <div v-else-if="step === 2" class="space-y-4">
        <AppInput v-model="scheduledDate" label="Date" type="date" :min="minDate" icon="📅" />
        <AppInput v-model="scheduledTime" label="Time" type="time" icon="⏰" />
        <AppInput v-model="address" label="Service Address" placeholder="Enter your full address" icon="📍" />
        <div>
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
          <textarea
            v-model="description"
            placeholder="Describe the problem or service needed..."
            rows="3"
            class="input-field mt-1.5 resize-none"
          />
        </div>
        <AppButton
          variant="primary"
          :full-width="true"
          :disabled="!scheduledDate || !scheduledTime || !address"
          @click="step = 3"
        >
          Continue →
        </AppButton>
      </div>

      <!-- Step 3: Confirm -->
      <div v-else class="space-y-4">
        <div class="card p-4 space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">Service</span>
            <span class="font-medium">{{ service?.title }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">Worker</span>
            <span class="font-medium">
              {{ selectedWorker?.firstName }} {{ selectedWorker?.lastName }}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">Date & Time</span>
            <span class="font-medium">{{ scheduledDate }} at {{ scheduledTime }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">Address</span>
            <span class="font-medium text-right max-w-[60%]">{{ address }}</span>
          </div>
          <div class="border-t border-slate-100 dark:border-slate-700 pt-3 flex justify-between">
            <span class="font-semibold">Total Estimate</span>
            <span class="font-bold text-primary-600 text-lg">{{ formatCurrency(totalPrice) }}</span>
          </div>
        </div>
        <div class="flex gap-3">
          <AppButton variant="outline" @click="step = 2" class="flex-1">Back</AppButton>
          <AppButton
            variant="primary"
            :loading="isSubmitting"
            class="flex-1"
            @click="submitBooking(); $emit('close')"
          >
            Confirm Booking
          </AppButton>
        </div>
      </div>

    </div>
  </AppModal>
</template>