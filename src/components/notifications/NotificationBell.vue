<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

interface Props { count: number }
defineProps<Props>()

const router = useRouter()
const authStore = useAuthStore()

function goToAlerts() {
  const route = authStore.isWorker ? '/worker/alerts' : '/customer/alerts'
  router.push(route)
}
</script>

<template>
  <button
    @click="goToAlerts"
    class="relative w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 transition-all hover:scale-105"
  >
    <span class="text-base">🔔</span>
    <span
      v-if="count > 0"
      class="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1"
    >
      {{ count > 99 ? '99+' : count }}
    </span>
  </button>
</template>