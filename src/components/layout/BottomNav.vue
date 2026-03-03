<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'

const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

interface NavItem {
  label: string
  icon: string
  route: string
}

const customerTabs: NavItem[] = [
  { label: 'Home',     icon: '🏠', route: '/customer/home' },
  { label: 'Services', icon: '🔧', route: '/customer/services' },
  { label: 'Activity', icon: '📋', route: '/customer/activity' },
  { label: 'Alerts',   icon: '🔔', route: '/customer/alerts' },
  { label: 'Account',  icon: '👤', route: '/customer/account' },
]

const workerTabs: NavItem[] = [
  { label: 'Home',     icon: '🏠', route: '/worker/home' },
  { label: 'Jobs',     icon: '💼', route: '/worker/jobs' },
  { label: 'Activity', icon: '📋', route: '/worker/activity' },
  { label: 'Alerts',   icon: '🔔', route: '/worker/alerts' },
  { label: 'Account',  icon: '👤', route: '/worker/account' },
]

const tabs = computed(() => authStore.isWorker ? workerTabs : customerTabs)

function isActive(tabRoute: string): boolean {
  return route.path === tabRoute
}

function showBadge(tabRoute: string): boolean {
  const alertRoutes = ['/customer/alerts', '/worker/alerts']
  return alertRoutes.includes(tabRoute) && notificationStore.unreadCount > 0
}
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800"
    style="max-width:480px;margin:0 auto;"
  >
    <div class="flex items-center justify-around px-2 py-2">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.route"
        :to="tab.route"
        class="flex flex-col items-center gap-1 flex-1 py-1 relative transition-all duration-200"
        :class="[isActive(tab.route) ? 'text-primary-600' : 'text-slate-400 dark:text-slate-500']"
      >
        <div
          class="relative flex items-center justify-center w-10 h-8 rounded-2xl transition-all duration-200"
          :class="[isActive(tab.route) ? 'bg-primary-50 dark:bg-primary-900/30 scale-110' : '']"
        >
          <span class="text-lg leading-none">{{ tab.icon }}</span>
          <span
            v-if="showBadge(tab.route)"
            class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center"
          >
            {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
          </span>
        </div>
        <span class="text-[10px] font-medium leading-none">{{ tab.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>