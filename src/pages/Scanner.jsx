import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import registroService from '../services/registroService';
import ScannerCamera from '../components/ScannerCamera';
import { HiOutlineExclamation, HiOutlineCheckCircle, HiX } from 'react-icons/hi';

const Scanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error'|'warning', message: string, empleado: object, ticket: object }
  const [lastScanTime, setLastScanTime] = useState(0);
  const [manualInput, setManualInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the manual input field when component mounts
    inputRef.current?.focus();
  }, []);

  const handleScan = async (decodedText) => {
    // Prevent multiple scans within 3 seconds
    const now = Date.now();
    if (now - lastScanTime < 3000) {
      return;
    }
    setLastScanTime(now);

    try {
      const result = await registroService.escanear(decodedText);
      
      if (result.data.success) {
        setFeedback({
          type: 'success',
          message: result.data.mensaje,
          empleado: result.data.empleado,
          ticket: {
            codigo: result.data.ticket_codigo,
            fecha: result.data.fecha,
            hora: result.data.hora
          }
        });
      } else {
        setFeedback({
          type: result.data.message.includes('Ya recibió') ? 'warning' : 'error',
          message: result.data.mensaje,
          empleado: result.data.empleado || null,
          ticket: result.data.hora_registro ? {
            codigo: 'Ya registrado',
            fecha: new Date().toISOString().slice(0, 10),
            hora: result.data.hora_registro
          } : null
        });
      }
    } catch (error) {
      console.error('Error scanning QR:', error);
      setFeedback({
        type: 'error',
        message: 'Error al procesar el código QR',
        empleado: null,
        ticket: null
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && manualInput.trim()) {
      handleScan(manualInput.trim());
      setManualInput('');
    }
  };

  const handleFeedbackClose = () => {
    setFeedback(null);
    // Resume scanning after 3 seconds if not already scanning
    if (!scanning) {
      setTimeout(() => setScanning(true), 3000);
    }
  };

  // Auto-resume scanning after feedback is shown for 3 seconds
  useEffect(() => {
    if (feedback && scanning) {
      setScanning(false);
      const timer = setTimeout(() => {
        setFeedback(null);
        setScanning(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback, scanning]);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Punto de Entrega de Almuerzos
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Escanee el código QR del empleado para registrar su almuerzo
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Scanner container */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              {/* Feedback area */}
              {feedback && (
                <div
                  role="alert"
                  className={`mb-6 p-4 rounded-lg ${feedback.type === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : feedback.type === 'warning'
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'bg-red-50 border border-red-200'}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {feedback.type === 'success' && (
                        <HiOutlineCheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      )}
                      {feedback.type === 'warning' && (
                        <HiOutlineExclamation className="h-5 w-5 text-yellow-600 mt-0.5" />
                      )}
                      {feedback.type === 'error' && (
                        <HiX className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {feedback.type === 'success' 
                          ? '¡Almuerzo registrado correctamente!'
                          : feedback.type === 'warning'
                            ? 'Atención'
                            : 'Error'}
                      </p>
                      {feedback.empleado && (
                        <div className="mt-2">
                          <p className="text-base font-semibold text-gray-900">
                            {feedback.empleado.nombre_completo}
                          </p>
                          <p className="text-xs text-gray-500">
                            {feedback.empleado.cedula} • {feedback.empleado.area} • {feedback.empleado.cargo}
                          </p>
                        </div>
                      )}
                      {feedback.ticket && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">
                            Hora: {new Date(feedback.ticket.hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {feedback.ticket.codigo !== 'Ya registrado' && (
                            <p className="text-xs text-gray-500">
                              Código: {feedback.ticket.codigo}
                            </p>
                          )}
                        </div>
                      )}
                      {feedback.message && (
                        <p className="mt-2 text-sm text-gray-700">
                          {feedback.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Scanner area */}
              <div className="aspect-w-16 aspect-h-9">
                {scanning && (
                  <ScannerCamera onScan={handleScan} />
                )}
                {!scanning && feedback && (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <div className="text-center">
                      {feedback.type === 'success' && (
                        <div className="text-green-600">
                          <HiOutlineCheckCircle className="h-12 w-12" />
                          <p className="mt-2 text-base font-medium">Listo para el siguiente escaneo</p>
                        </div>
                      )}
                      {feedback.type === 'warning' && (
                        <div className="text-yellow-600">
                          <HiOutlineExclamation className="h-12 w-12" />
                          <p className="mt-2 text-base font-medium">Espere antes del siguiente escaneo</p>
                        </div>
                      )}
                      {feedback.type === 'error' && (
                        <div className="text-red-600">
                          <HiOutlineXMark className="h-12 w-12" />
                          <p className="mt-2 text-base font-medium">Intente nuevamente</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Manual input */}
          <div className="mt-6">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="w-0 flex-1">
                    <label htmlFor="manual-input" className="sr-only">
                      Entrada manual de código
                    </label>
                    <input
                      id="manual-input"
                      type="text"
                      placeholder="Ingrese o escanee código manualmente..."
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      ref={inputRef}
                      className="block w-full pl-4 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (manualInput.trim()) {
                        handleScan(manualInput.trim());
                        setManualInput('');
                      }
                    }}
                    disabled={!manualInput.trim()}
                    className="flex-shrink-0 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Escanear
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  También puede usar un lector de códigos de barras físico (actúa como teclado)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Scanner;