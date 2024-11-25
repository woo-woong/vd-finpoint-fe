<script setup>
import { ref } from 'vue';
import FinanceCard from './FinanceCard.vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  product: {
    type: Object,
    required: true,
  },
});

const isShowFinanceCard = ref(false);

const toggleFinanceCard = () => {
  isShowFinanceCard.value = !isShowFinanceCard.value;
};
</script>
<template>
  <div class="relative group" v-if="product">
    <div
      class="p-4 mb-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
    >
      <div class="flex items-center justify-between">
        <div>
          <span class="text-sm font-medium text-gray-500">추천 금융상품</span>
          <h3 class="mt-1 text-lg font-bold text-blue-600">
            {{ product.fin_prdt_nm }}
          </h3>
        </div>
        <div class="flex items-center text-sm text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span @click="toggleFinanceCard" class="cursor-pointer">{{
            isShowFinanceCard ? '카드 닫기' : '간단 정보 보기'
          }}</span>
        </div>
      </div>
      <div
        class="absolute right-0 z-10 mt-6 transition-all duration-200"
        :class="{
          'opacity-100 visible': isShowFinanceCard,
          'opacity-0 invisible': !isShowFinanceCard,
        }"
      >
        <FinanceCard :product="product" :type="props.type" />
      </div>
    </div>
  </div>
</template>
