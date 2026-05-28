import React, { useState, useEffect } from 'react';
import reporteService from '../services/reporteService';

const DailyBoleta = ({ fecha }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (fecha) {
      fetchData();
    }
  }, [fecha]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await reporteService.getBoletaDia({ fecha });
      setData(response.data);
    } catch (err) {
      console.error('Error fetching daily boleta:', err);
      setError('Error al cargar la boleta del día');
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
        Seleccione una fecha para ver la boleta
      </div>
    );
  }

  const { total, desglose, registros } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Boleta del Día
        </h2>
        <p className="text-sm text-gray-500">
          Fecha: {new Date(fecha).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <div className="mt-3 text-right">
          <p className="text-sm font-medium text-gray-900">
            Total de almuerzos: <span className="ml-2 font-bold">{total}</span>
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Desglose por Área</h3>
          <div className="space-y-2">
            {Object.entries(desglose.area || {}).map(([area, count]) => (
              <div key={area} className="flex justify-between text-sm">
                <span className="text-gray-600">{area || 'Sin área'}</span>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Desglose por Cargo</h3>
          <div className="space-y-2">
            {Object.entries(desglose.cargo || {}).map(([cargo, count]) => (
              <div key={cargo} className="flex justify-between text-sm">
                <span className="text-gray-600">{cargo || 'Sin cargo'}</span>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Records table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empleado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cédula
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Área
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cargo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora de Registro
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registros.map((registro) => (
              <tr key={registro.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {registro.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registro.cedula}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registro.area || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registro.cargo || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(registro.hora).toLocaleTimeString('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
              </tr>
            ))}
            {registros.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No se registros de almuerzo para esta fecha
                </td>
              </tr>
            )}
</tbody>
         </table>
       </div>
       {registros.length === 0 && (
         <div className="text-center py-8 text-sm text-gray-500">
           No se registros de almuerzo para esta fecha
         </div>
       )}
     </div>
   );
};

export default DailyBoleta;