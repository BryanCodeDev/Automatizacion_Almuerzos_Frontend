import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import registroService from '../services/registroService';
import { HiOutlinePrinter, HiOutlineCheckCircle, HiX } from 'react-icons/hi';

const Ticket = () => {
  const { ticket_codigo } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [printed, setPrinted] = useState(false);

  useEffect(() => {
    const cargarTicket = async () => {
      if (!ticket_codigo) {
        setError('Código de ticket no proporcionado');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await registroService.getTicket(ticket_codigo);
        setTicket(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError('Ticket no encontrado');
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };
    
    cargarTicket();
  }, [ticket_codigo]);

  const handleImprimir = () => {
    window.print();
    setPrinted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full border-4 border-t-indigo-600 border-b-transparent w-12 h-12"></div>
          <p className="mt-4 text-gray-600">Cargando ticket...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <HiX className="h-12 w-12 text-red-600 mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Ticket no encontrado</h2>
          <p className="mt-2 text-gray-600">El ticket con código {ticket_codigo} no existe o ha sido eliminado.</p>
          <div className="mt-6">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Volver atrás
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Cargando ticket...</p>
        </div>
      </div>
    );
  }

  // Format date and time
  const fecha = new Date(ticket.fecha);
  const hora = new Date(ticket.hora);
  const fechaFormateada = fecha.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const horaFormateada = hora.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Comprobante de Almuerzo
              </h1>
            </div>
            <div className="shrink-0">
              <button
                onClick={handleImprimir}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {printed ? 'Ticket enviado a impresión' : 'Imprimir Ticket'}
                <HiOutlinePrinter className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Ticket container */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-8">
              {/* Ticket content */}
              <div className="text-center space-y-6">
                {/* Logo placeholder */}
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-100 mx-auto mb-4">
                  <HiOutlineCheckCircle className="h-8 w-8 text-indigo-600" />
                </div>
                
                <h2 className="text-xl font-bold text-gray-900">
                  ¡Almuerzo Registrado Correctamente!
                </h2>
                
                <div className="divide-y divide-gray-200">
                  <div className="py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-gray-500">Empleado:</div>
                      <div className="font-medium text-gray-900">{ticket.empleado?.nombre_completo || 'N/A'}</div>
                      
                      <div className="text-gray-500">Cédula:</div>
                      <div className="font-medium text-gray-900">{ticket.empleado?.cedula || 'N/A'}</div>
                      
                      <div className="text-gray-500">Área:</div>
                      <div className="font-medium text-gray-900">{ticket.empleado?.area || 'N/A'}</div>
                      
                      <div className="text-gray-500">Cargo:</div>
                      <div className="font-medium text-gray-900">{ticket.empleado?.cargo || 'N/A'}</div>
                      
                      <div className="text-gray-500">Fecha:</div>
                      <div className="font-medium text-gray-900">{fechaFormateada}</div>
                      
                      <div className="text-gray-500">Hora:</div>
                      <div className="font-medium text-gray-900">{horaFormateada}</div>
                      
                      <div className="text-gray-500">Código de Ticket:</div>
                      <div className="font-mono text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                        {ticket.ticket_codigo}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Print notice */}
                {printed && (
                  <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500">
                    <p className="text-sm text-blue-800">
                      El ticket ha sido enviado a la impresora. Guarde este comprobante como registro de su almuerzo.
                    </p>
                  </div>
                )}
                
                {/* Legal notice */}
                <div className="mt-8 text-center text-xs text-gray-400">
                  Este comprobante es válido únicamente para el día de la fecha indicada. 
                  No se permite su reproducción o uso fraudulento.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Ticket;