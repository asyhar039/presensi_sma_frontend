import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './app/hooks';
import { LoginScreen } from './features/auth/components/LoginScreen';
import MainLayout from './layouts/MainLayout';
import { selectIsAuthenticated, selectUserRole } from './features/auth/authSelectors';
import { useGetCurrentUserQuery } from './features/auth/authAPI';
import { useGetStudentProfileQuery } from './features/student/studentAPI';
import { PermissionGuard } from './shared/components/PermissionGuard';
import { LoadingState } from './shared/components/LoadingState';

import { DashboardView } from './features/dashboard/components/DashboardView';
import { StudentTableView } from './features/student/components/StudentTableView';
import { TeacherTableView } from './features/teacher/components/TeacherTableView';
import { ClassView } from './features/master/components/ClassView';
import { SubjectView } from './features/master/components/SubjectView';
import { ScheduleView } from './features/schedule/components/ScheduleView';
import { AttendanceView } from './features/attendance/components/AttendanceView';
import { ReportView } from './features/attendance/components/ReportView';
import { StudentPortalView } from './features/student/components/StudentPortalView';

const PROTECTED_ROUTES = [
  { path: '/dashboard', element: <DashboardView />, permission: 'dashboard.view' },
  { path: '/siswa', element: <StudentTableView />, permission: 'siswa.view' },
  { path: '/guru', element: <TeacherTableView />, permission: 'guru.view' },
  { path: '/kelas', element: <ClassView />, permission: 'kelas.view' },
  { path: '/mapel', element: <SubjectView />, permission: 'mapel.view' },
  { path: '/jadwal', element: <ScheduleView />, permission: 'jadwal.view' },
  { path: '/absensi', element: <AttendanceView />, permission: 'absensi.view' },
  { path: '/laporan', element: <ReportView />, permission: 'laporan.view' },
  { path: '/profil', element: <StudentPortalView />, permission: 'profil.view' },
];

function AuthBootstrap({ children }) {
  const { data: userResponse, isLoading: loadingUser } = useGetCurrentUserQuery();
  const isUserSessionActive = userResponse?.status === 'success' && userResponse?.data?.user;
  const { isLoading: loadingStudent } = useGetStudentProfileQuery(undefined, {
    skip: isUserSessionActive,
  });

  if (loadingUser || loadingStudent) {
    return <LoadingState message="Memuat aplikasi React..." />;
  }

  return children;
}

function IndexRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const defaultRoute = userRole === 'student' ? '/profil' : '/dashboard';
  return <Navigate to={defaultRoute} replace />;
}

export default function App() {
  return (
    <AuthBootstrap>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />

        <Route element={<MainLayout />}>
          <Route index element={<IndexRoute />} />

          {PROTECTED_ROUTES.map(({ path, element, permission }) => (
            <Route
              key={path}
              path={path}
              element={
                <PermissionGuard permission={permission}>
                  {element}
                </PermissionGuard>
              }
            />
          ))}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthBootstrap>
  );
}
