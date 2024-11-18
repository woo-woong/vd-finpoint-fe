<template>
  <div class="App">
    <Header></Header>
    <main class="flex flex-col items-center w-[1000px] mx-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
</script>
