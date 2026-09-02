import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated, selectUserRole } from '../features/auth/authSelectors';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

import LoginScreen from '../features/auth/components/LoginScreen';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import StudentLayout from '../layouts/StudentLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import NotFound from '../pages/NotFound/NotFound';
import Unauthorized from '../pages/Unauthorized/Unauthorized';

import DashboardView from '../features/dashboard/components/DashboardView';
import StudentTable from '../features/students/components/StudentTable';
import StudentPortal from '../features/students/components/StudentPortal';
import TeacherTable from '../features/teachers/components/TeacherTable';
import ClassList from '../features/classes/components/ClassList';
import SubjectList from '../features/subjects/components/SubjectList';
import ScheduleList from '../features/schedules/components/ScheduleList';
import AttendanceView from '../features/attendance/components/AttendanceView';
import ReportView from '../features/reports/components/ReportView';
import ProfileView from '../features/auth/components/ProfileView';
import AddStudent from '../features/students/components/AddStudent';
import AddTeacher from '../features/teachers/components/AddTeacher';

const STAFF_ROUTES = [
  { path: ROUTES.DASHBOARD, element: <DashboardView />, permission: 'dashboard.view' },
  { path: ROUTES.STUDENTS, element: <StudentTable />, permission: 'siswa.view' },
  { path: `${ROUTES.STUDENTS}/create`, element: <AddStudent />, permission: 'siswa.create' },
  { path: ROUTES.TEACHERS, element: <TeacherTable />, permission: 'guru.view' },
  { path: `${ROUTES.TEACHERS}/create`, element: <AddTeacher />, permission: 'guru.create' },
  { path: ROUTES.CLASSES, element: <ClassList />, permission: 'kelas.view' },
  { path: ROUTES.SUBJECTS, element: <SubjectList />, permission: 'mapel.view' },
  { path: ROUTES.SCHEDULES, element: <ScheduleList />, permission: 'jadwal.view' },
  { path: ROUTES.ATTENDANCE, element: <AttendanceView />, permission: 'absensi.view' },
  { path: ROUTES.REPORTS, element: <ReportView />, permission: 'laporan.view' },
  { path: ROUTES.PROFILE, element: <ProfileView />, permission: 'profil.view' },
];

const IndexRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const defaultRoute = userRole === ROLES.STUDENT ? ROUTES.PROFILE : ROUTES.DASHBOARD;
  return <Navigate to={defaultRoute} replace />;
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<AuthLayout><LoginScreen /></AuthLayout>} />
      <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<IndexRoute />} />
          {STAFF_ROUTES.map(({ path, element, permission }) => (
            <Route
              key={path}
              path={path}
              element={<ProtectedRoute permission={permission}>{element}</ProtectedRoute>}
            />
          ))}
        </Route>

        <Route element={<StudentLayout />}>
          <Route element={<RoleRoute roles={[ROLES.STUDENT]} />}>
            <Route
              path={ROUTES.PROFILE}
              element={<ProtectedRoute permission="profil.view"><StudentPortal /></ProtectedRoute>}
            />
          </Route>
        </Route>
      </Route>

      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
