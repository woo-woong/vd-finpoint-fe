<template>
  <div class="flex flex-col items-center w-full min-h-screen bg-gray-100">
    <!-- 헤더 -->
    <header class="w-full py-5 text-center text-white bg-blue-600 shadow-md">
      <h1 class="text-2xl font-bold">프로필 수정</h1>
      <p class="text-sm">내 정보를 수정할 수 있습니다.</p>
    </header>

    <!-- 수정 폼 -->
    <main
      class="flex flex-col items-center w-full max-w-4xl px-6 py-10 mt-8 bg-white rounded-lg shadow-lg"
    >
      <div class="w-full mb-8">
        <h2 class="text-xl font-semibold">사용자 정보 수정</h2>

        <!-- 이메일 수정 -->
        <div class="mt-4">
          <label for="email" class="block text-sm text-gray-700">이메일</label>
          <input
            id="email"
            type="email"
            v-model="email"
            class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
            placeholder="이메일을 입력하세요"
          />
        </div>

        <!-- 비밀번호 수정 -->
        <div class="mt-4">
          <label for="password" class="block text-sm text-gray-700"
            >비밀번호</label
          >
          <input
            id="password"
            type="password"
            v-model="password"
            class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <!-- 생년월일 수정 -->
        <div class="mt-4">
          <label for="birthdate" class="block text-sm text-gray-700"
            >생년월일</label
          >
          <input
            id="birthdate"
            type="date"
            v-model="birthdate"
            class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
          />
        </div>

        <!-- 수정 버튼 -->
        <div class="flex justify-end w-full mt-6">
          <button
            type="button"
            @click="submitForm"
            class="px-6 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg shadow hover:bg-green-600"
          >
            수정 완료
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 사용자 정보
const email = ref('hong@example.com');
const password = ref('');
const birthdate = ref('2000-01-01');

// 폼 제출 처리 함수
const submitForm = () => {
  // 여기에 수정된 데이터를 서버로 전송하는 로직 추가
  alert('수정 완료!');
};
</script>
