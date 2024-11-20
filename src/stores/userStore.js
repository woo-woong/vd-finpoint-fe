import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore(
  'user',
  () => {
    const userData = ref({});

    // 로그인 상태를 확인하는 computed 속성
    const isLoggedIn = computed(() => {
      return Object.keys(userData.value).length > 0;
    });

    // 로그인 처리
    const setUserData = (data) => {
      userData.value = data;
      localStorage.setItem('userData', JSON.stringify(data));
    };

    // 로그아웃 처리
    const clearUserData = () => {
      userData.value = {};
      localStorage.removeItem('userData');
    };

    // 초기화 시 localStorage에서 데이터 복구
    const initializeStore = () => {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        userData.value = JSON.parse(storedData);
      }
    };

    return {
      userData,
      isLoggedIn,
      setUserData,
      clearUserData,
      initializeStore,
    };
  },
  {
    persist: true,
  }
);
