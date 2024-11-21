<script setup>
import { finProductService } from '@services/finProductService';
import { computed } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
  service: {
    type: String,
    required: true,
  },
});

const { subscribeFinProduct } = finProductService();

const productDetails = computed(() =>
  props.product
    ? {
        fin_prdt_cd: props.product.fin_prdt_cd,
        kor_co_nm: props.product.kor_co_nm,
        fin_prdt_nm: props.product.fin_prdt_nm,
        mtrt_int: props.product.mtrt_int,
        type: props.service.toUpperCase(), // 백엔드에서 대문자로 요구
      }
    : null
);

console.log(productDetails.value);

const subscribe = () => {
  // computed 값을 .value로 접근
  if (productDetails.value) {
    subscribeFinProduct(productDetails.value);
  } else {
    console.error('No product selected');
  }
};
</script>

<template>
  <button
    v-if="productDetails"
    class="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
    @click="subscribe"
  >
    가입하기
  </button>
  <div v-else>상품 정보가 없습니다.</div>
</template>
