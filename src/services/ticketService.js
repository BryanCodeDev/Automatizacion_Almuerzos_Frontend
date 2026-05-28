import api from './api';

const ticketService = {
  getAll: (params) => api.get('/tickets', { params }),
  getAreas: () => api.get('/tickets/areas'),
  downloadTicket: (ticket_codigo) => api.get(`/tickets/${ticket_codigo}/download`, { responseType: 'blob' })
};

export default ticketService;