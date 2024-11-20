<script setup>
import { ref, defineProps, defineEmits } from 'vue';

import { boardService } from '@/services/boardService';

const { like, unlike } = boardService();

const props = defineProps({
  boardId: {
    type: Number,
    required: true,
  },
  initialLiked: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:initialLiked']);
const isLoading = ref(false);

const toggleLike = async () => {
  try {
    isLoading.value = true;
    let response;

    if (props.initialLiked) {
      response = await unlike(props.boardId);
    } else {
      response = await like(props.boardId);
    }

    // API 응답에서 새로운 상태를 받아와서 업데이트
    if (response && 'is_liked' in response) {
      emit('update:initialLiked', response.is_liked);
      // like_count도 업데이트
      if ('like_count' in response) {
        emit('update:likeCount', response.like_count);
      }
    }
  } catch (error) {
    console.error('좋아요 처리 실패:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <button
    @click="toggleLike"
    :disabled="isLoading"
    class="flex items-center space-x-2 transition-all duration-300"
  >
    <svg
      v-if="initialLiked"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="red"
      viewBox="0 0 24 24"
      class="transition-all duration-300"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="gray"
      viewBox="0 0 24 24"
      class="transition-all duration-300"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
    <span
      :class="[
        initialLiked ? 'text-red-500' : 'text-gray-500',
        isLoading ? 'opacity-50' : '',
      ]"
    >
      {{ initialLiked ? '좋아요 취소' : '좋아요' }}
    </span>
  </button>
</template>
