import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import verificarService from '../services/verificarService';
import { HiOutlineX, HiOutlineCheckCircle, HiOutlineCalendar, HiOutlineUser, HiDownload, HiLogin } from 'react-icons/hi';

const Verificar = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading) return;
      
      if (e.key >= '0' && e.key <= '9') {
        setInput(prev => prev.length < 4 ? prev + e.key : prev);
      } else if (e.key === 'Backspace') {
        setInput(prev => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        if (input.length === 4) verificar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, loading]);

  const verificar = async () => {
    if (input.length !== 4) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await verificarService.verificarPorCedula(input);
      setResultado(response.data);
    } catch (err) {
      setError('Error al verificar. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const registrarAlmuerzo = async (empleado_id = null) => {
    setLoading(true);
    
    try {
      const response = await verificarService.registrar(empleado_id, input);
      setResultado({ ...response.data, justRegistered: true });
    } catch (err) {
      setError('Error al registrar. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const reiniciar = () => {
    setInput('');
    setResultado(null);
    setError('');
  };

  const descargarTicket = async (ticket_codigo) => {
    try {
      const response = await verificarService.descargarTicket(ticket_codigo);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket_${ticket_codigo}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error downloading ticket:', error);
    }
  };

  const imprimirTicket = async (ticket_codigo) => {
    try {
      const response = await verificarService.descargarTicket(ticket_codigo);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const printWindow = window.open(url, '_blank');
      printWindow?.focus();
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error printing ticket:', error);
    }
  };

  const fechaActual = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const isRegistrado = resultado?.tipo === 'registrado' || resultado?.justRegistered;
  const isNoRegistrado = resultado?.tipo === 'no_registrado';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Verificador de Almuerzo</h1>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <HiLogin className="h-4 w-4 mr-2" />
            Iniciar sesión
          </button>
        </div>
      </header>

      <div className="text-center py-4 text-sm text-gray-600 capitalize">
        {fechaActual}
      </div>

      <main className="flex-1 flex items-center justify-center px-4">
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

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(-4))}
              className="sr-only"
              autoFocus
              maxLength={4}
              pattern="[0-9]{4}"
            />

            <div className="flex justify-center space-x-3 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-14 h-16 border-2 rounded-xl flex items-center justify-center text-2xl font-bold transition-all ${
                    i < input.length ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-400'
                  }`}
                >
                  {input[i] || ''}
                </div>
              ))}
            </div>

            {input.length === 4 && (
              <button
                onClick={verificar}
                disabled={loading}
                className="w-full px-6 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all text-lg"
              >
                {loading ? 'Verificando...' : 'Verificar'}
              </button>
            )}
          </div>
        ) : (
          <div className="w-full max-w-sm text-center">
            {resultado.tipo === 'no_habil' || resultado.tipo === 'fuera_horario' ? (
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <HiOutlineCalendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {resultado.mensaje}
                </h2>
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
                  {resultado.registro?.hora && (
                    <p>
                      <span className="font-medium text-gray-700">Hora:</span>{' '}
                      {new Date(resultado.registro.hora).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                  {resultado.ticket_codigo && (
                    <p><span className="font-medium text-gray-700">Código:</span> {resultado.ticket_codigo}</p>
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
                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => descargarTicket(resultado.ticket_codigo)}
                      className="flex-1 px-4 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 flex items-center justify-center"
                    >
                      <HiDownload className="h-4 w-4 mr-2" />
                      Descargar
                    </button>
                    <button
                      onClick={() => imprimirTicket(resultado.ticket_codigo)}
                      className="flex-1 px-4 py-3 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700"
                    >
                      Imprimir
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Verificar;