<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const formData = ref({
  title: '게시글 제목',
  content:
    '여기 게시글의 상세 내용이 표시됩니다. 원하는 정보를 추가로 작성하면 됩니다.',
});

const handleSubmit = () => {
  if (!formData.value.title || !formData.value.content) {
    alert('제목과 내용을 모두 입력해주세요.');
    return;
  }

  // TODO: API 호출
  console.log('수정된 데이터:', formData.value);
  router.push('/board');
};

const goBack = () => {
  router.push('/board');
};
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-screen bg-gray-100">
    <!-- 헤더 -->
    <header class="w-full py-5 text-center text-white bg-blue-600 shadow-md">
      <h1 class="text-2xl font-bold">게시물 수정</h1>
    </header>

    <!-- 수정 폼 -->
    <main
      class="flex flex-col w-full max-w-2xl px-6 py-10 mt-10 bg-white rounded-lg shadow-lg"
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
        />
      </div>

      <!-- 내용 입력 -->
      <div class="mb-8">
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
        ></textarea>
      </div>

      <!-- 버튼 그룹 -->
      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="handleSubmit"
          class="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg shadow hover:bg-green-600"
        >
          수정 완료
        </button>
        <button
          type="button"
          class="px-4 py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-lg shadow hover:bg-gray-100"
          @click="goBack"
        >
          취소
        </button>
      </div>
    </main>
  </div>
</template>
