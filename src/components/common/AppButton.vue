<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}
withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  fullWidth: false,
})
defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    @click="$emit('click', $event)"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
      fullWidth ? 'w-full' : '',
      size === 'sm' ? 'text-xs px-4 py-2' : size === 'lg' ? 'text-base px-8 py-4' : 'text-sm px-5 py-3',
      variant === 'primary' ? 'bg-primary-600 text-white hover:bg-primary-700' : '',
      variant === 'outline' ? 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50' : '',
      variant === 'ghost' ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' : '',
      variant === 'danger' ? 'bg-red-500 text-white hover:bg-red-600' : '',
    ]"
  >
    <span v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    <slot />
  </button>
</template>