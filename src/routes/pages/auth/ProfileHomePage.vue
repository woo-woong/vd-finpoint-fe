<script setup>
import { useUserStore } from '@/stores/userStore';

// 사용자 정보 데이터
const userData = useUserStore().userData;
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-screen bg-gray-100">
    <!-- 헤더 -->
    <header class="w-full py-5 text-center text-white bg-blue-600 shadow-md">
      <h1 class="text-2xl font-bold">내 프로필</h1>
      <p class="text-sm">나의 정보를 확인하고 관리할 수 있습니다.</p>
    </header>

    <!-- 프로필 콘텐츠 -->
    <main
      class="flex flex-col items-center w-full max-w-4xl px-6 py-10 mt-8 bg-white rounded-lg shadow-lg"
    >
      <!-- 프로필 정보 -->
      <div class="w-full mb-8">
        <h2 class="mb-4 text-xl font-semibold">사용자 정보</h2>

        <!-- 기본 정보 -->
        <div class="p-4 mb-4 rounded-lg bg-gray-50">
          <h3 class="mb-2 font-semibold text-blue-600 text-md">기본 정보</h3>
          <p class="py-1 text-sm text-gray-700">
            아이디: <span class="font-semibold">{{ userData.username }}</span>
          </p>
          <p class="py-1 text-sm text-gray-700">
            이름: <span class="font-semibold">{{ userData.name }}</span>
          </p>
          <p class="py-1 text-sm text-gray-700">
            이메일: <span class="font-semibold">{{ userData.email }}</span>
          </p>
        </div>

        <!-- 추가 정보 -->
        <div class="p-4 rounded-lg bg-gray-50">
          <h3 class="mb-2 font-semibold text-blue-600 text-md">추가 정보</h3>
          <p class="py-1 text-sm text-gray-700">
            생년월일:
            <span class="font-semibold">{{ userData.birth_date }}</span>
          </p>
          <p class="py-1 text-sm text-gray-700">
            전화번호: <span class="font-semibold">{{ userData.phone }}</span>
          </p>
          <p class="py-1 text-sm text-gray-700">
            주소: <span class="font-semibold">{{ userData.address }}</span>
          </p>
          <p class="py-1 text-sm text-gray-700">
            상세주소:
            <span class="font-semibold">{{ userData.detail_address }}</span>
          </p>
        </div>
      </div>

      <!-- 수정 버튼 -->
      <div class="flex justify-end w-full">
        <router-link to="/profile/edit">
          <button
            type="button"
            class="px-6 py-2 text-sm font-semibold text-white transition duration-200 bg-green-500 rounded-lg shadow hover:bg-green-600"
          >
            프로필 수정
          </button>
        </router-link>
      </div>
    </main>
  </div>
</template>
