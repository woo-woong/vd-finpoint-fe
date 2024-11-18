import ky from 'ky';

// REQUEST URL -> 백엔드 서버로 변경 예정
const KOREAXIM_REQUEST_URL = import.meta.env.VITE_KOREAXIM_API_URL;
const KOREAXIM_API_KEY = import.meta.env.VITE_KOREAXIM_API_KEY;

export default async function currencyServices() {
  try {
    const response = await ky.get(`${KOREAXIM_REQUEST_URL}`, {
      searchParams: {
        authkey: KOREAXIM_API_KEY,
        searchdata: '2015-01-01',
        data: 'AP01',
      },
    });
    return response.json();
  } catch (error) {
    console.error('API 요청 실패:', error);
  }
}
