import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';
import AdminLayout from './AdminLayout';
import TeacherLayout from './TeacherLayout';
import StudentLayout from './StudentLayout';

const RoleLayout = () => {
  const { role } = useAuth();

  if (role === ROLES.ADMIN) return <AdminLayout />;
  if (role === ROLES.TEACHER) return <TeacherLayout />;
  if (role === ROLES.STUDENT) return <StudentLayout />;

  return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
};

export default RoleLayout;
