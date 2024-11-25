import ky from 'ky';
import { useCookie } from '@/hooks/auth/useCookie';
import { toast } from 'vue-sonner';

const BOARD_API_URL = `${import.meta.env.VITE_BACKEND_API_URL}board/`;

export const boardService = () => {
  const csrfToken = useCookie('csrftoken');

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
        toast.error('게시글 생성에 실패했습니다. 잠시 후 다시 시도해주세요.', {
          style: {
            background: '#fee2e2',
            color: '#dc2626',
            border: '1px solid #dc2626',
            width: '400px',
            right: '0',
          },
        });
        throw error;
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
        toast.error(
          '게시글 상세조회에 실패했습니다. 잠시 후 다시 시도해주세요.',
          {
            style: {
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #dc2626',
              width: '400px',
              right: '0',
            },
          }
        );
        throw error;
      }
    },
    list: async () => {
      try {
        const response = await ky.get(BOARD_API_URL);
        const data = await response.json();
        return data;
      } catch (error) {
        toast.error('게시글 조회에 실패했습니다. 잠시 후 다시 시도해주세요.', {
          style: {
            background: '#fee2e2',
            color: '#dc2626',
            border: '1px solid #dc2626',
            width: '400px',
            right: '0',
          },
        });
        throw error;
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
        toast.error('게시글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.', {
          style: {
            background: '#fee2e2',
            color: '#dc2626',
            border: '1px solid #dc2626',
            width: '400px',
            right: '0',
          },
        });
        throw error;
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
        toast.error(
          '게시글 삭제에 실패했습니다. 본인의 게시글만 삭제할 수 있습니다.',
          {
            style: {
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #dc2626',
              width: '400px',
              right: '0',
            },
          }
        );
        throw error;
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
        toast.error(
          '게시글 좋아요에 실패했습니다. 잠시 후 다시 시도해주세요.',
          {
            style: {
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #dc2626',
              width: '400px',
              right: '0',
            },
          }
        );
        throw error;
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
        toast.error(
          '게시글 좋아요 취소에 실패했습니다. 잠시 후 다시 시도해주세요.',
          {
            style: {
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #dc2626',
              width: '400px',
              right: '0',
            },
          }
        );
        throw error;
      }
    },
  };
};
