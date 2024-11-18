<template>
  <div class="App">
    <Header></Header>
    <main class="flex flex-col items-center w-[1000px] mx-auto">
      <router-view />
      <SmartAssistantTooltip />
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/common/Header.vue';
import SmartAssistantTooltip from '@/components/smartassistant/SmartAssistantButton.vue';
</script>
