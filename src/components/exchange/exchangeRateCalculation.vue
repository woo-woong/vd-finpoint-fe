<script setup>
import { onMounted } from 'vue';
import exchangeService from '@/services/exchangeService';

const fetchExchangeRateData = async () => {
  try {
    const response = await exchangeService();
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  fetchExchangeRateData();
});
</script>

<template>
  <div></div>
</template>
