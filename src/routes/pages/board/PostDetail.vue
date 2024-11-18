<template>
  <div class="flex flex-col items-center w-full min-h-screen bg-gray-100">
    <!-- 헤더 -->
    <header class="w-full py-5 text-center text-white bg-blue-600 shadow-md">
      <h1 class="text-2xl font-bold">게시물 상세 보기</h1>
    </header>

    <!-- 상세 내용 -->
    <main
      class="flex flex-col w-full max-w-2xl px-6 py-10 mt-10 bg-white rounded-lg shadow-lg"
    >
      <!-- 제목 -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold">게시글 제목</h2>
        <p class="mt-2 text-sm text-gray-500">
          작성자: 관리자 | 작성일: 2024-11-18
        </p>
      </div>

      <!-- 내용 -->
      <div class="mb-8">
        <p class="text-gray-700">
          여기 게시글의 상세 내용이 표시됩니다. 원하는 정보를 추가로 작성하면
          됩니다.
        </p>
      </div>

      <!-- 버튼 그룹 -->
      <div class="flex justify-between">
        <button
          type="button"
          class="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg shadow hover:bg-green-600"
        >
          수정
        </button>
        <button
          type="button"
          class="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg shadow hover:bg-red-600"
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

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
  router.push('/board'); // 게시판 홈으로 돌아가기
}
</script>
