import { ref } from 'vue';
import { authService } from '@services/authService';
import { useUserStore } from '@/stores/userStore';

export default function useAuth() {
  const error = ref(null);
  const { login, logout } = authService;
  const userStore = useUserStore();

  const handleLogin = async (username, password) => {
    try {
      const response = await login(username, password);
      userStore.setUserData(response.user);
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
      userStore.clearUserData();
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
