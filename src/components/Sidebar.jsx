import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineHome, HiOutlineUserGroup, HiOutlineQrcode, HiOutlineChartBar, HiOutlineUsers, HiOutlineLogout, HiOutlineClipboardList, HiOutlineX, HiOutlineViewGrid, HiOutlineTicket } from 'react-icons/hi';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: HiOutlineHome, label: 'Panel de Control', roles: ['admin', 'operador'] },
    { to: '/empleados', icon: HiOutlineUserGroup, label: 'Empleados', roles: ['admin', 'operador'] },
    { to: '/scanner', icon: HiOutlineQrcode, label: 'Escáner', roles: ['operador'] },
    { to: '/reportes', icon: HiOutlineChartBar, label: 'Reportes', roles: ['admin', 'operador'] },
    { to: '/tickets', icon: HiOutlineTicket, label: 'Tickets', roles: ['admin', 'operador'] },
    { to: '/usuarios', icon: HiOutlineUsers, label: 'Usuarios', roles: ['admin'] },
    { to: '/qr-empleados', icon: HiOutlineViewGrid, label: 'QR Empleados', roles: ['admin'] },
    { to: '/verificar', icon: HiOutlineQrcode, label: 'Verificar (Público)', roles: ['admin', 'operador'] },
  ];

  // Hamburger button for mobile
  const HamburgerButton = () => (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
      aria-label="Abrir menú"
    >
      {isOpen ? <HiOutlineX className="h-6 w-6" /> : <HiOutlineClipboardList className="h-6 w-6" />}
    </button>
  );

  // Sidebar content
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center shrink-0 px-4 py-5">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
              <HiOutlineClipboardList className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-bold text-gray-900">Almuerzos Corp.</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden ml-auto p-1 text-gray-400 hover:text-gray-600"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pb-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (!item.roles.includes(user?.rol)) return null;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <item.icon
                className={`mr-3 h-5 w-5 shrink-0 ${
                  'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User info */}
      <div className="shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex items-center w-full">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">{user?.nombre}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <HiOutlineLogout className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile hamburger button (shown in pages) */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <HamburgerButton />
      </div>

      {/* Sidebar - mobile overlay */}
      <div className={`
        lg:hidden fixed inset-y-0 left-0 z-30 transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col w-64 bg-white shadow-xl h-screen">
          <SidebarContent />
        </div>
      </div>

      {/* Sidebar - desktop (always visible) */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:shadow-lg lg:h-screen">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;