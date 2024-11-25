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
    class="flex items-center justify-center w-full min-h-screen px-4 py-12 bg-gradient-to-r from-blue-100 to-blue-50 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-2xl">
      <div>
        <h1 class="mb-2 text-3xl font-bold text-center text-gray-900">
          FinPoint
        </h1>
        <h2 class="text-xl font-semibold text-center text-gray-600">로그인</h2>
      </div>

      <form @submit="handleSubmit" class="mt-8 space-y-6">
        <div class="space-y-4 rounded-md shadow-sm">
          <div>
            <label for="username" class="sr-only">아이디</label>
            <input
              id="username"
              type="text"
              placeholder="아이디"
              class="relative block w-full px-4 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              v-model="username"
              required
              autocomplete="username"
            />
          </div>
          <div>
            <label for="password" class="sr-only">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호"
              class="relative block w-full px-4 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              v-model="password"
              required
              autocomplete="current-password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white transition duration-150 ease-in-out bg-blue-600 border border-transparent rounded-lg group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            로그인
          </button>
        </div>

        <p
          v-if="error"
          class="p-2 text-sm text-center text-red-600 bg-red-100 rounded"
        >
          {{ error }}
        </p>

        <div class="flex items-center justify-center">
          <div class="text-sm">
            <RouterLink
              to="/signup"
              class="font-medium text-blue-600 transition-colors hover:text-blue-500"
            >
              아직 계정이 없으신가요? 회원가입
            </RouterLink>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
