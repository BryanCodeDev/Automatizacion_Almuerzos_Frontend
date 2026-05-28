import React, { useState, useEffect, useMemo } from 'react';
import verificarService from '../services/verificarService';
import { HiOutlineX, HiOutlineCheckCircle, HiOutlineCalendar, HiOutlineUser, HiDownload, HiArrowLeft } from 'react-icons/hi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Verificar = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const isRegistrado = resultado?.tipo === 'registrado' || resultado?.justRegistered;
  const isNoRegistrado = resultado?.tipo === 'no_registrado';

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Bloquear si está cargando o si ya tiene resultado registrado
      if (loading || isRegistrado) return;
      
      if (e.key >= '0' && e.key <= '9') {
        setInput(prev => {
          const newInput = prev.length < 4 ? prev + e.key : prev;
          if (newInput.length === 4) {
            setTimeout(() => verificar(newInput), 100);
          }
          return newInput;
        });
      } else if (e.key === 'Backspace') {
        if (!resultado) {
          setInput(prev => prev.slice(0, -1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, resultado, isRegistrado]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {!resultado || input.length !== 4 ? (
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <HiOutlineUser className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¿Recibiste tu almuerzo hoy?
              </h2>
              <p className="text-gray-500">
                Ingresa los últimos 4 dígitos de tu cédula
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-center space-x-3 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-16 h-18 border-3 rounded-xl flex items-center justify-center text-3xl font-bold transition-all ${
                    i < input.length 
                      ? 'border-indigo-500 bg-indigo-100 text-indigo-700 shadow-md' 
                      : i === input.length && loading
                        ? 'border-emerald-500 bg-emerald-100 animate-pulse'
                        : 'border-gray-300 bg-white text-gray-400 shadow-sm'
                  }`}
                >
                  {input[i] || (i === input.length ? '_' : '')}
                </div>
              ))}
            </div>
            
            <p className="text-center text-sm text-gray-500 mb-6">
              Presiona las teclas numéricas del teclado para ingresar los 4 dígitos
            </p>

            {input.length === 4 && (
              <div className="flex space-x-3">
                <button
                  onClick={() => { setInput(''); }}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 disabled:opacity-50 transition-all"
                >
                  <HiArrowLeft className="h-5 w-5 inline mr-1" />
                  Limpiar
                </button>
                <button
                  onClick={() => verificar()}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all text-lg"
                >
                  {loading ? 'Verificando...' : 'Verificar'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-sm text-center">
            {resultado.tipo === 'no_habil' ? (
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <HiOutlineCalendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {resultado.mensaje}
                </h2>
                <button
                  onClick={() => reiniciar()}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Intentar otro código
                </button>
              </div>
            ) : resultado.tipo === 'no_encontrado' || resultado.tipo === 'multiple' ? (
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <HiOutlineX className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {resultado.mensaje}
                </h2>
                {resultado.tipo === 'multiple' && (
                  <div className="mt-6 space-y-2">
                    {resultado.empleados.map(emp => (
                      <button
                        key={emp.id}
                        onClick={() => registrarAlmuerzo(emp.id)}
                        disabled={loading}
                        className="w-full p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        <span className="font-medium text-gray-800">{emp.nombre_completo}</span>
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => reiniciar()}
                  className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Intentar otro código
                </button>
              </div>
            ) : (
              <div className={`p-8 rounded-2xl shadow-lg ${isRegistrado ? 'bg-indigo-50' : 'bg-blue-50'}`}>
                <HiOutlineCheckCircle className={`h-16 w-16 mx-auto mb-4 ${isRegistrado ? 'text-indigo-600' : 'text-blue-600'}`} />
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {isRegistrado 
                    ? '¡Correcto! Puedes recibir tu almuerzo' 
                    : 'Aún no has recibido tu almuerzo. ¿Deseas registrarlo?'}
                </h2>
                
                <div className="text-left space-y-3 bg-white p-4 rounded-xl">
                  <p><span className="font-medium text-gray-700">Nombre:</span> {resultado.empleado.nombre_completo}</p>
                  {resultado.empleado.area && (
                    <p><span className="font-medium text-gray-700">Área:</span> {resultado.empleado.area}</p>
                  )}
                  <p><span className="font-medium text-gray-700">Hora de verificación:</span> {new Date().toLocaleTimeString('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                  {resultado.empleado.cedula && (
                    <p><span className="font-medium text-gray-700">Cédula:</span> {resultado.empleado.cedula}</p>
                  )}
                </div>

                {isNoRegistrado && !resultado.justRegistered && (
                  <button
                    onClick={() => registrarAlmuerzo()}
                    disabled={loading}
                    className="mt-6 w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all"
                  >
                    {loading ? 'Registrando...' : 'Recibir Almuerzo'}
                  </button>
                )}

{isRegistrado && resultado.ticket_codigo && (
                   <div className="mt-4 flex space-x-3">
                     <button
                       onClick={() => reiniciar()}
                       className="flex-1 px-4 py-3 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700"
                     >
                       Digitar otro usuario
                     </button>
                     <button
                       onClick={() => descargarTicket(resultado.ticket_codigo)}
                       className="flex-1 px-4 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 flex items-center justify-center"
                     >
                       <HiDownload className="h-4 w-4 mr-2" />
                       Descargar ticket
                     </button>
                   </div>
                 )}
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Verificar;