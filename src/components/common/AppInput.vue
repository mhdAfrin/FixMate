<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  type?: string
  label?: string
  error?: string
  icon?: string
  disabled?: boolean
}
withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
})
defineEmits<{
  'update:modelValue': [value: string]
  'blur': []
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" class="text-sm font-medium text-slate-700 dark:text-slate-300">
      {{ label }}
    </label>
    <div class="relative">
      <span v-if="icon" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">
        {{ icon }}
      </span>
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
        :class="[
          'input-field transition-all duration-200',
          icon ? 'pl-10' : '',
          error
            ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-900/10'
            : 'focus:border-primary-500',
        ]"
      />
    </div>
    <div v-if="error" class="flex items-center gap-1.5">
      <span class="text-red-500 text-xs">⚠</span>
      <p class="text-xs text-red-500">{{ error }}</p>
    </div>
  </div>
</template>