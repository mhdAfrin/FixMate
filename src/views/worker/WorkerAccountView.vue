<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import AppAvatar from '@/components/common/AppAvatar.vue'
import AppButton from '@/components/common/AppButton.vue'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

function logout() {
  authStore.logout()
  toast.info('Logged out successfully')
  router.push('/auth/login')
}
</script>

<template>
  <div class="px-5 py-4">
    <h1 class="text-xl font-display font-bold text-slate-900 dark:text-white mb-5">My Profile</h1>

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
        <span class="inline-flex items-center gap-1 mt-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
          🔧 Worker
        </span>
      </div>
    </div>

    <AppButton variant="danger" :full-width="true" @click="logout">
      Sign Out
    </AppButton>
  </div>
</template>