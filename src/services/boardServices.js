import ky from 'ky';

const API_URL = `${import.meta.env.VITE_FINANCIAL_API_URL}board/`;

export const BoardService = {
  create: async () => {
    const response = await ky.post(`${API_URL}create/`);
    return response.json();
  },
  read: async () => {
    const response = await ky.get(`${API_URL}read/`);
    return response.json();
  },
  update: async (id) => {
    const response = await ky.put(`${API_URL}update/${id}`);
    return response.json();
  },
  delete: async (id) => {
    const response = await ky.delete(`${API_URL}delete/${id}`);
    return response.json();
  },
};
