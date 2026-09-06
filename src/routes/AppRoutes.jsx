import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated, selectUserRole } from '../features/auth/authSelectors';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

import LoginScreen from '../features/auth/components/LoginScreen';
import AuthLayout from '../layouts/AuthLayout';
import RoleLayout from '../layouts/RoleLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import NotFound from '../pages/NotFound/NotFound';
import Unauthorized from '../pages/Unauthorized/Unauthorized';

import DashboardView from '../features/dashboard/components/DashboardView';
import TeacherDashboard from '../features/dashboard/components/TeacherDashboard';
import StudentDashboard from '../features/dashboard/components/StudentDashboard';
import StudentTable from '../features/students/components/StudentTable';
import StudentPortal from '../features/students/components/StudentPortal';
import TeacherTable from '../features/teachers/components/TeacherTable';
import ClassList from '../features/classes/components/ClassList';
import SubjectList from '../features/subjects/components/SubjectList';
import ScheduleList from '../features/schedules/components/ScheduleList';
import AddSchedule from '../features/schedules/components/AddSchedule';
import AttendanceView from '../features/attendance/components/AttendanceView';
import ReportView from '../features/reports/components/ReportView';
import ProfileView from '../features/auth/components/ProfileView';
import SettingsView from '../features/settings/components/SettingsView';
import AddStudent from '../features/students/components/AddStudent';
import AddTeacher from '../features/teachers/components/AddTeacher';

const STAFF_ROUTES = [
  { path: ROUTES.STUDENTS, element: <StudentTable />, permission: 'siswa.view', roles: [ROLES.ADMIN, ROLES.TEACHER] },
  { path: `${ROUTES.STUDENTS}/create`, element: <AddStudent />, permission: 'siswa.create', roles: [ROLES.ADMIN] },
  { path: ROUTES.TEACHERS, element: <TeacherTable />, permission: 'guru.view', roles: [ROLES.ADMIN] },
  { path: `${ROUTES.TEACHERS}/create`, element: <AddTeacher />, permission: 'guru.create', roles: [ROLES.ADMIN] },
  { path: ROUTES.CLASSES, element: <ClassList />, permission: 'kelas.view', roles: [ROLES.ADMIN, ROLES.TEACHER] },
  { path: ROUTES.SUBJECTS, element: <SubjectList />, permission: 'mapel.view', roles: [ROLES.ADMIN, ROLES.TEACHER] },
  { path: ROUTES.SCHEDULES, element: <ScheduleList />, permission: 'jadwal.view', roles: [ROLES.ADMIN, ROLES.TEACHER] },
  { path: `${ROUTES.SCHEDULES}/tambah`, element: <AddSchedule />, permission: 'jadwal.create', roles: [ROLES.ADMIN, ROLES.TEACHER] },
  { path: ROUTES.ATTENDANCE, element: <AttendanceView />, permission: 'absensi.view', roles: [ROLES.ADMIN, ROLES.TEACHER] },
  { path: ROUTES.REPORTS, element: <ReportView />, permission: 'laporan.view', roles: [ROLES.ADMIN, ROLES.TEACHER] },
  { path: ROUTES.SETTINGS, element: <SettingsView />, permission: 'profil.view', roles: [ROLES.ADMIN] },
];

const RoleDashboard = () => {
  const role = useAppSelector(selectUserRole);
  if (role === ROLES.TEACHER) return <TeacherDashboard />;
  if (role === ROLES.STUDENT) return <StudentDashboard />;
  return <DashboardView />;
};

const RoleProfile = () => {
  const role = useAppSelector(selectUserRole);
  return role === ROLES.STUDENT ? <StudentPortal /> : <ProfileView />;
};

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
        <Route element={<RoleLayout />}>
          <Route index element={<IndexRoute />} />
          <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
          {STAFF_ROUTES.map(({ path, element, permission, roles }) => (
            <Route
              key={path}
              path={path}
              element={(
                <RoleRoute roles={roles}>
                  <ProtectedRoute permission={permission}>{element}</ProtectedRoute>
                </RoleRoute>
              )}
            />
          ))}
          <Route
            path={ROUTES.PROFILE}
            element={(
              <RoleRoute roles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
                <ProtectedRoute permission="profil.view"><RoleProfile /></ProtectedRoute>
              </RoleRoute>
            )}
          />
        </Route>
      </Route>

      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
