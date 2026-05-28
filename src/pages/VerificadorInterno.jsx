import React, { useState } from 'react';
import { HiOutlineQrcode, HiOutlineIdentification, HiOutlineSearch, HiOutlineUserGroup } from 'react-icons/hi';
import ScannerCamera from '../components/ScannerCamera';
import verificarService from '../services/verificarService';
import reporteService from '../services/reporteService';

const VerificadorInterno = () => {
  const [activeTab, setActiveTab] = useState('qr');
  const [scanning, setScanning] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScanQR = async (decodedText) => {
    setScanning(false);
    try {
      const qrData = JSON.parse(decodedText);
      const response = await verificarService.verificarPorId(qrData.id);
      setResultado(response.data);
    } catch (err) {
      setResultado({ success: false, mensaje: 'Error al verificar QR' });
    }
  };

  const handleVerificarCedula = async () => {
    if (codigo.length < 4) return;
    setLoading(true);
    try {
      const ultimos4 = codigo.slice(-4);
      const response = await verificarService.verificarPorCedula(ultimos4);
      setResultado(response.data);
    } catch (err) {
      setResultado({ success: false, mensaje: 'Error al verificar cédula' });
    } finally {
      setLoading(false);
    }
  };

  const reiniciar = () => {
    setCodigo('');
    setResultado(null);
    setScanning(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Verificador de Almuerzo
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Consulta el estado de entrega de almuerzos
              </p>
            </div>
            
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => { setActiveTab('qr'); reiniciar(); }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
                  activeTab === 'qr' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'
                }`}
              >
                <HiOutlineQrcode className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">QR</span>
              </button>
              <button
                onClick={() => { setActiveTab('cedula'); reiniciar(); }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
                  activeTab === 'cedula' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'
                }`}
              >
                <HiOutlineIdentification className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Cédula</span>
              </button>
              <button
                onClick={() => { setActiveTab('nombre'); reiniciar(); }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
                  activeTab === 'nombre' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'
                }`}
              >
                <HiOutlineSearch className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Nombre</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mt-6">
        <div className="max-w-7xl mx-auto px-4">
          {activeTab === 'qr' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Escaneo QR</h2>
              {scanning ? (
                <div className="aspect-video max-w-lg mx-auto">
                  <ScannerCamera onScan={handleScanQR} />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Escanea un código QR para verificar</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cedula' && (
            <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Verificar por Cédula</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Últimos 4 dígitos de la cédula
                </label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.slice(-4).replace(/\D/g, ''))}
                  placeholder="Ej: 7890"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  maxLength="4"
                />
              </div>

              <button
                onClick={handleVerificarCedula}
                disabled={loading || codigo.length < 4}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                Verificar
              </button>

              {resultado && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <pre className="text-xs">{JSON.stringify(resultado, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'nombre' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Próximamente: Búsqueda por nombre</h2>
              <p className="text-gray-600 text-center py-8">
                Funcionalidad en desarrollo
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default VerificadorInterno;