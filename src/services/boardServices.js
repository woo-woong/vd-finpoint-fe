import ky from 'ky';

const API_URL = `${import.meta.env.VITE_FINANCIAL_API_URL}board/`;

export default function BoardService() {
  return {
    create: async () => {
      try {
        const response = await ky.post(`${API_URL}create/`);
        return response.json();
      } catch (error) {
        console.error('API 요청 실패:', error);
        throw new Error('게시글 생성에 실패했습니다.');
      }
    },
    read: async () => {
      try {
        const response = await ky.get(`${API_URL}`);
        return response.json();
      } catch (error) {
        console.error('API 요청 실패:', error);
        throw new Error('게시글 조회에 실패했습니다.');
      }
    },
    update: async (id) => {
      try {
        const response = await ky.put(`${API_URL}update/${id}`);
        return response.json();
      } catch (error) {
        console.error('API 요청 실패:', error);
        throw new Error('게시글 수정에 실패했습니다.');
      }
    },
    delete: async (id) => {
      try {
        const response = await ky.delete(`${API_URL}delete/${id}`);
        return response.json();
      } catch (error) {
        console.error('API 요청 실패:', error);
        throw new Error('게시글 삭제에 실패했습니다.');
      }
    },
  };
}
