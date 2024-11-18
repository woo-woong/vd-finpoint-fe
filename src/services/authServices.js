import ky from 'ky';

const API_URL = `${import.meta.env.VITE_FINANCIAL_API_URL}`;

// CSRF 토큰을 가져오는 함수
const getCsrfToken = () => {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrftoken='))
    ?.split('=')[1];
};

export const authServices = {
  login: async (username, password) => {
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
  },
  logout: async () => {
    const response = await ky.get(`${API_URL}logout/`, {
      credentials: 'include',
      headers: {
        'X-CSRFToken': getCsrfToken(),
      },
    });
    return response.json();
  },
};
