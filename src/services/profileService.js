import getCsrfToken from '@/hooks/auth/useCsrfToken';
import { useUserStore } from '@/stores/userStore';
import ky from 'ky';

const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}`;

export default function profileService() {
  const userData = useUserStore().userData;

  async function editProfile(data) {
    const response = await ky.put(`${API_URL}profile/`, {
      json: data,
      headers: {
        'X-CSRFToken': getCsrfToken(),
      },
      credentials: 'include',
    });
    return response.json();
  }

  return {
    userData,
    editProfile,
  };
}