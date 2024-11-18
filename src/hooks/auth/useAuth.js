import { ref } from 'vue';
import { authServices } from '@services/authServices';

export const useLogin = () => {
  const { login, logout } = authServices;
  const isLoggedIn = ref(false);
  const error = ref(null);

  const handleLogin = async (username, password) => {
    try {
      const response = await login(username, password);

      const contentType = response.headers.get('content-type');

      let token;
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        token = data.token;
      } else {
        token = await response.text();
      }

      isLoggedIn.value = true;
      console.log('로그인 성공', token);

      return token; // 필요한 경우 토큰 반환
    } catch (err) {
      error.value = '로그인 실패. 아이디와 비밀번호를 확인해주세요.';
      console.error('로그인 실패', err);
      throw err; // 에러를 상위로 전파하여 컴포넌트에서 처리할 수 있도록 함
    }
  };

  const handleLoginClick = async (username, password) => {
    try {
      await login(username, password);
    } catch (err) {
      // handleLoginClick에서 에러를 처리하거나 상위로 전파할 수 있음
      console.error('Login click handler error:', err);
    }
  };

  // 로그아웃 기능이 필요한 경우를 위한 함수
  const handleLogout = async () => {
    await logout();
    isLoggedIn.value = false;
    error.value = null;
  };

  return {
    handleLogin,
    handleLoginClick,
    handleLogout,
    isLoggedIn,
    error,
  };
};

export default useLogin;
