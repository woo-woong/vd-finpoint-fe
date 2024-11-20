import ky from 'ky';
import { getCsrfToken } from '@/hooks/auth/useCsrfToken';
import { useUserStore } from '@/stores/userStore';

const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}`;

export const authService = {
  login: async (username, password) => {
    try {
      const response = await ky.post(`${API_URL}login/`, {
        json: { username, password },
        credentials: 'include',
        headers: {
          'X-CSRFToken': getCsrfToken(),
        },
      });
      const data = await response.json();
      const userStore = useUserStore();
      userStore.setUserData(data.user);
      return data;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw new Error(
        '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.'
      );
    }
  },

  logout: async () => {
    try {
      await ky.post(`${API_URL}logout/`, {
        credentials: 'include',
        headers: {
          'X-CSRFToken': getCsrfToken(),
        },
      });
      const userStore = useUserStore();
      userStore.clearUserData();
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw new Error('로그아웃에 실패했습니다.');
    }
  },
};
