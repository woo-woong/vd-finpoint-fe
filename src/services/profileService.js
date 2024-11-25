import { getCsrfToken } from '@/hooks/auth/useCsrfToken';
import { useUserStore } from '@/stores/userStore';
import ky from 'ky';

const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}`;

export const profileService = () => {
  const userData = useUserStore().userData;

  const getProfile = async (data) => {
    try {
      const response = await ky.get(`${API_URL}profile/`, {
        json: data,
        headers: {
          'X-CSRFToken': getCsrfToken(),
        },
        credentials: 'include',
        timeout: 30000,
      });
      return response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const editProfile = async (data) => {
    const response = await ky.put(`${API_URL}profile/`, {
      json: data,
      headers: {
        'X-CSRFToken': getCsrfToken(),
      },
      credentials: 'include',
    });
    return response.json();
  };

  return {
    userData,
    getProfile,
    editProfile,
  };
};
