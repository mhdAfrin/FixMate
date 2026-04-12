<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useServiceStore } from '@/stores/service.store'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingStore } from '@/stores/booking.store'
import { SERVICE_CATEGORIES, ADVERTISEMENTS, PLATFORM_STATS, TESTIMONIALS } from '@/utils/seed'
import WorkerCard from '@/components/workers/WorkerCard.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppRating from '@/components/common/AppRating.vue'
import type { Worker, ServiceCategory } from '@/types/user.types'

const router = useRouter()
const serviceStore = useServiceStore()
const authStore = useAuthStore()
const bookingStore = useBookingStore()

const categories = Object.entries(SERVICE_CATEGORIES)
const featuredWorkers = computed(() =>
  serviceStore.workers.filter((w) => w.isAvailable).slice(0, 4)
)
const userId = computed(() => authStore.getUserId() ?? 0)
const activeCount = computed(() =>
  bookingStore.activeBookings(userId.value, 'customer').length
)

const currentAd = ref(0)
let adInterval: ReturnType<typeof setInterval>

onMounted(async () => {
  if (serviceStore.workers.length === 0) await serviceStore.fetchAll()
  adInterval = setInterval(() => {
    currentAd.value = (currentAd.value + 1) % ADVERTISEMENTS.length
  }, 3500)
})

function browseCategory(cat: ServiceCategory) {
  serviceStore.setFilter({ category: cat })
  router.push('/customer/services')
}

function selectWorker(worker: Worker) {
  router.push(`/worker-profile/${worker.id}`)
}

function goToAd(index: number) {
  currentAd.value = index
}
</script>

<template>
  <div class="pb-6">

    <!-- Active Booking Banner -->
    <div
      v-if="activeCount > 0"
      @click="router.push('/customer/activity')"
      class="mx-5 mt-4 bg-primary-600 text-white rounded-2xl p-4 flex items-center justify-between cursor-pointer active:scale-95 transition-all"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
          📋
        </div>
        <div>
          <p class="font-semibold text-sm">
            {{ activeCount }} Active Booking{{ activeCount > 1 ? 's' : '' }}
          </p>
          <p class="text-primary-200 text-xs">Tap to track</p>
        </div>
      </div>
      <span class="text-xl">→</span>
    </div>

    <!-- Advertisement Carousel -->
    <div class="px-5 mt-4">
      <div class="relative rounded-3xl overflow-hidden" style="height: 160px;">

        <!-- Slider track -->
        <div
          class="flex h-full transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentAd * 100}%)` }"
        >
          <div
            v-for="ad in ADVERTISEMENTS"
            :key="ad.id"
            :class="[
              'min-w-full h-full bg-gradient-to-r p-5 text-white relative overflow-hidden flex flex-col justify-between',
              ad.bgFrom, ad.bgTo,
            ]"
          >
            <!-- Background decoration -->
            <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
            <div class="absolute -right-2 bottom-0 w-20 h-20 bg-white/5 rounded-full" />
            <div class="absolute right-8 top-1/2 -translate-y-1/2 text-6xl opacity-30">
              {{ ad.icon }}
            </div>

            <div>
              <span class="inline-block bg-white/20 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full mb-2">
                {{ ad.badge }}
              </span>
              <h3 class="text-lg font-display font-bold leading-tight">{{ ad.title }}</h3>
              <p class="text-white/80 text-xs mt-1 max-w-[70%]">{{ ad.subtitle }}</p>
            </div>

            <button
              @click="browseCategory(ad.category)"
              class="self-start bg-white/20 hover:bg-white/30 backdrop-blur text-white text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95"
            >
              {{ ad.action }} →
            </button>
          </div>
        </div>

        <!-- Left arrow -->
        <button
          @click="currentAd = (currentAd - 1 + ADVERTISEMENTS.length) % ADVERTISEMENTS.length"
          class="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
        >‹</button>

        <!-- Right arrow -->
        <button
          @click="currentAd = (currentAd + 1) % ADVERTISEMENTS.length"
          class="absolute right-10 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
        >›</button>

        <!-- Dots -->
        <div class="absolute bottom-3 right-4 flex gap-1.5">
          <button
            v-for="(_, i) in ADVERTISEMENTS"
            :key="i"
            @click="goToAd(i)"
            :class="[
              'rounded-full transition-all duration-300',
              currentAd === i
                ? 'w-4 h-1.5 bg-white'
                : 'w-1.5 h-1.5 bg-white/40',
            ]"
          />
        </div>
      </div>
    </div>

    <!-- Platform Stats -->
    <div class="px-5 mt-5">
      <div class="grid grid-cols-4 gap-2">
        <div
          v-for="stat in PLATFORM_STATS"
          :key="stat.label"
          class="card p-2.5 text-center"
        >
          <p class="text-lg">{{ stat.icon }}</p>
          <p class="text-xs font-bold text-primary-600 mt-0.5">{{ stat.value }}</p>
          <p class="text-[9px] text-slate-400 leading-tight mt-0.5">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Service Categories -->
    <div class="mt-6 px-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-display font-bold text-slate-900 dark:text-white">
          Our Services
        </h3>
        <button
          @click="router.push('/customer/services')"
          class="text-xs text-primary-600 font-medium"
        >
          View all
        </button>
      </div>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="[key, meta] in categories"
          :key="key"
          @click="browseCategory(key as ServiceCategory)"
          :class="[
            'card p-3 flex flex-col items-center gap-1.5 text-center active:scale-95 transition-all hover:shadow-md',
            meta.bgColor,
          ]"
        >
          <span class="text-2xl">{{ meta.icon }}</span>
          <span :class="['text-[10px] font-semibold leading-tight', meta.color]">
            {{ meta.title.split(' ')[0] }}
          </span>
        </button>
      </div>
    </div>

    <!-- Top Rated Workers -->
    <div class="mt-6 px-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-display font-bold text-slate-900 dark:text-white">
          Top Professionals
        </h3>
        <button
          @click="router.push('/customer/services')"
          class="text-xs text-primary-600 font-medium"
        >
          See all
        </button>
      </div>

      <div v-if="serviceStore.isLoading" class="space-y-3">
        <AppSkeleton height="h-24" rounded="rounded-3xl" :count="3" />
      </div>

      <div v-else-if="serviceStore.error" class="card p-5 text-center">
        <p class="text-3xl mb-2">😕</p>
        <p class="text-sm text-slate-500 mb-3">Could not load professionals</p>
        <AppButton variant="outline" size="sm" @click="serviceStore.fetchAll()">
          Retry
        </AppButton>
      </div>

      <div v-else class="space-y-3">
        <WorkerCard
          v-for="worker in featuredWorkers"
          :key="worker.id"
          :worker="worker"
          @select="selectWorker"
        />
      </div>
    </div>

    <!-- How It Works -->
    <div class="mt-6 px-5">
      <h3 class="font-display font-bold text-slate-900 dark:text-white mb-4">
        How It Works
      </h3>
      <div class="space-y-3">
        <div
          v-for="(step, i) in [
            { icon: '🔍', title: 'Search & Filter', desc: 'Browse professionals by service category or search by name' },
            { icon: '📋', title: 'Book Instantly', desc: 'Pick a worker, choose your time slot and confirm booking' },
            { icon: '✅', title: 'Job Done', desc: 'Worker arrives and completes the job. Pay cash or card!' },
          ]"
          :key="i"
          class="card p-4 flex items-center gap-4"
        >
          <div class="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-2xl shrink-0">
            {{ step.icon }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {{ i + 1 }}
              </span>
              <p class="font-semibold text-sm text-slate-900 dark:text-white">
                {{ step.title }}
              </p>
            </div>
            <p class="text-xs text-slate-400 mt-0.5 ml-7">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonials -->
    <div class="mt-6 px-5">
      <h3 class="font-display font-bold text-slate-900 dark:text-white mb-3">
        What Customers Say
      </h3>
      <div class="space-y-3">
        <div
          v-for="review in TESTIMONIALS"
          :key="review.id"
          class="card p-4"
        >
          <div class="flex items-center gap-3 mb-2">
            <img
              :src="review.avatar"
              :alt="review.name"
              class="w-10 h-10 rounded-2xl object-cover"
            />
            <div>
              <p class="text-sm font-semibold text-slate-900 dark:text-white">
                {{ review.name }}
              </p>
              <p class="text-xs text-slate-400">{{ review.service }}</p>
            </div>
            <AppRating :value="review.rating" size="sm" class="ml-auto" />
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
            "{{ review.comment }}"
          </p>
        </div>
      </div>
    </div>

    <!-- Bottom CTA -->
    <div class="mt-6 mx-5">
      <div class="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-5 text-white text-center relative overflow-hidden">
        <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
        <p class="text-lg font-display font-bold mb-1">Need help right now?</p>
        <p class="text-primary-200 text-xs mb-4">
          Get a professional at your doorstep within hours
        </p>
        <button
          @click="router.push('/customer/services')"
          class="bg-white text-primary-700 text-sm font-bold px-6 py-2.5 rounded-2xl active:scale-95 transition-all"
        >
          Book a Service Now
        </button>
      </div>
    </div>

  </div>
</template>