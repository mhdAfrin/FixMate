<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'
import type { UserRole } from '@/types/user.types'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const username = ref('emilys')
const password = ref('emilyspass')
const role = ref<UserRole>('customer')
const isLoading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  if (!username.value || !password.value) {
    errorMessage.value = 'Please enter your credentials'
    return
  }
  isLoading.value = true
  errorMessage.value = ''

  const result = await authStore.login({
    username: username.value,
    password: password.value,
    role: role.value,
  })

  isLoading.value = false

  if (result.success) {
    toast.success(`Welcome back! Logged in as ${role.value}`)
    router.push(role.value === 'worker' ? '/worker/home' : '/customer/home')
  } else {
    errorMessage.value = 'Invalid credentials. Try: emilys / emilyspass'
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-6">

    <!-- Top logo area -->
    <div class="flex-1 flex flex-col items-center justify-center text-white mb-8">
      <div class="text-7xl mb-4">🔧</div>
      <h1 class="text-4xl font-display font-bold tracking-tight">FixMate</h1>
      <p class="text-primary-200 text-sm mt-2">On-Demand Home Services</p>
    </div>

    <!-- Login card -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl">
      <h2 class="text-xl font-display font-bold text-slate-900 dark:text-white mb-1">
        Welcome back
      </h2>
      <p class="text-sm text-slate-400 mb-5">Sign in to continue</p>

      <!-- Role selector -->
      <div class="flex gap-2 mb-5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        <button
          v-for="r in (['customer', 'worker'] as UserRole[])"
          :key="r"
          @click="role = r"
          :class="[
            'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all',
            role === r
              ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
              : 'text-slate-500 dark:text-slate-400',
          ]"
        >
          {{ r === 'customer' ? '👤 Customer' : '🔧 Worker' }}
        </button>
      </div>

      <!-- Fields -->
      <div class="space-y-3 mb-4">
        <AppInput
          v-model="username"
          label="Username"
          placeholder="e.g. emilys"
          icon="👤"
        />
        <AppInput
          v-model="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          icon="🔒"
        />
      </div>

      <!-- Error -->
      <p v-if="errorMessage" class="text-xs text-red-500 mb-3">
        {{ errorMessage }}
      </p>

      <!-- Login button -->
      <AppButton
        variant="primary"
        :full-width="true"
        :loading="isLoading"
        @click="handleLogin"
      >
        Sign In
      </AppButton>

      <!-- Register link -->
      <p class="text-center text-xs text-slate-400 mt-4">
        Don't have an account?
        <RouterLink to="/auth/register" class="text-primary-600 font-semibold">
          Register
        </RouterLink>
      </p>

      <!-- Demo credentials hint -->
      <div class="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
        <p class="text-xs text-slate-400 text-center">
          Demo: <strong class="text-slate-600 dark:text-slate-300">emilys</strong>
          /
          <strong class="text-slate-600 dark:text-slate-300">emilyspass</strong>
        </p>
      </div>
    </div>
  </div>
</template>