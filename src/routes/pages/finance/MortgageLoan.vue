<!-- 주택담보대출 -->
<template>
  <FinanceProductList
    path="mortgage-loan"
    :searchParams="{ topFinGrpNo: '020000', pageNo: '1' }"
  />
</template>

<script setup>
import FinanceProductList from '@components/finance/FinanceProductList.vue';
</script>
