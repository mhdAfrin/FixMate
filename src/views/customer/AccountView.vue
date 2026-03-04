<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui.store'
import { useToast } from '@/composables/useToast'
import AppAvatar from '@/components/common/AppAvatar.vue'

const authStore = useAuthStore()
const router = useRouter()
const uiStore = useUiStore()
const toast = useToast()

function logout() {
  authStore.logout()
  toast.info('Logged out successfully')
  router.push('/auth/login')
}
</script>

<template>
  <div class="px-5 py-4">
    <h1 class="text-xl font-display font-bold text-slate-900 dark:text-white mb-5">Account</h1>

    <div class="card p-5 flex items-center gap-4 mb-5">
      <AppAvatar
        :src="authStore.currentUser?.avatar"
        :name="`${authStore.currentUser?.firstName} ${authStore.currentUser?.lastName}`"
        size="xl"
      />
      <div>
        <h2 class="font-bold text-lg text-slate-900 dark:text-white">
          {{ authStore.currentUser?.firstName }} {{ authStore.currentUser?.lastName }}
        </h2>
        <p class="text-xs text-slate-400">{{ authStore.currentUser?.email }}</p>
        <span class="inline-flex items-center gap-1 mt-1 text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-full">
          👤 Customer
        </span>
      </div>
    </div>

    <div class="card divide-y divide-slate-100 dark:divide-slate-700 mb-4">
      <button
        @click="uiStore.toggleDark()"
        class="flex items-center justify-between w-full px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <div class="flex items-center gap-3">
          <span class="text-xl">{{ uiStore.isDarkMode ? '☀️' : '🌙' }}</span>
          <span class="text-sm font-medium text-slate-900 dark:text-white">Dark Mode</span>
        </div>
        <span class="text-xs text-slate-400">{{ uiStore.isDarkMode ? 'On' : 'Off' }}</span>
      </button>
      <div class="flex items-center justify-between w-full px-5 py-4">
        <div class="flex items-center gap-3">
          <span class="text-xl">📱</span>
          <span class="text-sm font-medium text-slate-900 dark:text-white">Version</span>
        </div>
        <span class="text-xs text-slate-400">1.0.0</span>
      </div>
    </div>

    <button
      @click="logout"
      class="w-full card px-5 py-4 flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
    >
      <span class="text-xl">🚪</span>
      <span class="font-medium text-sm">Sign Out</span>
    </button>
  </div>
</template>