<template>
  <div class="flex flex-col items-center w-full min-h-screen bg-gray-100">
    <!-- 헤더 -->
    <header class="w-full py-5 text-center text-white bg-blue-600 shadow-md">
      <h1 class="text-2xl font-bold">새 글 작성</h1>
    </header>

    <!-- 메인 콘텐츠 -->
    <main
      class="flex flex-col w-full max-w-2xl px-6 py-8 mt-10 bg-white rounded-lg shadow-lg"
    >
      <!-- 제목 입력 -->
      <div class="mb-6">
        <label
          for="title"
          class="block mb-2 text-sm font-semibold text-gray-700"
        >
          제목
        </label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="제목을 입력하세요"
        />
      </div>

      <!-- 내용 입력 -->
      <div class="mb-6">
        <label
          for="content"
          class="block mb-2 text-sm font-semibold text-gray-700"
        >
          내용
        </label>
        <textarea
          id="content"
          v-model="formData.content"
          rows="8"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="내용을 입력하세요"
        ></textarea>
      </div>

      <!-- 제출 버튼 -->
      <div class="flex justify-end">
        <button
          type="button"
          @click="handleSubmit"
          class="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
        >
          등록
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 폼 데이터
const formData = ref({
  title: '',
  content: '',
});

// 폼 제출 처리
const handleSubmit = () => {
  if (!formData.value.title || !formData.value.content) {
    alert('제목과 내용을 모두 입력해주세요.');
    return;
  }

  // 예시: 데이터를 서버에 전송하는 로직
  console.log('폼 데이터:', formData.value);

  // 게시판 목록 페이지로 이동
  router.push('/board');
};
</script>
