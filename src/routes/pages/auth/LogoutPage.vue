<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/authService';

const router = useRouter();
const { logout } = authService;

onMounted(async () => {
  try {
    await logout();
    router.push('/');
  } catch (e) {
    console.error('요청 실패', e);
    router.push('/');
  }
});
</script>

<template>
  <div class="min-h-screen">
    <!-- 로딩 중 화면이 깜빡이는 것을 방지하기 위한 최소 높이 설정 -->
  </div>
</template>
