import ky from 'ky';
import { getCsrfToken } from '@/hooks/auth/useCsrfToken';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'vue-sonner';

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
      toast.success('로그인에 성공했습니다.', {
        style: {
          background: '#e0f2fe',
          color: '#0284c7',
        },
      });
      return data;
    } catch (error) {
      toast.error('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.', {
        style: {
          background: '#fee2e2',
          color: '#dc2626',
          width: '360px',
        },
      });
      throw new Error('로그인에 실패했습니다.');
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
      toast.success('로그아웃에 성공했습니다.', {
        style: {
          background: '#e0f2fe',
          color: '#0284c7',
        },
      });
    } catch (error) {
      toast.error('로그아웃에 실패했습니다.');
      throw new Error('로그아웃에 실패했습니다.');
    }
  },
};
