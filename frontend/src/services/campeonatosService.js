import api from './api';

export const campeonatosService = {
  // Obtener campeonatos
  getAll: async (filters = {}) => {
    const response = await api.get('/campeonatos', { params: filters });
    return response.data;
  },

  // Obtener un campeonato específico
  getById: async (id) => {
    const response = await api.get(`/campeonatos/${id}`);
    return response.data;
  },

  // Obtener bracket/llaves de un campeonato
  getBracket: async (id) => {
    const response = await api.get(`/campeonatos/${id}/bracket`);
    return response.data;
  },

  // Crear un nuevo campeonato
  create: async (data) => {
    const response = await api.post('/campeonatos', data);
    return response.data;
  },

  // Actualizar un campeonato
  update: async (id, data) => {
    const response = await api.put(`/campeonatos/${id}`, data);
    return response.data;
  },

  // Inscribir equipo en campeonato
  inscribirEquipo: async (id, data) => {
    const response = await api.post(`/campeonatos/${id}/equipos`, data);
    return response.data;
  },
};

export default campeonatosService;
