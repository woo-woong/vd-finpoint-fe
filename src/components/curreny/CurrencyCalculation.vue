<script setup>
import ky from 'ky';
import { onMounted } from 'vue';

const KOREAXIM_REQUEST_URL = import.meta.env.VITE_KOREAXIM_API_URL;
const KOREAXIM_API_KEY = import.meta.env.VITE_KOREAXIM_API_KEY;

const fetchCurrencyData = async () => {
  try {
    const response = await ky.get(
      `https://cors-anywhere.herokuapp.com/${KOREAXIM_REQUEST_URL}`,
      {
        searchParams: {
          authkey: KOREAXIM_API_KEY,
          searchdata: '2015-01-01',
          data: 'AP01',
        },
      }
    );
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
