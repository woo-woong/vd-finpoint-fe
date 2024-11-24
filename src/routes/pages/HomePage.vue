<template>
  <div class="flex flex-col items-center min-h-screen">
    <!-- 메인 배너 -->
    <section
      class="w-full py-20 mb-10 text-center text-white bg-blue-600"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { duration: 1000 } }"
    >
      <h2 class="text-4xl font-bold">당신의 금융 파트너, FinPoint</h2>
      <p class="mt-4 text-lg">모든 금융 서비스를 손쉽게 관리하세요.</p>
      <button
        type="button"
        class="px-6 py-3 mt-6 text-lg font-semibold text-blue-600 bg-white rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105"
      >
        바로 관리하기
      </button>
    </section>
    <hr class="w-full my-3 border-t border-gray-300" />
    <!-- 서비스 섹션 -->
    <section
      id="services"
      class="w-full px-4 py-20"
      v-motion
      :initial="{ opacity: 0 }"
      :visible="{ opacity: 1, transition: { duration: 1000 } }"
    >
      <h2 class="text-3xl font-semibold text-center">우리의 서비스</h2>
      <div class="flex justify-center gap-10 mt-8">
        <div
          class="w-1/3 p-6 text-center transition-all duration-500 bg-white shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-2"
          v-motion
          :initial="{ opacity: 0, x: -100 }"
          :visible="{ opacity: 1, x: 0, transition: { duration: 1000 } }"
        >
          <h3 class="text-xl font-semibold">계좌 관리</h3>
          <p class="mt-2 break-keep">
            간편한 계좌 관리와 이체 기능을 제공합니다.
          </p>
        </div>
        <div
          class="w-1/3 p-6 text-center transition-all duration-500 bg-white shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-2"
          v-motion
          :initial="{ opacity: 0, y: 100 }"
          :visible="{
            opacity: 1,
            y: 0,
            transition: { duration: 1000, delay: 200 },
          }"
        >
          <h3 class="text-xl font-semibold">대출 서비스</h3>
          <p class="mt-2 break-keep">
            맞춤형 대출 상품을 통해 필요한 자금을 지원합니다.
          </p>
        </div>
        <div
          class="w-1/3 p-6 text-center transition-all duration-500 bg-white shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-2"
          v-motion
          :initial="{ opacity: 0, x: 100 }"
          :visible="{
            opacity: 1,
            x: 0,
            transition: { duration: 1000, delay: 400 },
          }"
        >
          <h3 class="text-xl font-semibold">투자 서비스</h3>
          <p class="mt-2 break-keep">
            다양한 투자 상품을 통해 금융 포트폴리오를 확장하세요.
          </p>
        </div>
      </div>
    </section>

    <!-- 특별 혜택 섹션 -->
    <section
      class="w-full px-4 py-20 bg-gray-100"
      v-motion
      :initial="{ opacity: 0, scale: 0.8 }"
      :visible="{ opacity: 1, scale: 1, transition: { duration: 1000 } }"
    >
      <h2 class="text-3xl font-semibold text-center">특별 혜택</h2>
      <div class="flex justify-center gap-10 mt-8">
        <div
          class="w-1/2 p-8 bg-white rounded-xl shadow-lg transition-all duration-500 hover:-translate-y-2"
          v-motion
          :initial="{ opacity: 0, x: -100 }"
          :visible="{ opacity: 1, x: 0, transition: { duration: 1000 } }"
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
            transition: { duration: 1000, delay: 200 },
          }"
        >
          <h3 class="text-2xl font-semibold text-blue-600">추천 이벤트</h3>
          <p class="mt-4">친구 추천 시 상품권 증정</p>
        </div>
      </div>
    </section>

    <!-- 앱 다운로드 섹션 -->
    <section
      class="w-full px-4 py-20"
      v-motion
      :initial="{ opacity: 0, y: 100 }"
      :visible="{ opacity: 1, y: 0, transition: { duration: 1000 } }"
    >
      <div class="max-w-4xl p-8 mx-auto text-center bg-blue-50 rounded-2xl">
        <h2 class="text-3xl font-bold text-blue-600">지금 바로 시작하세요</h2>
        <p class="mt-4 text-lg">
          FinPoint 앱을 다운로드하고 스마트한 금융생활을 경험해보세요
        </p>
        <div class="flex justify-center gap-4 mt-8">
          <button
            class="px-6 py-3 text-white bg-black rounded-lg transition-transform duration-300 hover:scale-105"
          >
            App Store
          </button>
          <button
            class="px-6 py-3 text-white bg-black rounded-lg transition-transform duration-300 hover:scale-105"
          >
            Google Play
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue';

defineComponent({
  name: 'Home',
});
</script>
