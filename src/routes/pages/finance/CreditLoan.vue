<!-- 개인신용대출 -->
<template>
  <FinanceProductList
    path="credit-loan"
    :searchParams="{ topFinGrpNo: '020000', pageNo: '1' }"
  />
</template>

<script setup>
import FinanceProductList from '@components/finance/FinanceProductList.vue';
</script>
