<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  src?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  online?: boolean
}
const props = withDefaults(defineProps<Props>(), { size: 'md', online: false })
const sizeClasses: Record<string, string> = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-9 h-9 text-sm',
  md: 'w-11 h-11 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
}
const initials = computed(() => {
  if (!props.name) return '?'
  const parts = props.name.trim().split(' ')
  return parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase()
})
</script>

<template>
  <div class="relative inline-flex shrink-0">
    <div :class="[sizeClasses[size], 'rounded-2xl overflow-hidden bg-primary-100 dark:bg-primary-900 text-primary-600 font-bold flex items-center justify-center']">
      <img v-if="src" :src="src" :alt="name" class="w-full h-full object-cover" />
      <span v-else>{{ initials }}</span>
    </div>
    <span v-if="online" class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white dark:border-slate-900 rounded-full" />
  </div>
</template>