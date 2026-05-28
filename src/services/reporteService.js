import api from './api';

const reporteService = {
  getSemana: (params) => api.get('/reportes/semana', { params }),
  getEmpleado: (id, params) => api.get(`/reportes/empleado/${id}`, { params }),
  exportar: (params) => api.get('/reportes/exportar', { params, responseType: 'blob' }),
  getBoletaDia: (params) => api.get('/reportes/boleta-dia', { params })
};

export default reporteService;