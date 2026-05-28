import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Empleados from './pages/Empleados';
import Scanner from './pages/Scanner';
import Ticket from './pages/Ticket';
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuarios';
import UsuarioForm from './components/UsuarioForm';
import EmpleadoForm from './components/EmpleadoForm';
import Sidebar from './components/Sidebar';
import QREmpleados from './pages/QREmpleados';
import Verificar from './pages/Verificar';
import VerificadorInterno from './pages/VerificadorInterno';
import Tickets from './pages/Tickets';
import { useAuth } from './context/AuthContext';

const RequireAuth = ({ children, role }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  
  if (!user) return <Navigate to="/login" replace />;
  
  // Admin has access to everything
  if (role && user.rol !== role && user.rol !== 'admin') {
    return <div>No tiene permiso para acceder a esta página</div>;
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/verificar" element={<Verificar />} />
      <Route 
        path="/" 
        element={<Navigate to="/verificar" replace />}
      />
      <Route 
        path="/dashboard" 
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route 
        path="/empleados" 
        element={
          <RequireAuth>
            <Empleados />
          </RequireAuth>
        }
      />
      <Route 
        path="/empleados/crear" 
        element={
          <RequireAuth>
            <EmpleadoForm />
          </RequireAuth>
        }
      />
      <Route 
        path="/empleados/:id/editar" 
        element={
          <RequireAuth>
            <EmpleadoForm />
          </RequireAuth>
        }
      />
      <Route 
        path="/usuarios/crear" 
        element={
          <RequireAuth role="admin">
            <UsuarioForm />
          </RequireAuth>
        }
      />
      <Route 
        path="/usuarios/:id/editar" 
        element={
          <RequireAuth role="admin">
            <UsuarioForm />
          </RequireAuth>
        }
      />
      <Route 
        path="/scanner" 
        element={
          <RequireAuth role="operador">
            <Scanner />
          </RequireAuth>
        }
      />
      <Route 
        path="/ticket/:ticket_codigo" 
        element={
          <RequireAuth>
            <Ticket />
          </RequireAuth>
        }
      />
      <Route 
        path="/reportes" 
        element={
          <RequireAuth>
            <Reportes />
          </RequireAuth>
        }
      />
      <Route 
        path="/usuarios" 
        element={
          <RequireAuth role="admin">
            <Usuarios />
          </RequireAuth>
        }
      />
      <Route 
        path="/qr-empleados" 
        element={
          <RequireAuth role="admin">
            <QREmpleados />
          </RequireAuth>
        }
      />
      <Route 
        path="/verificador" 
        element={
          <RequireAuth>
            <VerificadorInterno />
          </RequireAuth>
        }
      />
      <Route 
        path="/tickets" 
        element={
          <RequireAuth>
            <Tickets />
          </RequireAuth>
        }
      />
      <Route path="*" element={<div className="p-8">Página no encontrada</div>} />
    </Routes>
  );
}

export default App;