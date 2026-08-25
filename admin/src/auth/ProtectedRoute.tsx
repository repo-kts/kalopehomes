import { Navigate, Outlet } from 'react-router-dom';

import { PageLoader } from '@/components/ui/spinner';
import { useAuth } from './useAuth';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
