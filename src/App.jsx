import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './app/hooks';
import { LoginScreen } from './features/auth/components/LoginScreen';
import MainLayout from './layouts/MainLayout';
import { selectIsAuthenticated, selectUserRole } from './features/auth/authSelectors';
import { useGetCurrentUserQuery } from './features/auth/authAPI';
import { useGetStudentProfileQuery } from './features/student/studentAPI';
import { PermissionGuard } from './shared/components/PermissionGuard';
import { LoadingState } from './shared/components/LoadingState';

// Route Components
import { DashboardView } from './features/dashboard/components/DashboardView';
import { StudentTableView } from './features/student/components/StudentTableView';
import { TeacherTableView } from './features/teacher/components/TeacherTableView';
import { ClassView } from './features/master/components/ClassView';
import { SubjectView } from './features/master/components/SubjectView';
import { ScheduleView } from './features/schedule/components/ScheduleView';
import { AttendanceView } from './features/attendance/components/AttendanceView';
import { ReportView } from './features/attendance/components/ReportView';
import { StudentPortalView } from './features/student/components/StudentPortalView';

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

          {/* Dashboard - hanya untuk admin/guru */}
          <Route
            path="/dashboard"
            element={
              <PermissionGuard permission="dashboard.view">
                <DashboardView />
              </PermissionGuard>
            }
          />

          {/* Data Siswa */}
          <Route
            path="/siswa"
            element={
              <PermissionGuard permission="siswa.view">
                <StudentTableView />
              </PermissionGuard>
            }
          />

          {/* Data Guru */}
          <Route
            path="/guru"
            element={
              <PermissionGuard permission="guru.view">
                <TeacherTableView />
              </PermissionGuard>
            }
          />

          {/* Data Kelas */}
          <Route
            path="/kelas"
            element={
              <PermissionGuard permission="kelas.view">
                <ClassView />
              </PermissionGuard>
            }
          />

          {/* Mata Pelajaran */}
          <Route
            path="/mapel"
            element={
              <PermissionGuard permission="mapel.view">
                <SubjectView />
              </PermissionGuard>
            }
          />

          {/* Jadwal */}
          <Route
            path="/jadwal"
            element={
              <PermissionGuard permission="jadwal.view">
                <ScheduleView />
              </PermissionGuard>
            }
          />

          {/* Absensi */}
          <Route
            path="/absensi"
            element={
              <PermissionGuard permission="absensi.view">
                <AttendanceView />
              </PermissionGuard>
            }
          />

          {/* Laporan */}
          <Route
            path="/laporan"
            element={
              <PermissionGuard permission="laporan.view">
                <ReportView />
              </PermissionGuard>
            }
          />

          {/* Portal Siswa */}
          <Route
            path="/profil"
            element={
              <PermissionGuard permission="profil.view">
                <StudentPortalView />
              </PermissionGuard>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthBootstrap>
  );
}
