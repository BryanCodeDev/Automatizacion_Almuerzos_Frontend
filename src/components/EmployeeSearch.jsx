import React, { useState, useEffect } from 'react';
import empleadoService from '../services/empleadoService';

const EmployeeSearch = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      buscarEmpleados();
    } else if (searchTerm.length === 0) {
      setEmpleados([]);
    }
  }, [searchTerm]);

  const buscarEmpleados = async () => {
    setLoading(true);
    try {
      const response = await empleadoService.getAll({
        activo: true
      });
      // Filter by name or cedula
      const filtered = response.data.filter(emp => 
        emp.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.cedula.includes(searchTerm)
      );
      setEmpleados(filtered);
    } catch (err) {
      console.error('Error searching empleados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (empleado) => {
    setSearchTerm(empleado.nombre_completo);
    setEmpleados([]);
    onChange(empleado.id);
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-3">
        <div className="shrink-0">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l1.217.707a1 1 0 00-.289 1.07l-.895 2.516a1 1 0 001.207.895l2.516-.895a1 1 0 001.07-.289L17.523 12H19a1 1 0 000-2h-2.476l-.293-.293a1 1 0 00-1.414-1.414l-.879-.88A5.998 5.998 0 012 8zm12 4.5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <label className="sr-only">Buscar empleado</label>
          <input
            type="text"
            placeholder="Buscar empleado por nombre o cédula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 rounded-md border-0 bg-gray-50 px-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus-ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      
      {/* Suggestions dropdown */}
      {(empleados.length > 0 || loading) && searchTerm.length >= 2 && (
        <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {loading && (
            <div className="py-2 text-center text-sm text-gray-500">
              Buscando...
            </div>
          )}
          {!loading && empleados.length === 0 && (
            <div className="py-2 text-center text-sm text-gray-500">
              No se encontraron empleados
            </div>
          )}
          {!loading && empleados.length > 0 && (
            <ul className="py-1">
              {empleados.map((empleado) => (
                <li
                  key={empleado.id}
                  onClick={() => handleSelect(empleado)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="font-medium">{empleado.nombre_completo}</div>
                  <div className="text-xs text-gray-500">{empleado.cedula}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeSearch;