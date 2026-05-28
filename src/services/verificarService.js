import api from './api';

const verificarService = {
  verificarPorCedula: (ultimos4) => api.post('/verificar/cedula', { ultimos4 }),
  registrar: (empleado_id, ultimos4) => api.post('/verificar/cedula/registrar', { empleado_id, ultimos4 }),
  descargarTicket: (ticket_codigo) => api.get(`/registros/ticket/${ticket_codigo}/download`, { responseType: 'blob' })
};

export default verificarService;