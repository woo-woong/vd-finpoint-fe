<template>
  <div class="flex flex-col items-center min-h-screen App">
    <Header></Header>
    <main
      class="flex flex-col items-center justify-center w-full px-4 max-w-[1200px]"
    >
      <router-view />
      <SmartAssistantTooltip />
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/common/Header.vue';
import SmartAssistantTooltip from '@/components/smartassistant/SmartAssistantButton.vue';
</script>
