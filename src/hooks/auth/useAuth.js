import { authService } from '@services/authService';
import { useCounterStore } from '@/stores/counter';

export const useLogin = () => {
  const { login, logout } = authService;

  const handleLogin = async (username, password) => {
    try {
      const response = await login(username, password);
      useCounterStore().userData = response.user;

      return response;
    } catch (err) {
      console.error('로그인 실패:', err);
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
    handleLogin,
    handleLogout,
  };
};

export default useLogin;
