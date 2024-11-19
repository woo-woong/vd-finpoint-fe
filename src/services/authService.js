import ky from 'ky';

const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}`;

// CSRF 토큰을 가져오는 함수
export const getCsrfToken = () => {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrftoken='))
    ?.split('=')[1];
};

export const authService = {
  login: async (username, password) => {
    try {
      const response = await ky.post(`${API_URL}login/`, {
        json: {
          username,
          password,
        },
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
      const response = await ky.get(`${API_URL}logout/`, {
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
