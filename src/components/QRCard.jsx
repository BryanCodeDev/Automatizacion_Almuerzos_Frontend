import React from 'react';

const QRCard = ({ empleado, onPrint, onClose }) => {
  if (!empleado) return null;

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
      <div className="p-6 text-center">
        <div className="mb-4">
          {empleado.qr_imagen ? (
            <img 
              src={`data:image/png;base64,${empleado.qr_imagen}`} 
              alt={`QR de ${empleado.nombre_completo}`}
              className="w-48 h-48 mx-auto"
            />
          ) : (
            <div className="w-48 h-48 mx-auto bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500">QR no disponible</span>
            </div>
          )}
        </div>
        
        <div className="text-left space-y-2 mb-4">
          <p><span className="font-medium">Nombre:</span> {empleado.nombre_completo}</p>
          <p><span className="font-medium">Cédula:</span> {empleado.cedula}</p>
          <p><span className="font-medium">Área:</span> {empleado.area || '-'}</p>
          <p><span className="font-medium">Cargo:</span> {empleado.cargo || '-'}</p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onPrint}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Imprimir
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCard;