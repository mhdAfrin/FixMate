<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'full'
}
withDefaults(defineProps<Props>(), { size: 'md' })
defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-end justify-center"
        style="max-width:480px;margin:0 auto;"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('close')" />
        <div
          class="relative w-full bg-white dark:bg-slate-900 rounded-t-3xl z-10 animate-slide-up"
          :class="[
            size === 'sm' ? 'max-h-[40vh]' : '',
            size === 'md' ? 'max-h-[70vh]' : '',
            size === 'lg' ? 'max-h-[90vh]' : '',
          ]"
        >
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">{{ title }}</h2>
            <button
              @click="$emit('close')"
              class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
            >×</button>
          </div>
          <div class="overflow-y-auto max-h-[calc(100%-60px)]">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>