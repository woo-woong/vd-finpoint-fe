<script setup>
import { ref, defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { boardService } from '@/services/boardService';
import PostListItem from './PostListPage.vue';
import Loading from '@/components/common/Loading.vue';

defineComponent({
  name: 'BoardHome',
});

const { list } = boardService();

const router = useRouter();

const Posts = ref([]);
const loading = ref(true); // 로딩 상태를 관리할 변수 추가

const fetchPosts = async () => {
  try {
    const response = await list();
    Posts.value = response;
    loading.value = false; // 데이터 로드 완료 후 로딩 상태 false로 변경
  } catch (error) {
    console.error('게시물 목록 조회 실패:', error);
    loading.value = false; // 오류 발생 시 로딩 상태 false로 변경
  }
};

onMounted(() => {
  fetchPosts();
});

const goToNewPost = () => {
  router.push('/board/new'); // 글쓰기 페이지로 이동
};
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-screen bg-gray-100">
    <!-- 헤더 -->
    <header class="w-full py-5 text-center text-white bg-blue-600 shadow-md">
      <h1 class="text-2xl font-bold">게시판</h1>
      <p class="text-sm">당신의 의견을 자유롭게 공유하세요!</p>
    </header>

    <!-- 메인 콘텐츠 -->
    <main
      class="flex flex-col items-center w-full max-w-4xl px-4 py-10 mt-10 bg-white rounded-lg shadow-lg"
      v-if="!loading"
    >
      <!-- 게시판 헤더 -->
      <div class="flex justify-between w-full mb-5">
        <h2 class="text-xl font-semibold">게시글 목록</h2>
        <button
          type="button"
          @click="goToNewPost"
          class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
        >
          새 글 작성
        </button>
      </div>

      <!-- 게시글 테이블 -->
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left border-collapse border-spacing-0">
          <thead class="bg-gray-200">
            <tr>
              <th
                class="w-[8%] p-4 text-sm font-semibold text-gray-700 border-b"
              >
                추천
              </th>
              <th
                class="w-[8%] p-4 text-sm font-semibold text-gray-700 border-b"
              >
                번호
              </th>
              <th
                class="w-[50%] p-4 text-sm font-semibold text-gray-700 border-b"
              >
                제목
              </th>
              <th
                class="w-[15%] p-4 text-sm font-semibold text-gray-700 border-b"
              >
                작성자
              </th>
              <th
                class="w-[27%] p-4 text-sm font-semibold text-gray-700 border-b"
              >
                작성일
              </th>
            </tr>
          </thead>
          <tbody>
            <PostListItem
              v-for="post in Posts"
              :key="post.id"
              :id="post.id"
              :title="post.title"
              :author="post.user.name"
              :created_at="post.created_at"
              :likeCount="post.like_count"
            />
          </tbody>
        </table>
      </div>
    </main>

    <!-- 로딩 중일 때 -->
    <Loading v-else />
    <!-- Posts가 없으면 Loading 컴포넌트 출력 -->
  </div>
</template>
