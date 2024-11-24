<script setup>
import { computed } from 'vue';

defineProps({
  infoTitle: {
    type: String,
    required: true,
  },
});

import { useUserStore } from '@/stores/userStore';

// 사용자 정보 데이터
const userData = useUserStore().userData;
const formattedPhone = computed(() => {
  return userData.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
});
</script>

<template>
  <!-- 기본 정보 -->
  <div v-if="infoTitle === '기본 정보'" class="p-4 mb-4 rounded-lg bg-gray-50">
    <h3 class="mb-2 font-semibold text-blue-600 text-md">{{ infoTitle }}</h3>
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
  <div v-if="infoTitle === '추가 정보'" class="p-4 rounded-lg bg-gray-50">
    <h3 class="mb-2 font-semibold text-blue-600 text-md">{{ infoTitle }}</h3>
    <p class="py-1 text-sm text-gray-700">
      생년월일:
      <span class="font-semibold">{{ userData.birth_date }}</span>
    </p>
    <p class="py-1 text-sm text-gray-700">
      전화번호: <span class="font-semibold">{{ formattedPhone }}</span>
    </p>
    <p class="py-1 text-sm text-gray-700">
      주소: <span class="font-semibold">{{ userData.address }}</span>
    </p>
    <p class="py-1 text-sm text-gray-700">
      상세주소:
      <span class="font-semibold">{{ userData.detail_address }}</span>
    </p>
  </div>
</template>
