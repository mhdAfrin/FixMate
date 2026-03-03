<script setup lang="ts">
interface Props {
  value: number
  max?: number
  size?: 'sm' | 'md'
}
withDefaults(defineProps<Props>(), { max: 5, size: 'md' })
</script>

<template>
  <div class="flex items-center gap-0.5">
    <span
      v-for="i in max"
      :key="i"
      :class="['text-yellow-400', size === 'sm' ? 'text-xs' : 'text-sm']"
    >
      {{ i <= Math.round(value) ? '★' : '☆' }}
    </span>
    <span class="ml-1 text-xs text-slate-500 dark:text-slate-400">{{ value.toFixed(1) }}</span>
  </div>
</template>