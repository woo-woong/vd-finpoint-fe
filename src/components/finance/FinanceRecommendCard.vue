<script setup>
import { useRouter } from 'vue-router';
import FinanceCard from './FinanceCard.vue';
const router = useRouter();

const props = defineProps({
  service: {
    type: String,
    required: true,
  },
  productData: {
    type: Object,
    required: true,
  },
});

const servicelowerCased = props.service.toLowerCase();

const navigateToFinProductDetail = (finPrdtCd) => {
  router.push({
    path: `/${servicelowerCased}/detail`,
    query: { finPrdtCd },
  });
};
</script>
<template>
  <div class="relative group" v-if="productData">
    <div
      class="p-4 mb-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
    >
      <div class="flex items-center justify-between">
        <div>
          <span class="text-sm font-medium text-gray-500">추천 금융상품</span>
          <h3 class="mt-1 text-lg font-bold text-blue-600">
            {{ productData.fin_prdt_nm }}
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
          <span>자세히 보기</span>
        </div>
      </div>
      <div
        class="absolute z-[100] transition-all duration-300 transform scale-95 translate-y-2 opacity-0 top-full left-0 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
      >
        <FinanceCard
          :product="productData"
          @click="navigateToFinProductDetail(productData.fin_prdt_cd)"
        />
      </div>
    </div>
  </div>
</template>
