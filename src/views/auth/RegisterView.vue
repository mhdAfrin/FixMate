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

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const username = ref('')
const password = ref('')
const phone = ref('')
const role = ref<UserRole>('customer')
const isLoading = ref(false)

async function handleRegister() {
  if (!firstName.value || !username.value || !password.value) {
    return
  }
  isLoading.value = true

  // Simulate registration delay then login with demo account
  await new Promise((r) => setTimeout(r, 800))

  const result = await authStore.login({
    username: 'emilys',
    password: 'emilyspass',
    role: role.value,
  })

  isLoading.value = false

  if (result.success) {
    toast.success('Account created! Welcome to FixMate 🎉')
    router.push(role.value === 'worker' ? '/worker/home' : '/customer/home')
  }
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 flex flex-col p-6">

    <!-- Back button -->
    <button
      @click="$router.back()"
      class="self-start flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-6 transition-colors"
    >
      ← Back
    </button>

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-display font-bold text-slate-900 dark:text-white">
        Create Account
      </h1>
      <p class="text-sm text-slate-400 mt-1">Join FixMate today</p>
    </div>

    <!-- Role selector -->
    <div class="flex gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
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

    <!-- Form fields -->
    <div class="space-y-3 flex-1">
      <div class="grid grid-cols-2 gap-3">
        <AppInput v-model="firstName" label="First Name" placeholder="John" />
        <AppInput v-model="lastName" label="Last Name" placeholder="Doe" />
      </div>
      <AppInput
        v-model="email"
        label="Email"
        type="email"
        placeholder="john@email.com"
        icon="📧"
      />
      <AppInput
        v-model="phone"
        label="Phone"
        type="tel"
        placeholder="+94 77 123 4567"
        icon="📱"
      />
      <AppInput
        v-model="username"
        label="Username"
        placeholder="johndoe"
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

    <!-- Register button -->
    <AppButton
      variant="primary"
      :full-width="true"
      :loading="isLoading"
      :disabled="!firstName || !username || !password"
      @click="handleRegister"
      class="mt-6"
    >
      Create Account
    </AppButton>

    <p class="text-center text-xs text-slate-400 mt-4">
      Already have an account?
      <RouterLink to="/auth/login" class="text-primary-600 font-semibold">
        Sign In
      </RouterLink>
    </p>
  </div>
</template>