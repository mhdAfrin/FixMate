<script setup lang="ts">
import { ref, computed } from 'vue'
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

const touched = ref({
  firstName: false,
  lastName: false,
  email: false,
  username: false,
  password: false,
  phone: false,
})

// Validation rules
const firstNameError = computed(() => {
  if (!touched.value.firstName) return ''
  if (!firstName.value.trim()) return 'First name is required'
  if (firstName.value.trim().length < 2) return 'Must be at least 2 characters'
  return ''
})

const lastNameError = computed(() => {
  if (!touched.value.lastName) return ''
  if (!lastName.value.trim()) return 'Last name is required'
  return ''
})

const emailError = computed(() => {
  if (!touched.value.email) return ''
  if (!email.value.trim()) return 'Email is required'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) return 'Enter a valid email address'
  return ''
})

const phoneError = computed(() => {
  if (!touched.value.phone) return ''
  if (!phone.value.trim()) return 'Phone number is required'
  if (phone.value.trim().length < 9) return 'Enter a valid phone number'
  return ''
})

const usernameError = computed(() => {
  if (!touched.value.username) return ''
  if (!username.value.trim()) return 'Username is required'
  if (username.value.trim().length < 3) return 'Must be at least 3 characters'
  if (!/^[a-zA-Z0-9_]+$/.test(username.value)) return 'Only letters, numbers and underscores'
  return ''
})

const passwordError = computed(() => {
  if (!touched.value.password) return ''
  if (!password.value) return 'Password is required'
  if (password.value.length < 6) return 'Must be at least 6 characters'
  return ''
})

const isFormValid = computed(() => {
  return (
    firstName.value.trim().length >= 2 &&
    lastName.value.trim().length >= 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
    phone.value.trim().length >= 9 &&
    username.value.trim().length >= 3 &&
    password.value.length >= 6
  )
})

function touchAll() {
  Object.keys(touched.value).forEach((key) => {
    touched.value[key as keyof typeof touched.value] = true
  })
}

async function handleRegister() {
  touchAll()
  if (!isFormValid.value) {
    return
  }

  isLoading.value = true
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

    <button
      @click="$router.back()"
      class="self-start flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-6 transition-colors"
    >
      ← Back
    </button>

    <div class="mb-6">
      <h1 class="text-2xl font-display font-bold text-slate-900 dark:text-white">Create Account</h1>
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

    <div class="space-y-3 flex-1">
      <div class="grid grid-cols-2 gap-3">
        <AppInput
          v-model="firstName"
          label="First Name"
          placeholder="John"
          :error="firstNameError"
          @blur="touched.firstName = true"
        />
        <AppInput
          v-model="lastName"
          label="Last Name"
          placeholder="Doe"
          :error="lastNameError"
          @blur="touched.lastName = true"
        />
      </div>
      <AppInput
        v-model="email"
        label="Email"
        type="email"
        placeholder="john@email.com"
        icon="📧"
        :error="emailError"
        @blur="touched.email = true"
      />
      <AppInput
        v-model="phone"
        label="Phone"
        type="tel"
        placeholder="+94 77 123 4567"
        icon="📱"
        :error="phoneError"
        @blur="touched.phone = true"
      />
      <AppInput
        v-model="username"
        label="Username"
        placeholder="johndoe"
        icon="👤"
        :error="usernameError"
        @blur="touched.username = true"
      />
      <AppInput
        v-model="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        icon="🔒"
        :error="passwordError"
        @blur="touched.password = true"
      />
    </div>

    <!-- Form level error summary -->
    <div
      v-if="!isFormValid && Object.values(touched.value).some(Boolean)"
      class="mt-4 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3"
    >
      <span class="text-sm">⚠️</span>
      <p class="text-xs text-red-600 dark:text-red-400">Please fix the errors above before continuing</p>
    </div>

    <AppButton
      variant="primary"
      :full-width="true"
      :loading="isLoading"
      @click="handleRegister"
      class="mt-4"
    >
      Create Account
    </AppButton>

    <p class="text-center text-xs text-slate-400 mt-4">
      Already have an account?
      <RouterLink to="/auth/login" class="text-primary-600 font-semibold">Sign In</RouterLink>
    </p>
  </div>
</template>