import ky from 'ky';
import { useCookie } from '@/hooks/auth/useCookie';

const BOARD_API_URL = `${import.meta.env.VITE_BACKEND_API_URL}board/`;

export const boardService = () => {
  const csrfToken = useCookie('csrftoken').value._value;

  return {
    create: async (formData) => {
      try {
        // CSRF 토큰이 존재하는지 먼저 확인
        if (!csrfToken) {
          throw new Error('CSRF 토큰이 없습니다.');
        }
        const response = await ky.post(`${BOARD_API_URL}`, {
          headers: {
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
          json: formData,
        });
        return response.json();
      } catch (error) {
        console.error('API 요청 실패:', error);
        throw new Error('게시글 생성에 실패했습니다.');
      }
    },
    read: async (board_id) => {
      try {
        const response = await ky.get(`${BOARD_API_URL}${board_id}/`, {
          credentials: 'include', // user가 자기 자신의 liked 여부를 봐야하기 때문
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('API 요청 실패:', error);
        throw new Error('게시글 상세조회에 실패했습니다.');
      }
    },
    list: async () => {
      try {
        const response = await ky.get(BOARD_API_URL);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('API 요청 실패:', error);
        throw new Error('게시글 조회에 실패했습니다.');
      }
    },
    update: async (board_id, formData) => {
      try {
        if (!csrfToken) {
          throw new Error('CSRF 토큰이 없습니다.');
        }
        // CSRF 토큰이 존재하는지 먼저 확인
        const response = await ky.put(`${BOARD_API_URL}${board_id}/`, {
          headers: {
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
          json: formData,
        });
        return response.json();
      } catch (error) {
        console.error('API 요청 실패:', error);
        throw new Error('게시글 수정에 실패했습니다.');
      }
    },
    remove: async (board_id) => {
      try {
        await ky.delete(`${BOARD_API_URL}${board_id}/`, {
          headers: {
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
        });
        return true;
      } catch (error) {
        console.error('API 요청 실패:', error);
        throw new Error('게시글 삭제에 실패했습니다.');
      }
    },
    like: async (board_id) => {
      try {
        // CSRF 토큰이 존재하는지 먼저 확인
        if (!csrfToken) {
          throw new Error('CSRF 토큰이 없습니다.');
        }
        const response = await ky.post(`${BOARD_API_URL}likes/`, {
          headers: {
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
          json: { board_id },
        });
        return response.json();
      } catch (error) {
        console.error('API 요청 실패:', error);
        throw new Error('게시글 좋아요에 실패했습니다.');
      }
    },
    unlike: async (board_id) => {
      try {
        // CSRF 토큰이 존재하는지 먼저 확인
        if (!csrfToken) {
          throw new Error('CSRF 토큰이 없습니다.');
        }
        const response = await ky.delete(`${BOARD_API_URL}likes/`, {
          headers: {
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
          json: { board_id },
        });
        return response.json();
      } catch (error) {
        console.error('API 요청 실패:', error);
        throw new Error('게시글 안좋아요에 실패했습니다.');
      }
    },
  };
};
