<template>
  <TabHeader
    title="주변 은행 찾기"
    subtitle="근처 은행을 확인할 수 있습니다."
  />
  <div class="w-full mt-4 bg-white rounded-lg shadow-md p-4">
    <div class="h-[500px]">
      <KakaoMap
        class="w-full h-full"
        v-model:banks="banks"
        ref="kakaoMapRef"
        @bank-selected="handleBankSelected"
      />
    </div>
    <div v-if="banks.length" class="mt-4 mb-8">
      <h2 class="mb-4 text-2xl font-semibold text-gray-800">근처 은행 목록</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- 사용자 위치 추가 -->
        <div
          v-if="userLocation"
          :class="[
            'p-4 border border-blue-300 shadow-md cursor-pointer rounded-xl',
            userLocation && !isHovered ? 'bg-blue-50' : 'bg-blue-100',
            'hover:bg-blue-100',
          ]"
          @click="navigateToBank(userLocation)"
          @mouseover="isHovered = true"
          @mouseleave="isHovered = false"
        >
          <h3 class="text-lg font-semibold text-blue-700">내 위치</h3>
          <p class="text-gray-600">현재 위치에서 가까운 은행들</p>
        </div>

        <!-- 은행 목록 -->
        <div
          v-for="bank in banks"
          :key="bank.id"
          class="p-4 bg-white border border-gray-200 shadow-md cursor-pointer rounded-xl hover:bg-gray-100"
          :class="{ 'bg-blue-50': selectedBank?.id === bank.id }"
          @click="navigateToBank(bank)"
        >
          <h3 class="text-lg font-semibold text-gray-800">
            {{ bank.place_name }}
          </h3>
          <p class="text-gray-600">거리: {{ bank.distance }}m</p>
          <p class="text-sm text-gray-500">{{ bank.address_name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import KakaoMap from '@/components/external/KakaoMap.vue';
import TabHeader from '@/components/common/TabHeader.vue';

const banks = ref([]);
const userLocation = ref(null);
const selectedBank = ref(null);
const kakaoMapRef = ref(null);
const isHovered = ref(false);

// 은행 선택 시 지도 이동
const navigateToBank = (bank) => {
  kakaoMapRef.value?.navigateToBank(bank);
  selectedBank.value = bank;
};

// 은행 선택 핸들러
const handleBankSelected = (bank) => {
  selectedBank.value = bank;
};

// 사용자 위치 가져오는 함수
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(error)
      );
    } else {
      reject(new Error('Geolocation is not supported'));
    }
  });
};

onMounted(async () => {
  try {
    const coords = await getUserLocation();
    userLocation.value = {
      id: 'user-location', // 고유 ID 추가
      place_name: '내 위치',
      distance: 0, // 현재 위치는 0m
      address_name: '현재 위치',
      y: coords.latitude,
      x: coords.longitude,
    };

    // 사용자 위치를 은행 목록에 추가
    banks.value.unshift(userLocation.value);

    // 카카오 맵 컴포넌트에서 사용자 위치로 지도 중심 설정
    kakaoMapRef.value?.navigateToBank(userLocation.value);
  } catch (error) {
    console.error('위치 정보를 가져올 수 없습니다:', error);
  }
});
</script>

<style scoped>
/* 카드를 더욱 깔끔하게 디자인 */
.p-4 {
  padding: 16px;
}

.bg-green-50 {
  background-color: #d1fadf;
}

.bg-blue-50 {
  background-color: #ebf8ff;
}

.bg-white {
  background-color: white;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:bg-green-100:hover {
  background-color: #c8f7b5;
}

.hover\:bg-gray-100:hover {
  background-color: #f7fafc;
}

.grid-cols-1 {
  grid-template-columns: 1fr;
}

.md\:grid-cols-2 {
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.gap-4 {
  gap: 16px;
}
</style>
