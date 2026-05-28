import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import reporteService from '../services/reporteService';
import { HiOutlineChartBar, HiOutlineClipboardList, HiOutlineDocumentText } from 'react-icons/hi';
import DateRangePicker from '../components/DateRangePicker';
import EmployeeSearch from '../components/EmployeeSearch';
import WeeklyTable from '../components/WeeklyTable';
import EmployeeHistory from '../components/EmployeeHistory';
import DailyBoleta from '../components/DailyBoleta';
import ExportButton from '../components/ExportButton';

const Reportes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('semanal'); // semanal, empleado, boleta
  const [dateRange, setDateRange] = useState({
    desde: '',
    hasta: ''
  });
  const [employeeId, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== 'empleado') setEmployeeId('');
    if (tab !== 'semanal') setDateRange({ desde: '', hasta: '' });
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleEmployeeChange = (id) => {
    setEmployeeId(id);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <>
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Reportes y Estadísticas
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Consulte y exporte reportes de almuerzos corporativos
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => handleTabChange('semanal')}
                className={`${activeTab === 'semanal'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-600'}
                  px-4 py-2 text-sm font-medium inline-flex items-center`}
              >
                <HiOutlineChartBar className="mr-2 h-4 w-4" /> Tabla Semanal
              </button>
              <button
                onClick={() => handleTabChange('empleado')}
                className={`${activeTab === 'empleado'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-600'}
                  px-4 py-2 text-sm font-medium inline-flex items-center`}
              >
                <HiOutlineClipboardList className="mr-2 h-4 w-4" /> Por Empleado
              </button>
              <button
                onClick={() => handleTabChange('boleta')}
                className={`${activeTab === 'boleta'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-600'}
                  px-4 py-2 text-sm font-medium inline-flex items-center`}
              >
                <HiOutlineDocumentText className="mr-2 h-4 w-4" /> Boleta del Día
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="space-y-6">
            {activeTab === 'semanal' && (
              <>
                <DateRangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                />
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                  <div className="p-6">
                    <WeeklyTable
                      dateRange={dateRange}
                      onExportar={() => {}}
                    />
                  </div>
                </div>
                <ExportButton
                  reporteType="semanal"
                  params={dateRange}
                  disabled={!dateRange.desde && !dateRange.hasta}
                />
              </>
            )}

            {activeTab === 'empleado' && (
              <>
                <EmployeeSearch
                  value={employeeId}
                  onChange={handleEmployeeChange}
                />
                {employeeId ? (
                  <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                      <EmployeeHistory
                        employeeId={employeeId}
                        dateRange={dateRange}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Seleccione un empleado para ver su historial</p>
                  </div>
                )}
                <ExportButton
                  reporteType="empleado"
                  params={{ id: employeeId, ...dateRange }}
                  disabled={!employeeId}
                />
              </>
            )}

            {activeTab === 'boleta' && (
              <>
                <DateRangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  singleDate={true}
                  label="Seleccione una fecha"
                />
                {dateRange.desde ? (
                  <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                      <DailyBoleta fecha={dateRange.desde} />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Seleccione una fecha para ver la boleta</p>
                  </div>
                )}
                <ExportButton
                  reporteType="boleta"
                  params={{ fecha: dateRange.desde }}
                  disabled={!dateRange.desde}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Reportes;