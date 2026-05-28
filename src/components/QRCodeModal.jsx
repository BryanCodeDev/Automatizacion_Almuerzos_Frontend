import React from 'react';
import { HiOutlinePrinter } from 'react-icons/hi';

const QRCodeModal = ({ empleado, onClose }) => {
  if (!empleado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-gray-900">
              Código QR del Empleado
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-8">
            {/* QR Code Image */}
            {empleado.qr_imagen && (
              <div className="flex items-center justify-center mb-6">
                <img
                  src={`data:image/png;base64,${empleado.qr_imagen}`}
                  alt="QR Code"
                  className="w-48 h-48 border border-gray-200"
                />
              </div>
            )}
            
            {/* Employee Details */}
            <div className="space-y-4 text-center">
              <p className="text-lg font-medium text-gray-900">
                {empleado.nombre_completo}
              </p>
              <p className="text-sm text-gray-500">
                {empleado.cedula} • {empleado.area} • {empleado.cargo}
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <HiOutlinePrinter className="mr-2 h-4 w-4" />
              Imprimir QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;