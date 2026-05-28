import api from './api';

const registroService = {
  escanear: (qrData) => api.post('/registros/escanear', { qr_data: qrData }),
  getHoy: () => api.get('/registros/hoy'),
  getTicket: (ticket_codigo) => api.get(`/registros/ticket/${ticket_codigo}`),
  remove: (id) => api.delete(`/registros/${id}`)
};

export default registroService;