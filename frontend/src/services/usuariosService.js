import api from './api';

export const usuariosService = {
  getAll: async (filters = {}) => {
    const response = await api.get('/usuarios', { params: filters });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/usuarios', data);
    return response.data;
  },
};

export default usuariosService;