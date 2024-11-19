import { ref } from 'vue';
import { authService } from '@services/authService';
import { useCounterStore } from '@/stores/counter';

export default function useAuth() {
  const error = ref(null);
  const { login, logout } = authService;

  const handleLogin = async (username, password) => {
    try {
      const response = await login(username, password);
      useCounterStore().userData = response.user;

      return response;
    } catch (err) {
      console.error('로그인 실패:', err);
      error.value = '로그인 실패. 아이디와 비밀번호를 확인해주세요.';
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      useCounterStore().userData = {};
    } catch (err) {
      console.error('로그아웃 실패:', err);
      throw err;
    }
  };

  return {
    error,
    handleLogin,
    handleLogout,
  };
}
