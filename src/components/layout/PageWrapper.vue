<script setup lang="ts">
import TopBar from './TopBar.vue'
import BottomNav from './BottomNav.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <TopBar />
    <main class="flex-1 overflow-y-auto pb-24 pt-16">
      <RouterView />
    </main>
    <BottomNav />
  </div>
</template>