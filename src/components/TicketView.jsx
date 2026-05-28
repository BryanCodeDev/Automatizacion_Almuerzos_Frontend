import React from 'react';

const TicketView = ({ ticket, onPrint }) => {
  if (!ticket) return null;

  const fecha = ticket.fecha ? new Date(ticket.fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'N/A';
  
  const hora = ticket.hora ? new Date(ticket.hora).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  }) : 'N/A';

  return (
    <div className="bg-white p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">COMPROBANTE DE ALMUERZO</h2>
        <p className="text-sm text-gray-600">Sistema de Almuerzos Corporativos</p>
      </div>

      <div className="border-t border-b border-gray-300 py-4 mb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-gray-600">Empleado:</span>
          <span className="font-medium text-right">{ticket.empleado?.nombre_completo || 'N/A'}</span>
          
          <span className="text-gray-600">Cédula:</span>
          <span className="font-medium text-right">{ticket.empleado?.cedula || 'N/A'}</span>
          
          <span className="text-gray-600">Área:</span>
          <span className="font-medium text-right">{ticket.empleado?.area || 'N/A'}</span>
          
          <span className="text-gray-600">Cargo:</span>
          <span className="font-medium text-right">{ticket.empleado?.cargo || 'N/A'}</span>
          
          <span className="text-gray-600">Fecha:</span>
          <span className="font-medium text-right">{fecha}</span>
          
          <span className="text-gray-600">Hora:</span>
          <span className="font-medium text-right">{hora}</span>
          
          <span className="text-gray-600">Ticket:</span>
          <span className="font-mono font-medium text-right">{ticket.ticket_codigo || 'N/A'}</span>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mb-4">
        Este comprobante es válido únicamente para el día indicado.
      </div>

      <button
        onClick={onPrint}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Imprimir Comprobante
      </button>
    </div>
  );
};

export default TicketView;