<script setup>
import { onMounted } from 'vue';
import ky from 'ky';
import { useRouter } from 'vue-router';

const FINANCIAL_API_URL = import.meta.env.VITE_FINANCIAL_API_URL;
const router = useRouter();

onMounted(async () => {
  try {
    await ky.get(`${FINANCIAL_API_URL}logout`, {
      credentials: 'include',
    });
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
