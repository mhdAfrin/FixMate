<script setup lang="ts">
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}
withDefaults(defineProps<Props>(), { variant: 'default', size: 'md' })
</script>

<template>
  <span :class="[
    'inline-flex items-center font-medium rounded-full',
    size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
    variant === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : '',
    variant === 'warning' ? 'bg-yellow-100 text-yellow-700' : '',
    variant === 'error'   ? 'bg-red-100 text-red-700' : '',
    variant === 'info'    ? 'bg-blue-100 text-blue-700' : '',
    variant === 'default' ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : '',
  ]">
    <slot />
  </span>
</template>