import api from './api';

export const carrerasService = {
  // Obtener todas las carreras
  getAll: async () => {
    const response = await api.get('/carreras');
    return response.data;
  },

  // Obtener una carrera específica
  getById: async (id) => {
    const response = await api.get(`/carreras/${id}`);
    return response.data;
  },

  // Crear una nueva carrera
  create: async (data) => {
    const response = await api.post('/carreras', data);
    return response.data;
  },

  // Actualizar una carrera
  update: async (id, data) => {
    const response = await api.put(`/carreras/${id}`, data);
    return response.data;
  },

  // Eliminar una carrera
  delete: async (id) => {
    const response = await api.delete(`/carreras/${id}`);
    return response.data;
  },
};
