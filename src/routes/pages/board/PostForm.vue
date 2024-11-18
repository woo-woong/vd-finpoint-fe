<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps({
  mode: {
    type: String,
    validator: (value) => ['create', 'edit'].includes(value),
    required: true,
  },
});

const router = useRouter();
const route = useRoute();

const pageTitle = computed(() => {
  return props.mode === 'create' ? '새 글 작성' : '게시물 수정';
});

const submitButtonText = computed(() => {
  return props.mode === 'create' ? '등록' : '수정 완료';
});

const formData = ref({
  title: '',
  content: '',
});

const handleSubmit = () => {
  if (!formData.value.title || !formData.value.content) {
    alert('제목과 내용을 모두 입력해주세요.');
    return;
  }

  if (props.mode === 'create') {
    // 생성 API 호출
    console.log('새 글 작성:', formData.value);
  } else {
    // 수정 API 호출
    console.log('글 수정:', formData.value);
  }

  router.push('/board');
};

const goBack = () => {
  router.push(props.mode === 'create' ? '/board' : `/board/${route.params.id}`);
};
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-screen bg-gray-100">
    <header class="w-full py-5 text-center text-white bg-blue-600 shadow-md">
      <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
    </header>

    <main
      class="flex flex-col w-full max-w-2xl px-6 py-8 mt-10 bg-white rounded-lg shadow-lg"
    >
      <!-- 폼 내용은 기존 PostWrite/PostEdit과 동일 -->
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
          placeholder="내용을 입력하세요"
        ></textarea>
      </div>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="handleSubmit"
          class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
        >
          {{ submitButtonText }}
        </button>
        <button
          type="button"
          @click="goBack"
          class="px-4 py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-lg shadow hover:bg-gray-100"
        >
          취소
        </button>
      </div>
    </main>
  </div>
</template>
