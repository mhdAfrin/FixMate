<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import AppToast from '@/components/common/AppToast.vue'

const authStore = useAuthStore()
const uiStore = useUiStore()

onMounted(() => {
  authStore.restoreSession()
  uiStore.initDarkMode()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
    <RouterView />
    <AppToast />
  </div>
</template>