<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="flex items-center justify-center space-x-2">
      <div
        class="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent spinner"
      ></div>
      <p class="text-lg font-semibold text-gray-700">Loading...</p>
    </div>
  </div>
</template>

<script setup>
// Vue 3 Composition API
</script>

<style scoped>
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
