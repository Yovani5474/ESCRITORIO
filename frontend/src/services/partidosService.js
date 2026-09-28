import api from './api';

export const partidosService = {
  // Obtener partidos
  getAll: async (filters = {}) => {
    const response = await api.get('/partidos', { params: filters });
    return response.data;
  },

  // Obtener partidos por campeonato
  getByCampeonato: async (campeonatoId) => {
    const response = await api.get(`/partidos?campeonato_id=${campeonatoId}`);
    return response.data;
  },

  // Obtener un partido específico
  getById: async (id) => {
    const response = await api.get(`/partidos/${id}`);
    return response.data;
  },

  // Crear un nuevo partido
  create: async (data) => {
    const response = await api.post('/partidos', data);
    return response.data;
  },

  // Actualizar resultado de partido
  updateResultado: async (id, data) => {
    const response = await api.put(`/partidos/${id}/resultado`, data);
    return response.data;
  },

  // Actualizar estado de partido
  updateEstado: async (id, estado) => {
    const response = await api.put(`/partidos/${id}/estado`, { estado_partido: estado });
    return response.data;
  },

  // Registrar resultado de partido (método antiguo, mantener compatibilidad)
  registrarResultado: async (id, data) => {
    const response = await api.put(`/partidos/${id}/resultado`, data);
    return response.data;
  },

  // Eliminar un partido
  delete: async (id) => {
    const response = await api.delete(`/partidos/${id}`);
    return response.data;
  },
};

export default partidosService;
