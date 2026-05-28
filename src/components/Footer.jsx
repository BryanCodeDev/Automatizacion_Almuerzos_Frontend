import { HiHeart, HiMail, HiPhone, HiGlobe } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-linear-to-r from-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <span className="font-bold text-xl">AlmuerzosApp</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sistema de gestión inteligente de almuerzos corporativos con tecnología QR.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <HiMail className="h-5 w-5 text-indigo-400" />
                <span className="text-sm">contacto@almuerzosapp.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <HiPhone className="h-5 w-5 text-indigo-400" />
                <span className="text-sm">+57 (1) 234-5678</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <HiGlobe className="h-5 w-5 text-indigo-400" />
                <span className="text-sm">www.almuerzosapp.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces rápidos</h3>
            <div className="space-y-2">
              <a href="/verificar" className="block text-gray-400 hover:text-white transition-colors text-sm">Verificar almuerzo</a>
              <a href="/login" className="block text-gray-400 hover:text-white transition-colors text-sm">Panel administrativo</a>
            </div>
          </div>
        </div>

<div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-1 text-gray-400 text-sm">
            <span>© {new Date().getFullYear()} AlmuerzosApp.</span>
            <span>Hecho con</span>
            <HiHeart className="h-4 w-4 text-red-500" />
            <span>en Colombia</span>
          </div>
          <div className="mt-4 sm:mt-0 text-gray-400 text-xs">
            Todos los derechos reservados
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;