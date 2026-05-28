import api from './api';

const usuarioService = {
  getAll: () => api.get('/usuarios'),
  getById: (id) => api.get(`/usuarios/${id}`),
  create: (data) => api.post('/usuarios', data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  remove: (id) => api.delete(`/usuarios/${id}`)
};

export default usuarioService;