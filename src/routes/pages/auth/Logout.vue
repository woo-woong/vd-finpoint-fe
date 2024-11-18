<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useAuth from '@hooks/auth/useAuth';

const router = useRouter();
const { handleLogout } = useAuth();

onMounted(async () => {
  try {
    await handleLogout();
    router.push('/');
  } catch (e) {
    console.error('요청 실패', e);
    router.push('/');
  }
});
</script>

<template>
  <!-- 이 컴포넌트는 아무것도 렌더링하지 않음 -->
</template>
