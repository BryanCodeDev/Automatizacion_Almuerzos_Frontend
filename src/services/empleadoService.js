import api from './api';

const empleadoService = {
  getAll: (params) => api.get('/empleados', { params }),
  getById: (id) => api.get(`/empleados/${id}`),
  create: (data) => api.post('/empleados', data),
  update: (id, data) => api.put(`/empleados/${id}`, data),
  remove: (id) => api.delete(`/empleados/${id}`),
  getQR: (id) => api.get(`/empleados/${id}/qr`),
  exportar: () => api.get('/empleados/exportar', { responseType: 'blob' })
};

export default empleadoService;