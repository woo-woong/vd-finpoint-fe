import ky from 'ky';

export const finProductsService = async (path, searchParams = {}) => {
  const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}finance/${path}`;
  try {
    const response = await ky.get(API_URL, { searchParams });
    return response.json();
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw new Error('금융 상품 데이터를 가져오는데 실패했습니다.');
  }
};
