import api from './api';

export const canchasService = {
  // Obtener canchas (con filtros opcionales)
  getAll: async (deporteId = null, estado = null) => {
    const params = {};
    if (deporteId) params.deporte_id = deporteId;
    if (estado) params.estado = estado;
    const response = await api.get('/canchas', { params });
    return response.data;
  },

  // Obtener una cancha específica
  getById: async (id) => {
    const response = await api.get(`/canchas/${id}`);
    return response.data;
  },

  // Crear una nueva cancha
  create: async (data) => {
    const response = await api.post('/canchas', data);
    return response.data;
  },

  // Actualizar una cancha
  update: async (id, data) => {
    const response = await api.put(`/canchas/${id}`, data);
    return response.data;
  },

  // Eliminar una cancha
  delete: async (id) => {
    const response = await api.delete(`/canchas/${id}`);
    return response.data;
  },
};

export default canchasService;
