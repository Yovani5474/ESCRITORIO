import api from './api';

export const espaciosJuegosMesaService = {
  // Obtener espacios de juegos de mesa
  getAll: async (deporteId = null, estado = null) => {
    const params = {};
    if (deporteId) params.deporte_id = deporteId;
    if (estado) params.estado = estado;
    const response = await api.get('/espacios-juegos-mesa', { params });
    return response.data;
  },

  // Obtener un espacio específico
  getById: async (id) => {
    const response = await api.get(`/espacios-juegos-mesa/${id}`);
    return response.data;
  },

  // Verificar disponibilidad de un espacio
  checkDisponibilidad: async (id, fecha, horaInicio, horaFin) => {
    const response = await api.get(`/espacios-juegos-mesa/${id}/disponibilidad`, {
      params: { fecha, hora_inicio: horaInicio, hora_fin: horaFin }
    });
    return response.data;
  },

  // Crear un nuevo espacio
  create: async (data) => {
    const response = await api.post('/espacios-juegos-mesa', data);
    return response.data;
  },

  // Actualizar un espacio
  update: async (id, data) => {
    const response = await api.put(`/espacios-juegos-mesa/${id}`, data);
    return response.data;
  },

  // Eliminar un espacio
  delete: async (id) => {
    const response = await api.delete(`/espacios-juegos-mesa/${id}`);
    return response.data;
  },
};

export default espaciosJuegosMesaService;
