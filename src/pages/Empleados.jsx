import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import empleadoService from '../services/empleadoService';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineQrcode } from 'react-icons/hi';
import QRCodeModal from '../components/QRCodeModal';

const Empleados = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    area: '',
    cargo: '',
    activo: true
  });
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    cargarEmpleados();
  }, [filters]);

  const cargarEmpleados = async () => {
    setLoading(true);
    try {
      const response = await empleadoService.getAll(filters);
      setEmpleados(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching empleados:', err);
      setError('Error al cargar la lista de empleados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (empleadoData) => {
    try {
      await empleadoService.create(empleadoData);
      await cargarEmpleados();
    } catch (err) {
      throw err;
    }
  };

  const handleUpdate = async (id, empleadoData) => {
    try {
      await empleadoService.update(id, empleadoData);
      await cargarEmpleados();
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea desactivar este empleado?')) {
      return;
    }
    try {
      await empleadoService.remove(id);
      await cargarEmpleados();
    } catch (err) {
      throw err;
    }
  };

  const handleExportar = async () => {
    try {
      const response = await empleadoService.exportar();
      // Create a blob from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'empleados.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Error exporting empleados:', err);
      setError('Error al exportar la lista de empleados');
    }
  };

  const handleVerQR = (empleado) => {
    setSelectedEmpleado(empleado);
    setShowQRModal(true);
  };

  const handleCloseQRModal = () => {
    setShowQRModal(false);
    setSelectedEmpleado(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full border-4 border-t-indigo-600 border-b-transparent w-12 h-12"></div>
            <p className="mt-4 text-gray-600">Cargando empleados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Empleados
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Administre los empleados y sus códigos QR
              </p>
            </div>
            <div className="shrink-0 flex space-x-3">
              <button
                onClick={() => navigate('/empleados/crear')}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus-ring-offset-2"
              >
                Nuevo Empleado
              </button>
              <button
                onClick={handleExportar}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus-ring-offset-2"
              >
                Exportar Excel
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Filters */}
          <div className="mb-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="mb-6 sm:mb-0">
                <h2 className="text-lg font-medium text-gray-900">
                  Lista de empleados ({empleados.length})
                </h2>
              </div>
              <div className="sm:flex">
                <div className="relative ml-3 sm:ml-0">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l1.217.707a1 1 0 00-.289 1.07l-.895 2.516a1 1 0 001.207.895l2.516-.895a1 1 0 001.07-.289L17.523 12H19a1 1 0 000-2h-2.476l-.293-.293a1 1 0 00-1.414-1.414l-.879-.88A5.998 5.998 0 012 8zm12 4.5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por nombre o cédula..."
                    className="block w-full pl-10 pr-4 py-2 rounded-md border-0 bg-gray-50 px-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus-ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <select
                    value={filters.area}
                    onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                    className="block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Todas las áreas</option>
                    <option value="Sistemas">Sistemas</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Finanzas">Finanzas</option>
                    <option value="Mercadeo">Mercadeo</option>
                    <option value="Operaciones">Operaciones</option>
                  </select>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <select
                    value={filters.cargo}
                    onChange={(e) => setFilters({ ...filters, cargo: e.target.value })}
                    className="block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            </div>
          </div>

          {/* Employees table */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex flex-wrap -mx-4 mb-4 -mt-2">
                <div className="w-full px-4 mt-2 lg:px-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      {/* Icon for sorting */}
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
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
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Estado</span>
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Acciones</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {empleados.map((empleado) => (
                          <tr key={empleado.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {empleado.nombre_completo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {empleado.cedula}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {empleado.area || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {empleado.cargo || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {empleado.activo ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Activo
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  Inactivo
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => navigate(`/empleados/${empleado.id}/editar`)}
                                  className="p-1 bg-indigo-100 rounded-md hover:bg-indigo-200 text-indigo-600"
                                >
                                  <HiOutlinePencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleVerQR(empleado)}
                                  className="p-1 bg-blue-100 rounded-md hover:bg-blue-200 text-blue-600"
                                >
                                  <HiOutlineQrcode className="h-4 w-4" />
                                </button>
                                {!empleado.activo ? (
                                  <button
                                    onClick={() => handleUpdate(empleado.id, { activo: true })}
                                    className="p-1 bg-green-100 rounded-md hover:bg-green-200 text-green-600"
                                  >
                                    <HiOutlinePlus className="h-4 w-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleDelete(empleado.id)}
                                    className="p-1 bg-red-100 rounded-md hover:bg-red-200 text-red-600"
                                  >
                                    <HiOutlineTrash className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {empleados.length === 0 && (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                              No se encontraron empleados
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* QR Code Modal */}
      {showQRModal && selectedEmpleado && (
        <QRCodeModal
          empleado={selectedEmpleado}
          onClose={handleCloseQRModal}
        />
      )}
    </>
  );
};

export default Empleados;