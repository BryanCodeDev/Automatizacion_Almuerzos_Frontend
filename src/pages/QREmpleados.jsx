import React, { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlineDownload, HiOutlineEye, HiOutlineX } from 'react-icons/hi';
import empleadoService from '../services/empleadoService';

const QREmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ area: '', cargo: '' });
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  useEffect(() => {
    if (search.trim() === '' && filters.area === '' && filters.cargo === '') {
      cargarEmpleados();
    }
  }, [search, filters]);

  const cargarEmpleados = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filters.area) params.area = filters.area;
      if (filters.cargo) params.cargo = filters.cargo;
      
      const response = await empleadoService.getAll({ ...params, activo: true });
      setEmpleados(response.data);
    } catch (err) {
      console.error('Error cargando empleados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVer = (empleado) => {
    setSelectedEmpleado(empleado);
  };

  const handleDescargar = async (empleado) => {
    try {
      const response = await empleadoService.descargarQR(empleado.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `QR_${empleado.nombre_completo.replace(/\s+/g, '_')}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error descargando QR:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full border-4 border-t-indigo-600 border-b-transparent w-12 h-12"></div>
          <p className="mt-4 text-gray-600">Cargando empleados...</p>
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
                Códigos QR de Empleados
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Gestiona y descarga los códigos QR
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
          <select
            value={filters.area}
            onChange={(e) => setFilters({ ...filters, area: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
          >
            <option value="">Todas las áreas</option>
            <option value="Sistemas">Sistemas</option>
            <option value="Recursos Humanos">Recursos Humanos</option>
            <option value="Finanzas">Finanzas</option>
            <option value="Mercadeo">Mercadeo</option>
            <option value="Operaciones">Operaciones</option>
          </select>

          <select
            value={filters.cargo}
            onChange={(e) => setFilters({ ...filters, cargo: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
          >
            <option value="">Todos los cargos</option>
            <option value="Analista de Sistemas">Analista de Sistemas</option>
            <option value="Asistente de RRHH">Asistente de RRHH</option>
            <option value="Contador">Contador</option>
            <option value="Diseñadora Gráfica">Diseñadora Gráfica</option>
            <option value="Supervisor de Producción">Supervisor de Producción</option>
          </select>
        </div>
      </div>

      {/* Grid de QR Cards */}
      <main className="mt-6 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {empleados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron empleados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {empleados.map((empleado) => (
                <div key={empleado.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                  <div className="flex-1 text-center">
                    {empleado.qr_imagen ? (
                      <img
                        src={`data:image/png;base64,${empleado.qr_imagen}`}
                        alt={`QR ${empleado.nombre_completo}`}
                        className="w-32 h-32 mx-auto mb-3"
                      />
                    ) : (
                      <div className="w-32 h-32 mx-auto mb-3 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">QR no disponible</span>
                      </div>
                    )}
                    
                    <h3 className="font-medium text-gray-900">{empleado.nombre_completo}</h3>
                    <p className="text-sm text-gray-500">{empleado.cargo}</p>
                    <p className="text-xs text-gray-400">{empleado.area}</p>
                    <p className="text-xs text-gray-400 mt-1">CC: {empleado.cedula}</p>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleVer(empleado)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      title="Ver"
                    >
                      <HiOutlineEye className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Ver</span>
                    </button>
                    <button
                      onClick={() => handleDescargar(empleado)}
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

      {/* Modal */}
      {selectedEmpleado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 relative">
            <button
              onClick={() => setSelectedEmpleado(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <HiOutlineX className="h-6 w-6" />
            </button>

            <div className="text-center">
              {selectedEmpleado.qr_imagen ? (
                <img
                  src={`data:image/png;base64,${selectedEmpleado.qr_imagen}`}
                  alt={`QR ${selectedEmpleado.nombre_completo}`}
                  className="w-64 h-64 mx-auto mb-4"
                />
              ) : (
                <div className="w-64 h-64 mx-auto mb-4 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">QR no disponible</span>
                </div>
              )}

              <h2 className="text-lg font-bold text-gray-900">{selectedEmpleado.nombre_completo}</h2>
              <p className="text-sm text-gray-500">{selectedEmpleado.cargo}</p>
              <p className="text-xs text-gray-400">{selectedEmpleado.area}</p>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setSelectedEmpleado(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => handleDescargar(selectedEmpleado)}
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

export default QREmpleados;