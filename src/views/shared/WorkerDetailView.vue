<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userService } from '@/services/user.service'
import { useBookingStore } from '@/stores/booking.store'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import type { Worker } from '@/types/user.types'
import type { CreateBookingPayload } from '@/types/booking.types'
import AppAvatar from '@/components/common/AppAvatar.vue'
import AppRating from '@/components/common/AppRating.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import { SERVICE_CATEGORIES } from '@/utils/seed'
import { formatCurrency } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()
const authStore = useAuthStore()
const uiStore = useUiStore()

const worker = ref<Worker | null>(null)
const isLoading = ref(true)
const showBookingSheet = ref(false)

// Booking form
const scheduledDate = ref('')
const scheduledTime = ref('')
const address = ref('')
const description = ref('')
const paymentMethod = ref<'cash' | 'card'>('cash')
const isSubmitting = ref(false)
const bookingStep = ref<1 | 2>(1)

// Validation
const touched = ref({ date: false, time: false, address: false })
const dateError = computed(() => {
  if (!touched.value.date) return ''
  if (!scheduledDate.value) return 'Please select a date'
  return ''
})
const timeError = computed(() => {
  if (!touched.value.time) return ''
  if (!scheduledTime.value) return 'Please select a time'
  return ''
})
const addressError = computed(() => {
  if (!touched.value.address) return ''
  if (!address.value.trim()) return 'Address is required'
  if (address.value.trim().length < 10) return 'Please enter a full address'
  return ''
})

const isFormValid = computed(() =>
  scheduledDate.value && scheduledTime.value && address.value.trim().length >= 10
)

const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

const totalPrice = computed(() => {
  if (!worker.value) return 0
  return worker.value.hourlyRate * 2
})

// Fake completed jobs for this worker
const recentJobs = computed(() => {
  if (!worker.value) return []
  const jobTitles = SERVICE_CATEGORIES[worker.value.category]?.specializations ?? []
  return jobTitles.map((title, i) => ({
    id: i,
    title,
    date: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    rating: 4 + (i % 2) * 0.5,
    customerName: ['Sarah M.', 'John D.', 'Priya K.', 'Ahmed R.'][i % 4],
    price: worker.value!.hourlyRate * (1 + (i % 3)),
  }))
})

onMounted(async () => {
  const id = parseInt(route.params['id'] as string)
  const result = await userService.fetchWorkerById(id)
  if (result.success) worker.value = result.data
  isLoading.value = false
})

async function submitBooking() {
  touched.value = { date: true, time: true, address: true }
  if (!isFormValid.value || !worker.value) return

  const userId = authStore.getUserId()
  if (!userId) { router.push('/auth/login'); return }

  isSubmitting.value = true

  const payload: CreateBookingPayload = {
    workerId: worker.value.id,
    serviceId: worker.value.id,
    category: worker.value.category,
    scheduledDate: scheduledDate.value,
    scheduledTime: scheduledTime.value,
    address: address.value,
    description: description.value || `${worker.value.category} service requested`,
    price: totalPrice.value,
  }

  bookingStore.createBooking(
    payload,
    userId,
    `${authStore.currentUser?.firstName} ${authStore.currentUser?.lastName}`,
    authStore.currentUser?.avatar ?? '',
    `${worker.value.firstName} ${worker.value.lastName}`,
    worker.value.avatar
  )

  isSubmitting.value = false
  showBookingSheet.value = false
  uiStore.showToast('success', `Booking confirmed with ${worker.value.firstName}! 🎉`)

  setTimeout(() => router.push('/customer/activity'), 1000)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">

    <!-- Loading -->
    <div v-if="isLoading" class="p-5 space-y-4">
      <AppSkeleton height="h-48" rounded="rounded-3xl" />
      <AppSkeleton height="h-32" rounded="rounded-3xl" />
      <AppSkeleton height="h-24" rounded="rounded-3xl" />
    </div>

    <div v-else-if="worker">

      <!-- Hero Header -->
      <div class="bg-gradient-to-br from-primary-600 to-primary-800 pt-12 pb-16 px-5 relative overflow-hidden">
        <div class="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
        <div class="absolute -left-4 bottom-0 w-24 h-24 bg-white/5 rounded-full" />
        <button
          @click="$router.back()"
          class="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >←</button>

        <div class="flex items-center gap-4 mt-2">
          <div class="relative">
            <AppAvatar
              :src="worker.avatar"
              :name="`${worker.firstName} ${worker.lastName}`"
              size="xl"
            />
            <span :class="['absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white', worker.isAvailable ? 'bg-green-400' : 'bg-slate-400']" />
          </div>
          <div class="text-white">
            <h1 class="text-xl font-display font-bold">
              {{ worker.firstName }} {{ worker.lastName }}
            </h1>
            <p class="text-primary-200 text-sm">
              {{ SERVICE_CATEGORIES[worker.category]?.icon }}
              {{ SERVICE_CATEGORIES[worker.category]?.title }}
            </p>
            <div class="flex items-center gap-1 mt-1">
              <span class="text-yellow-300 text-sm">★</span>
              <span class="text-sm font-medium">{{ worker.rating.toFixed(1) }}</span>
              <span class="text-primary-300 text-xs">({{ worker.totalReviews }} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="px-5 -mt-8 mb-4">
        <div class="grid grid-cols-3 gap-3">
          <div class="card p-3 text-center">
            <p class="text-xl font-bold text-primary-600">{{ worker.completedJobs }}</p>
            <p class="text-xs text-slate-400 mt-0.5">Jobs Done</p>
          </div>
          <div class="card p-3 text-center">
            <p class="text-xl font-bold text-green-500">{{ worker.yearsExperience }}y</p>
            <p class="text-xs text-slate-400 mt-0.5">Experience</p>
          </div>
          <div class="card p-3 text-center">
            <p class="text-xl font-bold text-amber-500">{{ worker.rating.toFixed(1) }}</p>
            <p class="text-xs text-slate-400 mt-0.5">Rating</p>
          </div>
        </div>
      </div>

      <div class="px-5 space-y-4 pb-32">

        <!-- Availability -->
        <div :class="['card p-4 flex items-center gap-3', worker.isAvailable ? 'border-green-200 dark:border-green-800' : '']">
          <div :class="['w-10 h-10 rounded-2xl flex items-center justify-center text-xl', worker.isAvailable ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-700']">
            {{ worker.isAvailable ? '✅' : '⏸️' }}
          </div>
          <div>
            <p class="font-semibold text-sm text-slate-900 dark:text-white">
              {{ worker.isAvailable ? 'Available Now' : 'Currently Busy' }}
            </p>
            <p class="text-xs text-slate-400">
              {{ worker.isAvailable ? 'Ready to take new jobs today' : 'Available from tomorrow' }}
            </p>
          </div>
          <AppBadge :variant="worker.isAvailable ? 'success' : 'default'" class="ml-auto">
            {{ worker.isAvailable ? 'Online' : 'Busy' }}
          </AppBadge>
        </div>

        <!-- About -->
        <div class="card p-5">
          <h2 class="font-display font-bold text-slate-900 dark:text-white mb-2">About</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ worker.bio }}</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
            📍 Based in {{ worker.city }}
          </p>
        </div>

        <!-- Specializations -->
        <div class="card p-5">
          <h2 class="font-display font-bold text-slate-900 dark:text-white mb-3">Specializations</h2>
          <div class="flex flex-wrap gap-2">
            <AppBadge
              v-for="spec in worker.specializations"
              :key="spec"
              variant="info"
            >
              {{ spec }}
            </AppBadge>
          </div>
        </div>

        <!-- Recent Completed Jobs -->
        <div class="card p-5">
          <h2 class="font-display font-bold text-slate-900 dark:text-white mb-3">
            Recent Work
          </h2>
          <div class="space-y-3">
            <div
              v-for="job in recentJobs"
              :key="job.id"
              class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-base">
                  {{ SERVICE_CATEGORIES[worker.category]?.icon }}
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-900 dark:text-white">{{ job.title }}</p>
                  <p class="text-xs text-slate-400">{{ job.customerName }} · {{ job.date }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs font-bold text-primary-600">{{ formatCurrency(job.price) }}</p>
                <div class="flex items-center gap-0.5 justify-end">
                  <span class="text-yellow-400 text-xs">★</span>
                  <span class="text-xs text-slate-500">{{ job.rating }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing -->
        <div class="card p-5">
          <h2 class="font-display font-bold text-slate-900 dark:text-white mb-3">Pricing</h2>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Hourly Rate</span>
              <span class="font-semibold text-slate-900 dark:text-white">{{ formatCurrency(worker.hourlyRate) }}/hr</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Minimum Booking</span>
              <span class="font-semibold text-slate-900 dark:text-white">2 hours</span>
            </div>
            <div class="flex justify-between text-sm border-t border-slate-100 dark:border-slate-700 pt-2 mt-2">
              <span class="font-semibold text-slate-900 dark:text-white">Estimated Total</span>
              <span class="font-bold text-primary-600 text-base">{{ formatCurrency(totalPrice) }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Book Button -->
      <div class="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800" style="max-width:480px;margin:0 auto;">
        <AppButton
          variant="primary"
          :full-width="true"
          :disabled="!worker.isAvailable"
          @click="showBookingSheet = true"
          size="lg"
        >
          {{ worker.isAvailable ? `Book ${worker.firstName} Now` : 'Not Available' }}
        </AppButton>
      </div>
    </div>

    <!-- Booking Bottom Sheet -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showBookingSheet" class="fixed inset-0 z-50 flex items-end justify-center" style="max-width:480px;margin:0 auto;">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showBookingSheet = false" />
          <div class="relative w-full bg-white dark:bg-slate-900 rounded-t-3xl z-10 max-h-[90vh] overflow-y-auto">

            <!-- Handle -->
            <div class="flex justify-center pt-3 pb-1">
              <div class="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>

            <div class="px-5 pb-8">
              <div class="flex items-center justify-between mb-5">
                <h2 class="text-lg font-display font-bold text-slate-900 dark:text-white">
                  Book {{ worker?.firstName }}
                </h2>
                <button
                  @click="showBookingSheet = false"
                  class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
                >×</button>
              </div>

              <!-- Step indicator -->
              <div class="flex gap-2 mb-5">
                <div :class="['h-1 rounded-full flex-1 transition-all', bookingStep >= 1 ? 'bg-primary-500' : 'bg-slate-200']" />
                <div :class="['h-1 rounded-full flex-1 transition-all', bookingStep >= 2 ? 'bg-primary-500' : 'bg-slate-200']" />
              </div>

              <!-- Step 1: Schedule -->
              <div v-if="bookingStep === 1" class="space-y-4">
                <AppInput
                  v-model="scheduledDate"
                  label="Date"
                  type="date"
                  :min="minDate"
                  icon="📅"
                  :error="dateError"
                  @blur="touched.date = true"
                />
                <AppInput
                  v-model="scheduledTime"
                  label="Time"
                  type="time"
                  icon="⏰"
                  :error="timeError"
                  @blur="touched.time = true"
                />
                <AppInput
                  v-model="address"
                  label="Service Address"
                  placeholder="Enter your full address"
                  icon="📍"
                  :error="addressError"
                  @blur="touched.address = true"
                />
                <div>
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description (optional)
                  </label>
                  <textarea
                    v-model="description"
                    placeholder="Describe your problem..."
                    rows="2"
                    class="input-field mt-1.5 resize-none"
                  />
                </div>
                <AppButton
                  variant="primary"
                  :full-width="true"
                  :disabled="!isFormValid"
                  @click="bookingStep = 2"
                >
                  Continue →
                </AppButton>
              </div>

              <!-- Step 2: Payment + Confirm -->
              <div v-else class="space-y-4">

                <!-- Payment Method -->
                <div>
                  <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Payment Method
                  </p>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      @click="paymentMethod = 'cash'"
                      :class="[
                        'p-4 rounded-2xl border-2 transition-all text-left',
                        paymentMethod === 'cash'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-200 dark:border-slate-700',
                      ]"
                    >
                      <span class="text-2xl block mb-1">💵</span>
                      <p class="text-sm font-semibold text-slate-900 dark:text-white">Cash</p>
                      <p class="text-xs text-slate-400">Pay on delivery</p>
                    </button>
                    <button
                      @click="paymentMethod = 'card'"
                      :class="[
                        'p-4 rounded-2xl border-2 transition-all text-left',
                        paymentMethod === 'card'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-200 dark:border-slate-700',
                      ]"
                    >
                      <span class="text-2xl block mb-1">💳</span>
                      <p class="text-sm font-semibold text-slate-900 dark:text-white">Card</p>
                      <p class="text-xs text-slate-400">Pay online</p>
                    </button>
                  </div>
                </div>

                <!-- Card details if card selected -->
                <div v-if="paymentMethod === 'card'" class="card p-4 space-y-3 bg-slate-50 dark:bg-slate-800">
                  <div>
                    <label class="text-xs font-medium text-slate-600 dark:text-slate-400">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxlength="19"
                      class="input-field mt-1 text-sm"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="text-xs font-medium text-slate-600 dark:text-slate-400">Expiry</label>
                      <input type="text" placeholder="MM/YY" maxlength="5" class="input-field mt-1 text-sm" />
                    </div>
                    <div>
                      <label class="text-xs font-medium text-slate-600 dark:text-slate-400">CVV</label>
                      <input type="text" placeholder="123" maxlength="3" class="input-field mt-1 text-sm" />
                    </div>
                  </div>
                </div>

                <!-- Order Summary -->
                <div class="card p-4 space-y-2">
                  <h3 class="font-semibold text-sm text-slate-900 dark:text-white mb-3">Order Summary</h3>
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Worker</span>
                    <span class="font-medium">{{ worker?.firstName }} {{ worker?.lastName }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Date</span>
                    <span class="font-medium">{{ scheduledDate }} at {{ scheduledTime }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Payment</span>
                    <span class="font-medium capitalize">{{ paymentMethod === 'cash' ? '💵 Cash on Delivery' : '💳 Online Card' }}</span>
                  </div>
                  <div class="border-t border-slate-100 dark:border-slate-700 pt-2 flex justify-between">
                    <span class="font-bold text-slate-900 dark:text-white">Total</span>
                    <span class="font-bold text-primary-600 text-lg">{{ formatCurrency(totalPrice) }}</span>
                  </div>
                </div>

                <div class="flex gap-3">
                  <AppButton variant="outline" @click="bookingStep = 1" class="flex-1">
                    Back
                  </AppButton>
                  <AppButton
                    variant="primary"
                    :loading="isSubmitting"
                    @click="submitBooking"
                    class="flex-1"
                  >
                    Confirm Booking
                  </AppButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: all 0.3s ease;
}
.sheet-enter-from .sheet-leave-to {
  opacity: 0;
}
</style>
