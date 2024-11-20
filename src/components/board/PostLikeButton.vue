<script setup>
import { ref, defineProps } from 'vue';
import BoardService from '@/services/boardService';

const { like, unlike } = BoardService();

const props = defineProps({
  boardId: {
    type: Number,
    required: true,
  },
});

const liked = ref(false); // 좋아요 상태 (기본값은 false)

const toggleLike = async () => {
  try {
    if (liked.value) {
      await unlike(props.boardId); // 좋아요 취소
    } else {
      await like(props.boardId); // 좋아요
    }
    liked.value = !liked.value; // 상태 토글
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div>
    <!-- 좋아요 버튼 클릭 시 toggleLike 호출 -->
    <button @click="toggleLike" class="flex items-center space-x-2">
      <!-- 좋아요 아이콘: 상태에 따라 색상 변경 -->
      <svg
        v-if="liked"
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
      <span :class="liked ? 'text-red-500' : 'text-gray-500'">
        {{ liked ? '좋아요 취소' : '좋아요' }}
      </span>
    </button>
  </div>
</template>

<style scoped>
/* 추가적인 스타일을 여기에 작성할 수 있습니다 */
</style>
