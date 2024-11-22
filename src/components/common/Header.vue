<script setup>
import { RouterLink } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { onMounted } from 'vue';

const userStore = useUserStore();

// 컴포넌트 마운트 시 localStorage에서 사용자 데이터 복구
onMounted(() => {
  userStore.initializeStore();
});
</script>

<template>
  <header class="w-full text-lg font-semibold bg-white shadow-md">
    <nav class="max-w-screen-xl px-6 py-4 mx-auto">
      <ul class="flex w-full">
        <!-- 왼쪽 정렬 -->
        <li class="flex justify-start w-1/3">
          <RouterLink
            to="/"
            class="transition-colors cursor-pointer hover:text-blue-500"
          >
            FinPoint
          </RouterLink>
        </li>

        <!-- 중앙 정렬 -->
        <li class="flex justify-center w-1/3 space-x-8">
          <RouterLink
            to="/deposit"
            class="transition-colors cursor-pointer hover:text-blue-500"
          >
            정기예금
          </RouterLink>
          <RouterLink
            to="/savings"
            class="transition-colors cursor-pointer hover:text-blue-500"
          >
            적금
          </RouterLink>
          <RouterLink
            to="/board"
            class="transition-colors cursor-pointer hover:text-blue-500"
          >
            게시판
          </RouterLink>
        </li>

        <!-- 오른쪽 정렬 -->
        <li class="flex justify-end w-1/3 gap-3">
          <template v-if="!userStore.isLoggedIn">
            <RouterLink
              to="/signup"
              class="transition-colors cursor-pointer hover:text-blue-500"
            >
              회원가입
            </RouterLink>
            <RouterLink
              to="/login"
              class="transition-colors cursor-pointer hover:text-blue-500"
            >
              로그인
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink
              to="/profile"
              class="transition-colors cursor-pointer hover:text-blue-500"
            >
              프로필
            </RouterLink>
            <RouterLink
              to="/logout"
              class="transition-colors cursor-pointer hover:text-blue-500"
            >
              로그아웃
            </RouterLink>
          </template>
        </li>
      </ul>
    </nav>
  </header>
</template>
