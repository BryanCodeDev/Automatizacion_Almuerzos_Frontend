import React, { useState, useEffect } from 'react';
import reporteService from '../services/reporteService';

const EmployeeHistory = ({ employeeId, dateRange }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employeeId) {
      fetchData();
    }
  }, [employeeId, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await reporteService.getEmpleado(employeeId, dateRange);
      setData(response.data);
    } catch (err) {
      console.error('Error fetching employee history:', err);
      setError('Error al cargar el historial del empleado');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full border-4 border-t-indigo-600 border-b-transparent w-12 h-12"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-gray-500">
        Seleccione un empleado para ver su historial
      </div>
    );
  }

  const { empleado, registros, total } = data;

  return (
    <div className="space-y-6">
      {/* Employee info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-100">
              <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {empleado.nombre_completo}
            </h2>
            <p className="text-sm text-gray-500">
              {empleado.cedula} • {empleado.area} • {empleado.cargo}
            </p>
          </div>
        </div>
        <div className="mt-3 text-right">
          <p className="text-sm font-medium text-gray-900">
            Total de almuerzos en el período: <span className="ml-2">{total}</span>
          </p>
        </div>
      </div>

      {/* Records table */}
      <div className="overflow-x-auto">
        {registros.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código de Ticket
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registros.map((registro) => (
                <tr key={registro.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(registro.fecha).toLocaleDateString('es-CO')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(registro.hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 bg-gray-50 rounded">
                    {registro.ticket_codigo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No se encontraron registros en el período seleccionado
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeHistory;