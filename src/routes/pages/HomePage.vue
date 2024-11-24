<template>
  <div class="flex flex-col items-center min-h-screen">
    <!-- 메인 배너 -->
    <section
      class="w-full py-20 mb-10 text-center text-white bg-gradient-to-r from-blue-600 to-blue-400 relative overflow-hidden"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { duration: 500 } }"
    >
      <div
        class="absolute bottom-[-130px] right-[-80px] w-96 h-96 transform rotate-45"
      >
        <img
          src="@assets/logo.png"
          alt="FinPoint Logo"
          class="w-full h-full object-contain opacity-10"
        />
      </div>
      <h2 class="text-4xl font-bold relative z-10">
        당신의 금융 파트너, FinPoint
      </h2>
      <p class="mt-4 text-lg relative z-10">
        모든 금융 상품을 한눈에 비교하고 관리하세요.
      </p>
      <router-link
        to="/login"
        class="inline-block px-6 py-3 mt-6 text-lg font-semibold text-blue-600 bg-white rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105 relative z-10"
        @click="
          isLoggedIn &&
            toast('이미 로그인되어 있습니다.', {
              style: {
                background: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #dc2626',
              },
            })
        "
      >
        시작하기
      </router-link>
    </section>
    <hr class="w-full my-3 border-t border-gray-300" />
    <!-- 서비스 섹션 -->
    <section
      id="services"
      class="w-full px-4 py-20"
      v-motion
      :initial="{ opacity: 0 }"
      :visible="{ opacity: 1, transition: { duration: 500 } }"
    >
      <h2 class="text-3xl font-semibold text-center">우리의 서비스</h2>
      <div class="flex justify-center gap-10 mt-8">
        <div
          class="w-1/3 p-6 text-center transition-all duration-500 bg-gradient-to-b from-white to-blue-50 shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-2"
          v-motion
          :initial="{ opacity: 0, x: -50 }"
          :visible="{ opacity: 1, x: 0, transition: { duration: 500 } }"
        >
          <h3 class="text-xl font-semibold">통합 상품 조회</h3>
          <p class="mt-2 break-keep">
            정기예금, 적금 상품을 한눈에 비교하고 관리하세요.
          </p>
        </div>
        <div
          class="w-1/3 p-6 text-center transition-all duration-500 bg-gradient-to-b from-white to-blue-50 shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-2"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :visible="{
            opacity: 1,
            y: 0,
            transition: { duration: 500, delay: 100 },
          }"
        >
          <h3 class="text-xl font-semibold">금리 비교</h3>
          <p class="mt-2 break-keep">
            다양한 금융 상품의 금리를 한눈에 비교해보세요.
          </p>
        </div>
        <div
          class="w-1/3 p-6 text-center transition-all duration-500 bg-gradient-to-b from-white to-blue-50 shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-2"
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :visible="{
            opacity: 1,
            x: 0,
            transition: { duration: 500, delay: 200 },
          }"
        >
          <h3 class="text-xl font-semibold">프로필 관리</h3>
          <p class="mt-2 break-keep">
            가입한 상품을 프로필에서 편리하게 관리하세요.
          </p>
        </div>
      </div>
    </section>

    <!-- 특별 혜택 섹션 -->
    <section
      class="w-full px-4 py-20 bg-gradient-to-b from-gray-50 to-white"
      v-motion
      :initial="{ opacity: 0, scale: 0.9 }"
      :visible="{ opacity: 1, scale: 1, transition: { duration: 500 } }"
    >
      <h2 class="text-3xl font-semibold text-center">특별 혜택</h2>
      <div class="flex justify-center gap-10 mt-8">
        <div
          class="w-1/2 p-8 bg-white rounded-xl shadow-lg transition-all duration-500 hover:-translate-y-2"
          v-motion
          :initial="{ opacity: 0, x: -100 }"
          :visible="{ opacity: 1, x: 0, transition: { duration: 300 } }"
        >
          <h3 class="text-2xl font-semibold text-blue-600">신규 가입 혜택</h3>
          <p class="mt-4">첫 거래 시 수수료 면제 및 특별 금리 제공</p>
        </div>
        <div
          class="w-1/2 p-8 bg-white rounded-xl shadow-lg transition-all duration-500 hover:-translate-y-2"
          v-motion
          :initial="{ opacity: 0, x: 100 }"
          :visible="{
            opacity: 1,
            x: 0,
            transition: { duration: 300, delay: 200 },
          }"
        >
          <h3 class="text-2xl font-semibold text-blue-600">추천 이벤트</h3>
          <p class="mt-4">친구 추천 시 상품권 증정</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'vue-sonner';

const userStore = useUserStore();
const isLoggedIn = userStore.isLoggedIn;

defineComponent({
  name: 'Home',
});
</script>
