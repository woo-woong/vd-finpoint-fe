<script setup>
import { RouterLink } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { onMounted, ref } from 'vue';
import { Vue3Lottie } from 'vue3-lottie';
import depositAnimation from '@/assets/images/deposit.json';
import savingsAnimation from '@/assets/images/savings.json';
import boardAnimation from '@/assets/images/board.json';
const userStore = useUserStore();

// 컴포넌트 마운트 시 localStorage에서 사용자 데이터 복구
onMounted(() => {
  userStore.initializeStore();
});

// 모바일 메뉴 상태 관리 추가
const isMobileMenuOpen = ref(false);
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-white shadow-md">
    <nav class="max-w-screen-xl px-4 mx-auto sm:px-6">
      <div class="flex items-center justify-between h-16">
        <!-- 로고 -->
        <RouterLink
          to="/"
          class="text-xl font-bold transition-colors hover:text-blue-500"
        >
          FinPoint
        </RouterLink>

        <!-- 메인 네비게이션 -->
        <div class="flex-1 hidden mx-4 md:flex md:items-center">
          <div
            v-for="(item, index) in [
              {
                name: '정기예금',
                route: '/deposit',
                animation: depositAnimation,
                ref: 'depositLottie',
              },
              {
                name: '적금',
                route: '/savings',
                animation: savingsAnimation,
                ref: 'savingsLottie',
              },
              {
                name: '게시판',
                route: '/board',
                animation: boardAnimation,
                ref: 'boardLottie',
              },
            ]"
            :key="index"
            class="flex items-center px-3 py-2 transition-all rounded-lg group hover:bg-blue-50"
          >
            <Vue3Lottie
              :animationData="item.animation"
              :height="32"
              :width="32"
              :loop="true"
              :autoplay="false"
              @mouseenter="$refs[item.ref]?.play()"
              @mouseleave="$refs[item.ref]?.stop()"
              :ref="item.ref"
              class="mr-2"
            />
            <RouterLink
              :to="item.route"
              class="font-medium transition-colors hover:text-blue-500"
              @mouseenter="$refs[item.ref]?.play()"
            >
              {{ item.name }}
            </RouterLink>
          </div>
        </div>

        <!-- 사용자 메뉴 -->
        <div class="hidden md:flex md:items-center md:space-x-4">
          <template v-if="!userStore.isLoggedIn">
            <RouterLink
              v-for="(item, index) in [
                { name: '회원가입', route: '/signup' },
                { name: '로그인', route: '/login' },
              ]"
              :key="index"
              :to="item.route"
              class="px-4 py-2 font-medium transition-all rounded-lg hover:bg-blue-50 hover:text-blue-500"
            >
              {{ item.name }}
            </RouterLink>
          </template>
          <template v-else>
            <div class="flex items-center space-x-4">
              <div class="px-4 py-2 rounded-lg bg-blue-50">
                <span class="font-medium text-blue-700"
                  >{{ userStore.userData.name }} 고객님</span
                >
              </div>
              <RouterLink
                to="/profile"
                class="flex items-center px-4 py-2 text-gray-600 transition-all rounded-lg hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                마이페이지
              </RouterLink>
              <RouterLink
                to="/logout"
                class="flex items-center px-4 py-2 text-red-600 transition-all rounded-lg hover:bg-red-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clip-rule="evenodd"
                  />
                </svg>
                로그아웃
              </RouterLink>
            </div>
          </template>
        </div>

        <!-- 모바일 메뉴 버튼 -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="p-2 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      <!-- 모바일 메뉴 -->
      <div
        v-show="isMobileMenuOpen"
        class="absolute left-0 w-full transition-all duration-300 bg-white border-b border-gray-200 shadow-md top-16 md:hidden"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <!-- 네비게이션 메뉴 -->
          <RouterLink
            v-for="(item, index) in [
              {
                name: '정기예금',
                route: '/deposit',
                animation: depositAnimation,
                ref: 'mobileDepositLottie',
              },
              {
                name: '적금',
                route: '/savings',
                animation: savingsAnimation,
                ref: 'mobileSavingsLottie',
              },
              {
                name: '게시판',
                route: '/board',
                animation: boardAnimation,
                ref: 'mobileBoardLottie',
              },
            ]"
            :key="index"
            :to="item.route"
            class="flex justify-center px-3 py-2 rounded-md hover:bg-blue-50"
            @click="isMobileMenuOpen = false"
          >
            <div class="inline-flex items-center">
              <Vue3Lottie
                :animationData="item.animation"
                :height="24"
                :width="24"
                :loop="true"
                :autoplay="false"
                :ref="item.ref"
                class="mr-2"
              />
              <div class="block font-medium text-gray-700 hover:text-blue-500">
                {{ item.name }}
              </div>
            </div>
          </RouterLink>

          <!-- 사용자 메뉴 -->
          <div class="pt-4 mt-4 border-t border-gray-200">
            <template v-if="!userStore.isLoggedIn">
              <RouterLink
                v-for="(item, index) in [
                  { name: '회원가입', route: '/signup' },
                  { name: '로그인', route: '/login' },
                ]"
                :key="index"
                :to="item.route"
                class="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-500 hover:bg-blue-50"
                @click="isMobileMenuOpen = false"
              >
                {{ item.name }}
              </RouterLink>
            </template>
            <template v-else>
              <div class="px-3 py-2">
                <span class="font-medium text-blue-700"
                  >{{ userStore.userData.name }} 고객님</span
                >
              </div>
              <RouterLink
                to="/profile"
                class="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
                @click="isMobileMenuOpen = false"
              >
                마이페이지
              </RouterLink>
              <RouterLink
                to="/logout"
                class="block px-3 py-2 text-base font-medium text-red-600 rounded-md hover:bg-red-50"
                @click="isMobileMenuOpen = false"
              >
                로그아웃
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
