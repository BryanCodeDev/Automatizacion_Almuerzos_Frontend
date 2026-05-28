import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usuarioService from '../services/usuarioService';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';

const Usuarios = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.rol !== 'admin') {
      navigate('/dashboard');
      return;
    }
    cargarUsuarios();
  }, [user]);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await usuarioService.getAll();
      setUsuarios(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching usuarios:', err);
      setError('Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarClick = async (id) => {
    if (!window.confirm('¿Está seguro de que desea desactivar este usuario?')) {
      return;
    }
    try {
      await usuarioService.remove(id);
      await cargarUsuarios();
    } catch (err) {
      setError('Error al desactivar el usuario');
    }
  };

  if (!user || user?.rol !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full border-4 border-t-indigo-600 border-b-transparent w-12 h-12"></div>
          <p className="mt-4 text-gray-600">Cargando usuarios...</p>
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
                Gestión de Usuarios del Sistema
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Administre los usuarios y sus permisos
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => navigate('/usuarios/crear')}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <HiOutlinePlus className="mr-2 h-4 w-4" /> Nuevo Usuario
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Users table */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {usuario.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {usuario.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {usuario.rol === 'admin' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            Administrador
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Operador
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {usuario.activo ? (
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
                            onClick={() => navigate(`/usuarios/${usuario.id}/editar`)}
                            className="p-1 bg-indigo-100 rounded-md hover:bg-indigo-200 text-indigo-600"
                          >
                            <HiOutlinePencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEliminarClick(usuario.id)}
                            className="p-1 bg-red-100 rounded-md hover:bg-red-200 text-red-600"
                          >
                            <HiOutlineTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {usuarios.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No se encontraron usuarios
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Usuarios;