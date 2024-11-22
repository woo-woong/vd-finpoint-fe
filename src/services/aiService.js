import ky from 'ky';
import { getCsrfToken } from '@/hooks/auth/useCsrfToken';

const AI_API_URL = `${import.meta.env.VITE_AI_API_URL}`;

export const aiService = {
  getRecommendProduct: async (service) => {
    try {
      const response = await ky.get(`${AI_API_URL}${service}/`, {
        credentials: 'include',
        headers: {
          'X-CSRFToken': getCsrfToken(),
        },
        timeout: 30000, // 30 seconds
      });
      console.log(response);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API 요청 실패:', error);
      throw new Error('AI 질문 요청에 실패했습니다.');
    }
  },
};
