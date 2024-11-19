<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import kakaoLogo from '@assets/images/kakao-login.png';
import useAuth from '@/hooks/auth/useAuth';

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URL = import.meta.env.VITE_KAKAO_REDIRECT_URL;
const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code`;

const username = ref('');
const password = ref('');
const { handleLogin } = useAuth();

const handleSocialLoginClick = () => {
  window.location.href = KAKAO_AUTH_URI;
};

const handleSubmit = (e) => {
  e.preventDefault();
  handleLogin(username.value, password.value);
};
</script>

<template>
  <div class="flex flex-col items-center p-20 rounded-md shadow-md">
    <h1 class="text-xl font-bold mb-7">로그인</h1>
    <form @submit="handleSubmit" class="flex flex-col items-center">
      <div class="flex flex-col w-full gap-2 mb-5">
        <input
          type="text"
          placeholder="아이디"
          class="p-2 border border-gray-40"
          v-model="username"
        />
        <input
          type="password"
          placeholder="비밀번호"
          class="p-2 border border-gray-40"
          v-model="password"
        />
      </div>
      <button
        type="submit"
        class="w-full p-3 font-semibold transition-colors bg-blue-200 border rounded-sm cursor-pointer hover:bg-blue-400"
      >
        로그인
      </button>
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      <nav>
        <ul class="flex gap-2 p-4">
          <li>아이디 찾기</li>
          |
          <li>비밀번호 찾기</li>
          |
          <RouterLink to="/signup">
            <li>회원가입</li>
          </RouterLink>
        </ul>
      </nav>
      <hr class="w-full my-3 border-t border-gray-300" />
      <div class="flex flex-col items-center gap-2 mt-3">
        <h1 class="text-lg font-bold">SNS 로그인</h1>
        <button
          type="button"
          class="flex flex-col items-center gap-2 mt-3 transition-all duration-300 transform hover:scale-102 hover:shadow-lg active:scale-98"
          @click="handleSocialLoginClick"
        >
          <img
            :src="kakaoLogo"
            alt="카카오 로그인"
            class="w-12 transition-transform duration-300 cursor-pointer hover:scale-110"
          />
        </button>
        <p class="text-sm font-medium">카카오톡</p>
      </div>
    </form>
  </div>
</template>
