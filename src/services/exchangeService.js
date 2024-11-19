import ky from 'ky';

const EXCHANGE_API_URL = `${import.meta.env.VITE_BACKEND_API_URL}exchange/rates/`;

export default async function exchangeService() {
  try {
    const response = await ky.get(`${EXCHANGE_API_URL}`);
    return response.json();
  } catch (error) {
    console.error('API 요청 실패:', error);
  }
}
