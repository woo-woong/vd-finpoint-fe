<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <header class="w-full py-5 text-center text-white bg-blue-600 shadow-md">
    <h1 class="text-2xl font-bold">{{ title }}</h1>
  </header>
</template>
