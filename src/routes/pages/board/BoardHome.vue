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
              <th class="p-4 text-sm font-semibold text-gray-700 border-b">
                번호
              </th>
              <th class="p-4 text-sm font-semibold text-gray-700 border-b">
                제목
              </th>
              <th class="p-4 text-sm font-semibold text-gray-700 border-b">
                작성자
              </th>
              <th class="p-4 text-sm font-semibold text-gray-700 border-b">
                작성일
              </th>
              <th class="p-4 text-sm font-semibold text-gray-700 border-b">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="hover:bg-gray-100">
              <td class="p-4 border-b">1</td>
              <td class="p-4 border-b">
                <router-link
                  to="/board/1"
                  class="text-blue-600 underline hover:text-blue-800"
                >
                  첫 번째 게시글
                </router-link>
              </td>
              <td class="p-4 border-b">관리자</td>
              <td class="p-4 border-b">2024-11-18</td>
              <td class="p-4 border-b">
                <button
                  type="button"
                  class="px-3 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600"
                >
                  수정
                </button>
                <button
                  type="button"
                  class="px-3 py-1 ml-2 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                >
                  삭제
                </button>
              </td>
            </tr>
            <tr class="hover:bg-gray-100">
              <td class="p-4 border-b">2</td>
              <td class="p-4 border-b">
                <router-link
                  to="/board/2"
                  class="text-blue-600 underline hover:text-blue-800"
                >
                  두 번째 게시글
                </router-link>
              </td>
              <td class="p-4 border-b">사용자</td>
              <td class="p-4 border-b">2024-11-17</td>
              <td class="p-4 border-b">
                <button
                  type="button"
                  class="px-3 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600"
                >
                  수정
                </button>
                <button
                  type="button"
                  class="px-3 py-1 ml-2 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                >
                  삭제
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

defineComponent({
  name: 'BoardHome',
});

const router = useRouter();

const goToNewPost = () => {
  router.push('/board/new'); // 글쓰기 페이지로 이동
};
</script>
