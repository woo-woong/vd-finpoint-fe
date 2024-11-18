<!-- 연금 저축 -->
<template>
  <FinanceProductList
    path="annuity-savings"
    :searchParams="{ topFinGrpNo: '060000', pageNo: '1' }"
  />
</template>

<script setup>
import FinanceProductList from '@components/finance/FinanceProductList.vue';
</script>
