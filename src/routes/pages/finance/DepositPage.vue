<!-- 정기 예금 -->
<template>
  <FinanceProductList
    path="deposit"
    :searchParams="{ topFinGrpNo: '020000', pageNo: '1' }"
  />
</template>

<script setup>
import FinanceProductList from '@components/finance/FinanceProductList.vue';
</script>
