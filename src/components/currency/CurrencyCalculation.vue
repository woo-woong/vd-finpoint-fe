<script setup>
import { onMounted } from 'vue';
import currencyServices from '@/services/currencyServices';

const fetchCurrencyData = async () => {
  try {
    const response = await currencyServices();
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  fetchCurrencyData();
});
</script>

<template>
  <div></div>
</template>
