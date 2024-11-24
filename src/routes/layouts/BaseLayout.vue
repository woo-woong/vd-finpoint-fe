<template>
  <div class="flex flex-col items-center min-h-screen App">
    <Header></Header>
    <main
      class="flex flex-col items-center justify-center w-full px-4 max-w-[1200px]"
    >
      <router-view />
      <SmartAssistantButton />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/common/Header.vue';
import SmartAssistantButton from '@/components/smartAssistant/SmartAssistantButton.vue';
import Footer from '@/components/common/Footer.vue';
</script>
