import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

const ProtectedRoute = ({ permission, children }) => {
  const { isAuthenticated, permissions } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (permission && !permissions.includes(permission)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;
