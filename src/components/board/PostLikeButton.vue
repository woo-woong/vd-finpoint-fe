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

const emit = defineEmits(['update:initialLiked', 'update:likeCount']);
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
    class="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 border rounded-lg"
    :class="[
      initialLiked
        ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
    ]"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      :fill="initialLiked ? 'currentColor' : 'none'"
      :stroke="initialLiked ? 'none' : 'currentColor'"
      viewBox="0 0 24 24"
      class="transition-all duration-300"
    >
      <path
        d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
      />
    </svg>
    <span class="font-medium">
      {{ initialLiked ? '도움이 됐어요' : '도움이 됐나요?' }}
    </span>
  </button>
</template>
