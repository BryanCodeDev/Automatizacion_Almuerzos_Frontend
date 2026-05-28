import api from './api';

const verificarPorCedula = (ultimos4) => {
  return api.post('/verificar/cedula', { ultimos4 });
};

const verificarPorId = (id) => {
  return api.get(`/verificar/empleado/${id}`);
};

export default {
  verificarPorCedula,
  verificarPorId
};