<template>
  <div class="App">
    <main class="flex flex-col items-center gap-5">
      <Header></Header>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
</script>
