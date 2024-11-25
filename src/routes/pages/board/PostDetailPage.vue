<script setup>
import { useRouter, useRoute } from 'vue-router';
import { boardService } from '@/services/boardService';
import { ref, onMounted } from 'vue';
import { useDate } from '@/hooks/common/useDate';
import Loading from '@/components/common/Loading.vue';
import PostLikeButton from '@/components/board/PostLikeButton.vue';
import FinanceRecommendCard from '@/components/finance/FinanceRecommendCard.vue';

const router = useRouter();
const route = useRoute();
const postData = ref(null);
const productData = ref(null);

const boardId = route.params.id;
const { read, remove } = boardService();

let formattedDate;

const fetchBoardData = async () => {
  try {
    const data = await read(boardId);
    postData.value = data.board;
    productData.value = data.product;
    formattedDate = useDate(postData.value.created_at);
  } catch (error) {
    console.error('게시글 조회 실패:', error);
  }
};

const handleDelete = async () => {
  try {
    await remove(route.params.id);
    router.push('/board');
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
  }
};

onMounted(() => {
  fetchBoardData();
});
function goBack() {
  router.push('/board'); // 게시판 홈으로 돌아가기
}

function goEdit() {
  router.push(`/board/${boardId}/edit`); // 해당 게시물 수정 페이지로 이동
}
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-screen bg-gray-100">
    <!-- 헤더 -->
    <header class="w-full py-5 text-center text-white bg-blue-600 shadow-md">
      <h1 class="text-2xl font-bold">게시물 상세 보기</h1>
    </header>

    <!-- 상세 내용 -->
    <main
      class="flex flex-col w-full max-w-6xl px-6 py-10 mt-10 bg-white rounded-lg shadow-lg min-h-[70vh]"
    >
      <!-- 제목 -->
      <div class="mb-8" v-if="postData">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-2xl font-bold">{{ postData.title }}</h2>
          <span class="text-lg text-blue-600"
            >좋아요 {{ postData.like_count }}개</span
          >
        </div>
        <div class="flex items-center justify-between">
          <p class="mt-2 text-base text-gray-500">
            작성자: {{ postData.name }} | 작성일: {{ formattedDate }}
          </p>
          <PostLikeButton
            :boardId="Number(boardId)"
            :initialLiked="postData.is_liked"
            @update:initialLiked="(newValue) => (postData.is_liked = newValue)"
            @update:likeCount="(newValue) => (postData.like_count = newValue)"
          />
        </div>
      </div>

      <!-- 로딩 중 -->
      <div v-else>
        <Loading />
      </div>

      <FinanceRecommendCard
        v-if="postData && productData"
        :type="postData.type"
        :product="productData"
      />

      <!-- 내용 -->
      <div class="mb-8" v-if="postData">
        <p class="text-gray-700">
          {{ postData.content }}
        </p>
      </div>

      <!-- 버튼 그룹 -->
      <div class="flex justify-end gap-2 mt-auto" v-if="postData">
        <button
          type="button"
          class="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg shadow hover:bg-green-600"
          @click="goEdit"
        >
          수정
        </button>
        <button
          type="button"
          class="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg shadow hover:bg-red-600"
          @click="handleDelete"
        >
          삭제
        </button>
        <button
          type="button"
          class="px-4 py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-lg shadow hover:bg-gray-100"
          @click="goBack"
        >
          목록으로
        </button>
      </div>
    </main>
  </div>
</template>
