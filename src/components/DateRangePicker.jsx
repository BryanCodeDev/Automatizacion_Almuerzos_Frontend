import React, { useState } from 'react';
import { HiOutlineCalendar } from 'react-icons/hi';

const DateRangePicker = ({ 
  value, 
  onChange, 
  singleDate = false, 
  label = 'Seleccione rango de fechas' 
}) => {
  const [open, setOpen] = useState(false);
  const [desde, setDesde] = useState(value.desde || '');
  const [hasta, setHasta] = useState(value.hasta || '');

  const handleApply = () => {
    onChange({ desde, hasta });
    setOpen(false);
  };

  const handleClear = () => {
    setDesde('');
    setHasta('');
    onChange({ desde: '', hasta: '' });
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <HiOutlineCalendar className="h-5 w-5 text-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
            />
            {!singleDate && (
              <>
                <span className="text-gray-500">Hasta</span>
                <input
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  className="block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                />
              </>
            )}
          </div>
        </div>
        <div className="ml-auto">
          <button
            onClick={handleClear}
            className="text-sm text-gray-500 hover:text-gray-600"
          >
            Limpiar
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {open ? 'Cerrar' : 'Aplicar'}
          </button>
        </div>
      </div>
      
      {/* Date picker dropdown (simplified - in a real app you'd use a proper date picker) */}
      {open && (
        <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-2">
            <p className="px-4 text-sm text-gray-700">Seleccione fechas usando los campos de entrada arriba</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;