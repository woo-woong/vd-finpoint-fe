<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { authService } from '@/services/authService';
const router = useRouter();

const username = ref('');
const password = ref('');
const { login, error } = authService;

const handleSubmit = async (e) => {
  e.preventDefault();

  await login(username.value, password.value);
  router.push('/');
};
</script>

<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 10 }"
    :enter="{ opacity: 1, y: 0 }"
    class="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-2xl space-y-8">
      <div>
        <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">
          FinPoint
        </h1>
        <h2 class="text-xl font-semibold text-center text-gray-600">로그인</h2>
      </div>

      <form @submit="handleSubmit" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="username" class="sr-only">아이디</label>
            <input
              id="username"
              type="text"
              placeholder="아이디"
              class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              v-model="username"
              required
            />
          </div>
          <div>
            <label for="password" class="sr-only">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호"
              class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              v-model="password"
              required
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            로그인
          </button>
        </div>

        <p
          v-if="error"
          class="text-sm text-center text-red-600 bg-red-100 p-2 rounded"
        >
          {{ error }}
        </p>

        <div class="flex items-center justify-center">
          <div class="text-sm">
            <RouterLink
              to="/signup"
              class="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              아직 계정이 없으신가요? 회원가입
            </RouterLink>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
