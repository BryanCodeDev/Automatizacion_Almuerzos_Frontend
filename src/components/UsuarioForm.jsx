import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usuarioService from '../services/usuarioService';
import { HiOutlineCheckCircle } from 'react-icons/hi';

const UsuarioForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    rol: 'operador',
    activo: true,
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.rol !== 'admin') {
      navigate('/dashboard');
      return;
    }
    if (id) {
      cargarUsuario(id);
    }
  }, [id, user]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/usuarios');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const cargarUsuario = async (id) => {
    try {
      setLoading(true);
      const response = await usuarioService.getById(id);
      setUsuario({
        nombre: response.data.nombre,
        email: response.data.email,
        rol: response.data.rol,
        activo: response.data.activo,
        password: ''
      });
    } catch (err) {
      console.error('Error fetching usuario:', err);
      setError('Error al cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (id) {
        const updateData = {
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          activo: usuario.activo
        };
        if (usuario.password) {
          updateData.password = usuario.password;
        }
        await usuarioService.update(id, updateData);
        setSuccess('Usuario actualizado correctamente');
      } else {
        await usuarioService.create(usuario);
        setSuccess('Usuario creado correctamente');
        setUsuario({
          nombre: '',
          email: '',
          rol: 'operador',
          activo: true,
          password: ''
        });
      }
    } catch (err) {
      console.error('Error saving usuario:', err);
      setError(err.response?.data?.message || 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user?.rol !== 'admin') {
    return null;
  }

  const isEditing = !!id;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h1>
            </div>
            <div className="shrink-0">
              <button
                onClick={() => navigate('/usuarios')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Volver a la lista
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={usuario.nombre}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={usuario.email}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <select
                    name="rol"
                    value={usuario.rol}
                    onChange={handleChange}
                    className="block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="admin">Administrador</option>
                    <option value="operador">Operador</option>
                  </select>
                </div>

                {/* FIX: Siempre mostrar el campo password; usar required condicional correctamente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isEditing ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={usuario.password}
                    onChange={handleChange}
                    required={!isEditing}
                    minLength={6}
                    className="block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                {isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      name="activo"
                      value={usuario.activo.toString()}
                      onChange={handleChange}
                      className="block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('¿Está seguro de que desea desactivar este usuario?')) {
                          usuarioService.remove(id).then(() => {
                            navigate('/usuarios');
                          });
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Desactivar Usuario
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? 'Guardando...' : isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
                    <HiOutlineCheckCircle className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UsuarioForm;