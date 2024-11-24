<!-- 정기 예금 -->
<template>
  <TabHeader title="정기예금" subtitle="정기예금 상품을 확인할 수 있습니다." />
  <FinanceProductList
    path="deposit"
    :searchParams="{ topFinGrpNo: '020000', pageNo: '1' }"
  />
</template>

<script setup>
import FinanceProductList from '@components/finance/FinanceProductList.vue';
import TabHeader from '@components/common/TabHeader.vue';
</script>
