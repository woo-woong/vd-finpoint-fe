import { getCsrfToken } from '@/hooks/auth/useCsrfToken';
import ky from 'ky';

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

export const finProductService = () => {
  // 전체 금융 상품 조회
  const getAllFinProducts = async (path, searchParams = {}) => {
    const API_URL = `${BACKEND_API_URL}finance/${path}`;
    try {
      const response = await ky.get(API_URL, { searchParams });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('데이터 로딩 실패:', err);
      throw new Error(
        '금융 상품 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.'
      );
    }
  };

  // 금융 상품 상세 조회
  const getFinProduct = async (service, finPrdtCd) => {
    const API_URL = `${BACKEND_API_URL}finance/${service}/${finPrdtCd}`;
    try {
      const response = await ky.get(API_URL, {
        credentials: 'include',
      });
      return response.json();
    } catch (error) {
      console.error('API 요청 실패:', error);
      throw new Error('금융 상품 데이터를 가져오는데 실패했습니다.');
    }
  };

  // 금융 상품 가입
  const subscribeFinProduct = async (productData) => {
    const API_URL = `${BACKEND_API_URL}wishlist/`;
    try {
      const response = await ky.post(API_URL, {
        json: productData,
        headers: {
          'X-CSRFToken': getCsrfToken(),
        },
        credentials: 'include',
      });
      return response.json();
    } catch (error) {
      console.error('API 요청 실패:', error);
      throw new Error('금융 상품 가입에 실패했습니다.');
    }
  };

  // 금융 상품 가입 해제
  const unsubscribeFinProduct = async (productData, wishlistId) => {
    const API_URL = `${BACKEND_API_URL}wishlist/${wishlistId}`;
    try {
      const response = await ky.delete(API_URL, {
        json: productData,
        headers: {
          'X-CSRFToken': getCsrfToken(),
        },
        credentials: 'include',
      });

      // 응답 본문 확인
      const responseText = await response.text();

      // 응답 본문이 비어있으면 빈 객체 반환
      return responseText.trim() === '' ? {} : await response.json();
    } catch (error) {
      console.error('API 요청 실패:', error);
      throw new Error('금융 상품 가입 취소에 실패했습니다.');
    }
  };

  return {
    getAllFinProducts,
    getFinProduct,
    subscribeFinProduct,
    unsubscribeFinProduct,
  };
};
