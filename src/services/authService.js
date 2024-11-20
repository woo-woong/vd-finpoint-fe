import ky from 'ky';
import { getCsrfToken } from '@/hooks/auth/useCsrfToken';
const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}`;

export const authService = () => {
  return {
    login: async (username, password) => {
      try {
        const response = await ky.post(`${API_URL}login/`, {
          json: { username, password },
          credentials: 'include',
          headers: {
            'X-CSRFToken': getCsrfToken(),
          },
        });
        return response.json();
      } catch (error) {
        console.error('API 요청 실패:', error);
        throw new Error('로그인에 실패했습니다.');
      }
    },
    logout: async () => {
      try {
        const response = await ky.post(`${API_URL}logout/`, {
          credentials: 'include',
          headers: {
            'X-CSRFToken': getCsrfToken(),
          },
        });
        return response.json();
      } catch (error) {
        console.error('API 요청 실패:', error);
        throw new Error('로그아웃에 실패했습니다.');
      }
    },
  };
};
