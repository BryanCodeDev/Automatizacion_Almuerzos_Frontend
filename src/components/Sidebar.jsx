import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineHome, HiOutlineUserGroup, HiOutlineQrcode, HiOutlineChartBar, HiOutlineUsers, HiOutlineLogout, HiOutlineClipboardList } from 'react-icons/hi';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: HiOutlineHome, label: 'Panel de Control', roles: ['admin', 'operador'] },
    { to: '/empleados', icon: HiOutlineUserGroup, label: 'Empleados', roles: ['admin', 'operador'] },
    { to: '/scanner', icon: HiOutlineQrcode, label: 'Escáner', roles: ['operador'] },
    { to: '/reportes', icon: HiOutlineChartBar, label: 'Reportes', roles: ['admin', 'operador'] },
    { to: '/usuarios', icon: HiOutlineUsers, label: 'Usuarios', roles: ['admin'] },
  ];

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg h-screen">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                <HiOutlineClipboardList className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-bold text-gray-900">Almuerzos Corp.</h2>
            </div>
          </div>
        </div>
        <nav className="mt-8 flex-1 px-2 space-y-1">
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
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex items-center w-full">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">{user?.nombre}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            title="Cerrar sesión"
          >
            <HiOutlineLogout className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;