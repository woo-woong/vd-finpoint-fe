<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleBack = () => {
  router.back();
};
</script>

<template>
  <button 
    @click="handleBack"
    class="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all duration-200 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 hover:text-gray-900 hover:shadow"
  >
    <span class="text-lg">←</span>
    <span>이전 페이지</span>
  </button>
</template>