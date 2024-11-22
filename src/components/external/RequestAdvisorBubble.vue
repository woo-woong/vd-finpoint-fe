<script setup>
import { aiService } from '@/services/aiService';

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
});

const { fetchRecommendProduct } = aiService;

const handlefetchRecommendProduct = async () => {
  try {
    const data = await fetchRecommendProduct(props.service);
    console.log('추천 데이터:', data);
  } catch (error) {
    console.error('추천 요청 실패:', error);
  }
};
</script>
<template>
  <div
    @click="handlefetchRecommendProduct"
    class="relative flex items-center justify-center w-full h-full px-4 py-2 text-xl font-semibold text-blue-600 bg-white border border-gray-200 rounded-2xl"
  >
    {{ message }}
    <div
      class="absolute right-4 bottom-[-8px] w-4 h-4 bg-white border-b border-r border-gray-200 transform rotate-45"
    ></div>
  </div>
</template>
