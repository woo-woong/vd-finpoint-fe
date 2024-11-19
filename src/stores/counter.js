import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', () => {
  const userData = ref({});

  return { userData };
});
