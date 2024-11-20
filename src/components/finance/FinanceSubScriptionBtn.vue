<script setup>
import { finProductService } from '@services/finProductService';

const { subscribeFinProduct } = finProductService();

const subscribe = () => {
  subscribeFinProduct(
    'SAVE1231',
    '신한은행',
    '쏠편한 적금',
    '12개월',
    'SAVINGS'
  );
};
</script>
<template>
  <button
    class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
    @click="subscribe"
  >
    가입하기
  </button>
</template>
