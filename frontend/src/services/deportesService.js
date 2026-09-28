import api from './api';

export const deportesService = {
  // Obtener todos los deportes
  getAll: async (tipoActividad = null) => {
    const params = tipoActividad ? { tipo_actividad: tipoActividad } : {};
    const response = await api.get('/deportes', { params });
    return response.data;
  },

  // Obtener un deporte específico
  getById: async (id) => {
    const response = await api.get(`/deportes/${id}`);
    return response.data;
  },

  // Crear un nuevo deporte
  create: async (data) => {
    const response = await api.post('/deportes', data);
    return response.data;
  },

  // Actualizar un deporte
  update: async (id, data) => {
    const response = await api.put(`/deportes/${id}`, data);
    return response.data;
  },

  // Eliminar un deporte
  delete: async (id) => {
    const response = await api.delete(`/deportes/${id}`);
    return response.data;
  },
};

export default deportesService;
