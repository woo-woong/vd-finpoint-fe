<script setup>
import { defineProps } from 'vue';
import { useFinanceNavigation } from '@/hooks/navigator/useFinanceNavigation';

const props = defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
  type: {
    type: String,
    required: true,
  },
});

// null 체크를 포함한 안전한 구조분해
const {
  fin_prdt_cd = '',
  kor_co_nm = '',
  fin_prdt_nm = '',
  join_way = '',
  mtrt_int = '',
} = props.product || {};

const { navigateToFinProductDetail } = useFinanceNavigation();
</script>

<template>
  <div class="p-4 border rounded-lg shadow-sm">
    <div
      v-if="!props.product?.fin_prdt_nm"
      class="flex items-center justify-center h-32 text-gray-400"
    >
      금융 상품을 선택해주세요
    </div>
    <div v-else>
      <div
        class="max-w-sm p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow-lg min-w-40"
      >
        <div class="space-y-4">
          <!-- kor_co_nm -->
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">금융회사 명</div>
            <div
              @click="navigateToFinProductDetail(props.type, fin_prdt_cd)"
              class="text-sm text-gray-500 cursor-pointer hover:underline"
            >
              바로 가기->
            </div>
          </div>
          <div class="text-xl font-semibold text-gray-800">{{ kor_co_nm }}</div>

          <!-- fin_prdt_nm -->
          <div class="text-sm text-gray-500">금융상품 명</div>
          <div class="text-xl font-semibold text-gray-800">
            {{ fin_prdt_nm }}
          </div>

          <!-- join_way -->
          <div class="text-sm text-gray-500">가입 방법</div>
          <div class="text-lg text-gray-800">{{ join_way }}</div>

          <!-- mtrInt -->
          <div class="text-sm text-gray-500">만기 후 이자율</div>
          <div class="text-lg text-gray-800 break-keep">
            {{ mtrt_int }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
