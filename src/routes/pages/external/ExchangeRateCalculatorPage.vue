<script setup>
import ExchangeRateCalculation from '@/components/exchange/exchangeRateCalculation.vue';
import TabHeader from '@/components/common/TabHeader.vue';
</script>
<template>
  <TabHeader
    title="환율 계산기"
    subtitle="환율 계산기를 통해 환율을 확인할 수 있습니다."
  />
  <div class="w-full h-full mt-10 pb-10 bg-white rounded-lg shadow-md p-4">
    <ExchangeRateCalculation />
  </div>
</template>
