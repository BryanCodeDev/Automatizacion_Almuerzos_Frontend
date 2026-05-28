import React from 'react';
import reporteService from '../services/reporteService';
import empleadoService from '../services/empleadoService';

const ExportButton = ({ reporteType, params, disabled = false, text = 'Exportar a Excel' }) => {
  const handleExportar = async () => {
    try {
      let response;
      if (reporteType === 'semanal') {
        response = await reporteService.exportar(params);
      } else if (reporteType === 'empleado') {
        response = await reporteService.exportarEmpleado(params.id, {
          desde: params.desde,
          hasta: params.hasta
        });
      } else if (reporteType === 'boleta') {
        response = await reporteService.exportarBoletaDia({ fecha: params.fecha });
      }
      
      // Create a blob from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      let filename = `${reporteType}_reporte.xlsx`;
      if (reporteType === 'empleado') {
        filename = `historial_empleado_${params.id}.xlsx`;
      } else if (reporteType === 'boleta') {
        filename = `boleta_dia_${params.fecha}.xlsx`;
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Error exporting report:', err);
      alert('Error al exportar el reporte');
    }
  };

  return (
    <button
      onClick={handleExportar}
      disabled={disabled}
      className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
    >
      {text}
    </button>
  );
};

export default ExportButton;