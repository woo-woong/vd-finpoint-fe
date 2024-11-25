<script setup>
import { ref, defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { boardService } from '@/services/boardService';
import PostList from '@/components/board/PostList.vue';
import Loading from '@/components/common/Loading.vue';

defineComponent({
  name: 'BoardHome',
});

const { list } = boardService();

const router = useRouter();

const Posts = ref([]);
const loading = ref(true); // 로딩 상태를 관리할 변수 추가
const sortBy = ref('latest'); // 정렬 기준 상태 추가

const fetchPosts = async () => {
  try {
    const response = await list();
    Posts.value = response;
    sortPosts(); // 정렬 함수 호출
    loading.value = false; // 데이터 로드 완료 후 로딩 상태 false로 변경
  } catch (error) {
    console.error('게시물 목록 조회 실패:', error);
    loading.value = false; // 오류 발생 시 로딩 상태 false로 변경
  }
};

// 정렬 함수 추가
const sortPosts = () => {
  if (sortBy.value === 'likes') {
    Posts.value.sort((a, b) => b.like_count - a.like_count);
  } else {
    // 최신순 정렬 (기본값)
    Posts.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};

// 정렬 방식 변경 함수
const changeSortBy = (type) => {
  sortBy.value = type;
  sortPosts();
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
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
      :transition="{ duration: 100 }"
      class="flex flex-col items-center w-full max-w-6xl px-4 py-10 mt-10 bg-white rounded-lg shadow-lg"
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

      <!-- 정렬 탭 추가 -->
      <div class="flex justify-start w-full gap-4 mb-4">
        <button
          @click="changeSortBy('latest')"
          :class="[
            'px-3 py-1 rounded-lg',
            sortBy === 'latest'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          최신순
        </button>
        <button
          @click="changeSortBy('likes')"
          :class="[
            'px-3 py-2 rounded-lg',
            sortBy === 'likes'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          추천순
        </button>
      </div>

      <!-- 게시글 테이블 -->
      <div class="w-full overflow-x-auto" v-if="!loading">
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
            <PostList
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
      <!-- 로딩 중일 때 -->
      <Loading v-else message="게시글 목록을 불러오는 중입니다..." />
      <!-- Posts가 없으면 Loading 컴포넌트 출력 -->
    </main>
  </div>
</template>
