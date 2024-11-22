<script setup>
defineProps({
  message: String,
  required: true,
});
</script>
<template>
  <div
    @click="toggleFinProductAdvisor"
    class="relative flex items-center justify-center w-full h-full px-4 py-2 text-xl font-semibold text-blue-600 bg-white border border-gray-200 rounded-2xl"
  >
    {{ message }}
    <div
      class="absolute right-4 bottom-[-8px] w-4 h-4 bg-white border-b border-r border-gray-200 transform rotate-45"
    ></div>
  </div>
</template>
