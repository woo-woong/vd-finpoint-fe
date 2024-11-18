<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const { kor_co_nm, fin_prdt_nm, join_way, mtrt_int } = props.product;
</script>

<template>
  <div
    class="max-w-sm p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow-lg min-w-40"
  >
    <div class="space-y-4">
      <!-- kor_co_nm -->
      <div class="text-sm text-gray-500">금융회사 명</div>
      <div class="text-xl font-semibold text-gray-800">{{ kor_co_nm }}</div>

      <!-- fin_prdt_nm -->
      <div class="text-sm text-gray-500">금융상품 명</div>
      <div class="text-xl font-semibold text-gray-800">{{ fin_prdt_nm }}</div>

      <!-- join_way -->
      <div class="text-sm text-gray-500">가입 방법</div>
      <div class="text-lg text-gray-800">{{ join_way }}</div>

      <!-- mtrInt -->
      <div class="text-sm text-gray-500">만기 후 이자율</div>
      <div class="text-lg text-gray-800">{{ mtrt_int }}</div>
    </div>
  </div>
</template>
