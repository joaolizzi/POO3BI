import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { autenticado } = useAuth();
  return autenticado ? <Outlet /> : <Navigate to="/login" replace />;
}
