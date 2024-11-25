<script setup>
import { ref, defineComponent, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { boardService } from '@/services/boardService';
import PostList from '@/components/board/PostList.vue';
import Loading from '@/components/common/Loading.vue';
import { useUserStore } from '@/stores/userStore';

defineComponent({
  name: 'BoardHome',
});

const { list } = boardService();

const router = useRouter();

const Posts = ref([]);
const loading = ref(true); // 로딩 상태를 관리할 변수 추가
const sortBy = ref('latest'); // 정렬 기준 상태 추가

const userStore = useUserStore();
const searchQuery = ref('');
const showMyPosts = ref(false);

// 검색과 필터링이 적용된 게시글 목록을 반환하는 computed 속성
const filteredPosts = computed(() => {
  let filtered = [...Posts.value];

  // 검색어로 필터링
  if (searchQuery.value) {
    filtered = filtered.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // 내 글만 보기 필터링
  if (showMyPosts.value) {
    filtered = filtered.filter(
      (post) => post.user.username === userStore.userData.username
    );
  }

  return filtered;
});

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

      <!-- 검색 및 필터 영역 추가 -->
      <div class="flex justify-between w-full mb-6">
        <div class="relative flex items-center w-1/2">
          <span class="absolute left-3 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="게시글 제목을 입력하세요"
            class="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
          />
        </div>

        <label
          class="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <input
            type="checkbox"
            v-model="showMyPosts"
            class="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-200"
          />
          <span class="text-sm font-medium text-blue-700"
            >내가 작성한 글만 보기</span
          >
        </label>
      </div>

      <!-- 정렬 탭 추가 -->
      <div class="flex justify-start w-full gap-4 mb-4">
        <button
          @click="changeSortBy('latest')"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
            sortBy === 'latest'
              ? 'bg-blue-600 text-white shadow hover:bg-blue-700'
              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100',
          ]"
        >
          최신순
        </button>
        <button
          @click="changeSortBy('likes')"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
            sortBy === 'likes'
              ? 'bg-blue-600 text-white shadow hover:bg-blue-700'
              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100',
          ]"
        >
          추천순
        </button>
      </div>

      <!-- 게시글 테이블 -->
      <div class="w-full overflow-x-auto" v-if="!loading">
        <template v-if="filteredPosts.length > 0">
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
                v-for="post in filteredPosts"
                :key="post.id"
                :id="post.id"
                :title="post.title"
                :author="post.user.name"
                :created_at="post.created_at"
                :likeCount="post.like_count"
              />
            </tbody>
          </table>
        </template>
        <div
          v-else
          class="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200"
        >
          <svg
            class="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p class="text-lg font-medium text-gray-600 mb-2">
            해당 검색에 대한 게시글이 없습니다
          </p>
        </div>
      </div>
      <!-- 로딩 중일 때 -->
      <Loading v-else message="게시글 목록을 불러오는 중입니다..." />
      <!-- Posts가 없으면 Loading 컴포넌트 출력 -->
    </main>
  </div>
</template>
