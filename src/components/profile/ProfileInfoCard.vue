<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

const store = useUserStore();

defineProps({
  infoTitle: {
    type: String,
    required: true,
  },
});

const formatCurrency = (value) => {
  if (!value && value !== 0) return '-';
  return `${(Number(value) * 10000).toLocaleString()}원`;
};

const formatPhoneNumber = (phone) => {
  if (!phone) return '-';
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};

const formattedInfo = computed(() => {
  if (!store.userData) return {};

  return {
    birth_date: store.userData.birth_date || '-',
    phone: store.userData.phone ? formatPhoneNumber(store.userData.phone) : '-',
    address: store.userData.address || '-',
    detail_address: store.userData.detail_address || '-',
    annual_salary:
      store.userData.annual_salary !== null &&
      store.userData.annual_salary !== undefined
        ? formatCurrency(store.userData.annual_salary)
        : '-',
    asset:
      store.userData.asset !== null && store.userData.asset !== undefined
        ? formatCurrency(store.userData.asset)
        : '-',
  };
});
</script>

<template>
  <div class="p-6 mb-6 bg-white rounded-lg shadow-md">
    <h2 class="mb-4 text-xl font-semibold">{{ infoTitle }}</h2>
    <div class="space-y-4">
      <div v-if="infoTitle === '기본 정보'">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">이름</p>
            <p class="font-medium">{{ store.userData.name || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">이메일</p>
            <p class="font-medium">{{ store.userData.email || '-' }}</p>
          </div>
        </div>
      </div>
      <div v-if="infoTitle === '추가 정보'">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">생년월일</p>
            <p class="font-medium">{{ formattedInfo.birth_date }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">전화번호</p>
            <p class="font-medium">{{ formattedInfo.phone }}</p>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-sm text-gray-600">주소</p>
          <div class="flex flex-col">
            <p class="font-medium">{{ formattedInfo.address }}</p>
            <p
              v-if="formattedInfo.detail_address !== '-'"
              class="mt-1 text-sm text-gray-700"
            >
              (상세) {{ formattedInfo.detail_address }}
            </p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p class="text-sm text-gray-600">연간 급여</p>
            <p class="font-medium">{{ formattedInfo.annual_salary }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">자산</p>
            <p class="font-medium">{{ formattedInfo.asset }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
