<script setup lang="ts">
import { ref } from 'vue'

interface Props { isAvailable: boolean }
const props = defineProps<Props>()
const emit = defineEmits<{ toggle: [value: boolean] }>()

const available = ref(props.isAvailable)

function toggle() {
  available.value = !available.value
  emit('toggle', available.value)
}
</script>

<template>
  <div class="card p-4 flex items-center justify-between">
    <div>
      <p class="font-semibold text-sm text-slate-900 dark:text-white">Availability Status</p>
      <p :class="['text-xs mt-0.5 font-medium', available ? 'text-green-500' : 'text-slate-400']">
        {{ available ? '🟢 You are available for jobs' : '🔴 You are not accepting jobs' }}
      </p>
    </div>
    <button
      @click="toggle"
      :class="[
        'relative w-14 h-7 rounded-full transition-colors duration-300',
        available ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600',
      ]"
    >
      <span :class="[
        'absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300',
        available ? 'translate-x-8' : 'translate-x-1',
      ]" />
    </button>
  </div>
</template>