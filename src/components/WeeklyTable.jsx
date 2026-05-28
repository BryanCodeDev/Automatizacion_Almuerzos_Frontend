import React, { useState, useEffect } from 'react';
import reporteService from '../services/reporteService';

const WeeklyTable = ({ dateRange }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (dateRange.desde || dateRange.hasta) {
      fetchData();
    }
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await reporteService.getSemana(dateRange);
      setData(response.data);
    } catch (err) {
      console.error('Error fetching weekly report:', err);
      setError('Error al cargar el reporte semanal');
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
        Seleccione un rango de fechas para ver el reporte
      </div>
    );
  }

  const { empleados, dias, matriz, totales } = data;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Empleado
            </th>
            {dias.map((dia, index) => (
              <th 
                key={index} 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {dia.charAt(0).toUpperCase() + dia.slice(1)}
              </th>
            ))}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {empleados.map((empleado) => (
            <tr key={empleado.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {empleado.nombre_completo}
              </td>
              {dias.map((dia, index) => (
                <td 
                  key={index} 
                  className="px-6 py-4 whitespace-nowrap text-center text-sm"
                >
                  {matriz[empleado.id] && matriz[empleado.id][dia] ? (
                    <span className="text-green-600 font-medium">✓</span>
                  ) : (
                    <span className="text-gray-400">─</span>
                  )}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {totales[empleado.id] || 0}
              </td>
            </tr>
          ))}
          
          {/* Totals row */}
          <tr className="bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              TOTAL
            </td>
            {dias.map((_, index) => (
              <td 
                key={index} 
                className="px-6 py-4 whitespace-nowrap text-center text-sm"
              >
                {/* Calculate daily totals - simplified */}
                <span className="text-gray-400">─</span>
              </td>
            ))}
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {data.total || 0}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyTable;