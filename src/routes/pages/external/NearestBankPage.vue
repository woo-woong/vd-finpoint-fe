<template>
  <div class="w-full h-[500px]">
    <KakaoMap
      v-model:banks="banks"
      ref="kakaoMapRef"
      @bank-selected="handleBankSelected"
    />
    <!-- 은행 목록 섹션 -->
    <div v-if="banks.length" class="mt-4">
      <h2 class="mb-2 text-xl font-bold">근처 은행 목록</h2>
      <ul>
        <li
          v-for="bank in banks"
          :key="bank.id"
          class="p-2 mb-2 border rounded cursor-pointer hover:bg-gray-100"
          @click="navigateToBank(bank)"
        >
          {{ bank.place_name }} - 거리: {{ bank.distance }}m
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import KakaoMap from '@/components/external/KakaoMap.vue';

const banks = ref([]);
const kakaoMapRef = ref(null);

const navigateToBank = (bank) => {
  kakaoMapRef.value?.navigateToBank(bank);
};

const handleBankSelected = (bank) => {
  // 은행이 선택되었을 때의 처리
};
</script>

<style scoped>
.marker-image {
  width: 24px;
  height: 35px;
}
</style>
