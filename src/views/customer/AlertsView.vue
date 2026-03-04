<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification.store'
import NotificationItem from '@/components/notifications/NotificationItem.vue'
import AppButton from '@/components/common/AppButton.vue'

const notificationStore = useNotificationStore()
</script>

<template>
  <div class="px-5 py-4">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-display font-bold text-slate-900 dark:text-white">Notifications</h1>
      <AppButton
        v-if="notificationStore.unreadCount > 0"
        variant="ghost"
        size="sm"
        @click="notificationStore.markAllRead()"
      >
        Mark all read
      </AppButton>
    </div>
    <div v-if="notificationStore.notifications.length === 0" class="text-center py-16">
      <p class="text-5xl mb-4">🔔</p>
      <p class="text-slate-500 font-semibold">No notifications yet</p>
    </div>
    <div v-else class="space-y-2">
      <NotificationItem
        v-for="notif in notificationStore.notifications"
        :key="notif.id"
        :notification="notif"
        @read="notificationStore.markRead($event)"
      />
    </div>
  </div>
</template>