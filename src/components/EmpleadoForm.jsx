import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import empleadoService from '../services/empleadoService';
import { HiOutlineCheckCircle } from 'react-icons/hi';

const EmpleadoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [empleado, setEmpleado] = useState({
    cedula: '',
    nombre_completo: '',
    area: '',
    cargo: '',
    activo: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      cargarEmpleado(id);
    }
  }, [id]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/empleados');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const cargarEmpleado = async (empleadoId) => {
    try {
      setLoading(true);
      const response = await empleadoService.getById(empleadoId);
      setEmpleado(response.data);
      setIsEditing(true);
    } catch (err) {
      console.error('Error fetching empleado:', err);
      setError('Error al cargar los datos del empleado');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpleado(prev => ({
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
      if (isEditing) {
        await empleadoService.update(id, empleado);
        setSuccess('Empleado actualizado correctamente');
      } else {
        await empleadoService.create(empleado);
        setSuccess('Empleado creado correctamente');
        setEmpleado({
          cedula: '',
          nombre_completo: '',
          area: '',
          cargo: '',
          activo: true
        });
      }
    } catch (err) {
      console.error('Error saving empleado:', err);
      setError(err.response?.data?.message || 'Error al guardar el empleado');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !empleado.nombre_completo && !id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full border-4 border-t-indigo-600 border-b-transparent w-12 h-12"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
              </h1>
            </div>
            <div className="shrink-0">
              <button
                onClick={() => navigate('/empleados')}
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
                    Cédula
                  </label>
                  <input
                    type="text"
                    name="cedula"
                    value={empleado.cedula}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="nombre_completo"
                    value={empleado.nombre_completo}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Área
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={empleado.area}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo
                    </label>
                    <input
                      type="text"
                      name="cargo"
                      value={empleado.cargo}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={empleado.activo}
                    onChange={(e) => setEmpleado(prev => ({
                      ...prev,
                      activo: e.target.checked
                    }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Empleado activo
                  </label>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (window.confirm('¿Está seguro de que desea desactivar este empleado?')) {
                          try {
                            await empleadoService.remove(id);
                            navigate('/empleados');
                          } catch (err) {
                            setError('Error al desactivar el empleado');
                          }
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Desactivar Empleado
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? 'Guardando...' : isEditing ? 'Actualizar Empleado' : 'Crear Empleado'}
                    <HiOutlineCheckCircle className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default EmpleadoForm;