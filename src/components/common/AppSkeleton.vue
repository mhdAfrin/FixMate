<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  rounded?: string
  count?: number
}
withDefaults(defineProps<Props>(), {
  width: 'w-full',
  height: 'h-4',
  rounded: 'rounded-lg',
  count: 1,
})
</script>

<template>
  <div
    v-for="i in count"
    :key="i"
    :class="[width, height, rounded, 'bg-slate-200 dark:bg-slate-700 animate-pulse']"
  />
</template>