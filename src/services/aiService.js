import ky from 'ky';
import { getCsrfToken } from '@/hooks/auth/useCsrfToken';

const BACKEND_AI_MODEL_API_URL = `${import.meta.env.VITE_BACKEND_AI_MODEL_API_KEY}`;

export const aiService = {
  fetchRecommendProduct: async (service) => {
    try {
      const response = await ky.get(`${BACKEND_AI_MODEL_API_URL}${service}/`, {
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

      // 타임아웃 에러 체크
      if (error.name === 'TimeoutError') {
        throw new Error('요청 시간이 초과되었습니다. 다시 시도해주세요.');
      }

      // HTTP 400 에러 체크
      if (error.response?.status === 400) {
        return {
          user_insights: {
            general_advice:
              '아직 다른 사용자들의 금융 상품 가입 데이터가 충분하지 않아 맞춤형 추천이 어렵습니다. 가까운 은행을 찾아 전문가와 상담해보시는 것은 어떨까요? 저희가 주변 은행을 찾아드릴 수 있습니다.',
          },
          recommendations: [],
        };
      }

      if (error.response?.status === 403) {
        throw new Error('로그인이 필요합니다.');
      }

      // 기타 에러
      throw new Error('AI 질문 요청에 실패했습니다.');
    }
  },
};
