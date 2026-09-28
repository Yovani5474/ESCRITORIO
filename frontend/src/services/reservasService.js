import api from './api';

export const reservasService = {
  // Obtener reservas (con filtros opcionales)
  getAll: async (filters = {}) => {
    const response = await api.get('/reservas', { params: filters });
    return response.data;
  },

  // Obtener una reserva específica
  getById: async (id) => {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
  },

  // Crear una nueva reserva
  create: async (data) => {
    const response = await api.post('/reservas', data);
    return response.data;
  },

  // Crear reserva de juego de mesa
  createJuegoMesa: async (data) => {
    const response = await api.post('/reservas/juego-mesa', data);
    return response.data;
  },

  // Actualizar estado de reserva
  updateEstado: async (id, data) => {
    const response = await api.put(`/reservas/${id}/estado`, data);
    return response.data;
  },

  // Registrar resultado de juego
  updateResultadoJuego: async (id, resultadoJuego) => {
    const response = await api.put(`/reservas/${id}/resultado-juego`, { resultado_juego: resultadoJuego });
    return response.data;
  },

  // Cancelar una reserva
  cancel: async (id) => {
    const response = await api.delete(`/reservas/${id}`);
    return response.data;
  },
};

export default reservasService;
