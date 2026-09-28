import api from './api';

export const linksService = {
  // Obtener links
  getAll: async (filters = {}) => {
    const response = await api.get('/links', { params: filters });
    return response.data;
  },

  // Crear un nuevo link
  create: async (data) => {
    const response = await api.post('/links', data);
    return response.data;
  },

  // Actualizar un link
  update: async (id, data) => {
    const response = await api.put(`/links/${id}`, data);
    return response.data;
  },

  // Eliminar un link
  delete: async (id) => {
    const response = await api.delete(`/links/${id}`);
    return response.data;
  },
};
