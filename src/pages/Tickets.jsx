import React, { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlineDownload, HiOutlineEye, HiOutlineX, HiOutlineCalendar } from 'react-icons/hi';
import ticketService from '../services/ticketService';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fecha, setFecha] = useState('');
  const [area, setArea] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    cargarTickets();
    cargarAreas();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      cargarTickets();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fecha, area]);

  const cargarTickets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (fecha) params.fecha = fecha;
      if (area) params.area = area;
      
      const response = await ticketService.getAll(params);
      setTickets(response.data);
    } catch (err) {
      console.error('Error cargando tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarAreas = async () => {
    try {
      const response = await ticketService.getAreas();
      setAreas(response.data);
    } catch (err) {
      console.error('Error cargando áreas:', err);
    }
  };

  const handlePreview = async (ticket) => {
    setSelectedTicket(ticket);
    try {
      const response = await ticketService.downloadTicket(ticket.ticket_codigo);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setPreviewImage(url);
    } catch (err) {
      console.error('Error obteniendo preview:', err);
    }
  };

  const handleDescargar = async (ticket) => {
    try {
      const response = await ticketService.downloadTicket(ticket.ticket_codigo);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket_${ticket.ticket_codigo}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error('Error descargando ticket:', err);
    }
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full border-4 border-t-indigo-600 border-b-transparent w-12 h-12"></div>
          <p className="mt-4 text-gray-600">Cargando tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Tickets de Almuerzo
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Historial de todos los tickets generados
              </p>
            </div>
            
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiOutlineSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o cédula..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="mt-4 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <HiOutlineCalendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="block w-full sm:w-48 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
          >
            <option value="">Todas las áreas</option>
            {areas.map((a, i) => (
              <option key={i} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Tickets */}
      <main className="mt-6 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron tickets</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                  <div className="flex-1 text-center">
                    <div className="w-32 h-24 mx-auto mb-3 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                      <img
                        src={`/api/tickets/${ticket.ticket_codigo}/download`}
                        alt={`Ticket ${ticket.ticket_codigo}`}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full bg-indigo-50 items-center justify-center">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h10M7 8h10M7 12h10M7 16h10M3 4h2m2 0h2m2 0h2m2 0h2m2 0h2m2 0h2M3 8h2m2 0h2m2 0h2m2 0h2m2 0h2m2 0h2M3 12h2m2 0h2m2 0h2m2 0h2m2 0h2m2 0h2M3 16h2m2 0h2m2 0h2m2 0h2m2 0h2m2 0h2z" />
                        </svg>
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-gray-900">{ticket.empleado?.nombre_completo || 'Empleado no encontrado'}</h3>
                    <p className="text-sm text-gray-500">{ticket.empleado?.cargo || '-'}</p>
                    <p className="text-xs text-gray-400">{ticket.empleado?.area || '-'}</p>
                    <p className="text-xs text-gray-400 mt-1">CC: {ticket.empleado?.cedula || '-'}</p>
                    <p className="text-xs font-mono text-indigo-600 mt-1">{ticket.ticket_codigo}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(ticket.fecha).toLocaleDateString('es-CO')} - {ticket.hora || ''}
                    </p>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handlePreview(ticket)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      title="Ver"
                    >
                      <HiOutlineEye className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Ver</span>
                    </button>
                    <button
                      onClick={() => handleDescargar(ticket)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      title="Descargar"
                    >
                      <HiOutlineDownload className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Descargar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Preview */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 relative">
            <button
              onClick={() => {
                setSelectedTicket(null);
                if (previewImage) {
                  URL.revokeObjectURL(previewImage);
                  setPreviewImage(null);
                }
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <HiOutlineX className="h-6 w-6" />
            </button>

            <div className="text-center">
              <div className="w-72 h-40 mx-auto mb-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-left">
                <div className="text-xs space-y-1">
                  <p><span className="font-bold text-indigo-600">ACCESO:</span> AUTORIZADO</p>
                  <p><span className="font-bold">NOMBRE:</span> {selectedTicket.empleado?.nombre_completo || 'N/A'}</p>
                  <p><span className="font-bold">CC:</span> {selectedTicket.empleado?.cedula || 'N/A'}</p>
                  <p><span className="font-bold">FECHA:</span> {new Date().toLocaleDateString('es-CO')} - {new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</p>
                  <p><span className="font-bold">CÓDIGO:</span> {selectedTicket.ticket_codigo}</p>
                </div>
              </div>

              <h2 className="text-lg font-bold text-gray-900">{selectedTicket.empleado?.nombre_completo || 'Empleado no encontrado'}</h2>
              <p className="text-sm text-gray-500">{selectedTicket.empleado?.cargo || '-'}</p>
              <p className="text-xs text-gray-400">{selectedTicket.empleado?.area || '-'}</p>
              <p className="text-xs text-gray-400 mt-1">CC: {selectedTicket.empleado?.cedula || '-'}</p>
              <p className="text-xs font-mono text-indigo-600 mt-1">{selectedTicket.ticket_codigo}</p>
              <p className="text-xs text-gray-400">
                {new Date(selectedTicket.fecha).toLocaleDateString('es-CO')} - {selectedTicket.hora || ''}
              </p>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => handleDescargar(selectedTicket)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Descargar PNG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tickets;