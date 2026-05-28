import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { HiOutlineUserGroup, HiOutlineDocumentText, HiOutlineQrcode, HiOutlineChartBar } from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    registradosHoy: 0,
    totalEmpleados: 0,
    porcentaje: 0
  });
  const [ultimosEscaneos, setUltimosEscaneos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [hoyResponse, empleadosResponse] = await Promise.all([
          api.get('/registros/hoy'),
          api.get('/empleados', { params: { activo: true } })
        ]);
        
        const registradosHoy = hoyResponse.data.length;
        const totalEmpleados = empleadosResponse.data.length;
        const porcentaje = totalEmpleados > 0 ? Math.round((registradosHoy / totalEmpleados) * 100) : 0;
        
        setStats({ registradosHoy, totalEmpleados, porcentaje });
        setUltimosEscaneos(hoyResponse.data.slice(0, 5));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
    const interval = setInterval(cargarDatos, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full border-4 border-t-indigo-600 border-b-transparent w-12 h-12"></div>
            <p className="mt-4 text-gray-600">Cargando datos...</p>
          </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
              <p className="mt-1 text-sm text-gray-600">Bienvenido, {user?.nombre}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick navigation cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <button
              onClick={() => navigate('/empleados')}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <HiOutlineUserGroup className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Empleados</h3>
                  <p className="text-sm text-gray-500">Gestionar empleados</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/scanner')}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <HiOutlineQrcode className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Escáner</h3>
                  <p className="text-sm text-gray-500">Registrar almuerzos</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/reportes')}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <HiOutlineChartBar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Reportes</h3>
                  <p className="text-sm text-gray-500">Ver estadísticas</p>
                </div>
              </div>
            </button>
            
            {user?.rol === 'admin' && (
              <button
                onClick={() => navigate('/usuarios')}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <HiOutlineUserGroup className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Usuarios</h3>
                    <p className="text-sm text-gray-500">Gestionar usuarios</p>
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Stats cards */}
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Registrados hoy */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <dl>
                      <dt className="sr-only">Registrados hoy</dt>
                      <dd className="text-3xl font-extrabold text-gray-900">{stats.registradosHoy}</dd>
                    </dl>
                  </div>
                  <div className="shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-100">
                      <HiOutlineUserGroup className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">Empleados que han recibido almuerzo hoy</p>
              </div>
            </div>

            {/* Total empleados */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <dl>
                      <dt className="sr-only">Total empleados</dt>
                      <dd className="text-3xl font-extrabold text-gray-900">{stats.totalEmpleados}</dd>
                    </dl>
                  </div>
                  <div className="shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-100">
                      <HiOutlineDocumentText className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">Empleados activos en el sistema</p>
              </div>
            </div>

            {/* Porcentaje */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <dl>
                      <dt className="sr-only">Porcentaje de asistencia</dt>
                      <dd className="text-3xl font-extrabold text-gray-900">{stats.porcentaje}%</dd>
                    </dl>
                  </div>
                  <div className="shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-100">
                      <HiOutlineQrcode className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">Porcentaje de empleados que han recibido almuerzo hoy</p>
              </div>
            </div>
          </div>

          {/* Latest scans */}
          <div className="mt-10">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Últimos escaneos</h2>
            <div className="space-y-6">
              {ultimosEscaneos.map((escaneo) => (
                <div key={escaneo.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start">
                    <div className="shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-100">
                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {escaneo.empleado?.nombre_completo || 'Empleado desconocido'}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 truncate">
                          {escaneo.empleado?.cedula || ''} • {escaneo.empleado?.area || ''} • {escaneo.empleado?.cargo || ''}
                        </dd>
                        <dd className="mt-1 text-xs text-gray-500">
                          {new Date(escaneo.hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              ))}
              {ultimosEscaneos.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay escaneos registrados hoy</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;